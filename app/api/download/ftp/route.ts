import { NextRequest } from "next/server";
// @ts-ignore: No types for json2csv
import { Parser as Json2CsvParser } from "json2csv";
import { Client } from "basic-ftp";
import { prisma } from "@/prisma/client";
import csvToJson from "csvtojson";
import { Writable } from "stream";
import zlib from "zlib";

function sanitizeFilename(name: string) {
  return name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
}

async function getFileContent(conn: any, remotePath: string): Promise<Buffer> {
  let chunks: Buffer[] = [];
  const writable = new Writable({
    write(chunk, encoding, callback) {
      chunks.push(chunk);
      callback();
    },
  });
  await conn.downloadTo(writable, remotePath);
  return Buffer.concat(chunks);
}

export async function GET(req: NextRequest) {
  const datasetId = req.nextUrl.searchParams.get("datasetId");
  const format = req.nextUrl.searchParams.get("format") || "json";

  if (!datasetId) return new Response("Missing datasetId", { status: 400 });

  // Fetch dataset title
  let datasetName = "dataset";
  const dataset = await prisma.datasets.findUnique({
    where: { id: parseInt(datasetId) },
    select: { title: true },
  });
  if (dataset?.title) datasetName = sanitizeFilename(dataset.title);

  // Fetch access info
  const accessInfo = await prisma.dataset_access_info.findMany({
    where: { dataset_id: parseInt(datasetId) },
  });
  const params = Object.fromEntries(
    accessInfo.map((ai) => [ai.field, ai.value])
  );

  const {
    ftp_protocol,
    ftp_host,
    ftp_filename,
    ftp_username,
    ftp_password,
    ftp_path,
  } = {
    ftp_protocol: params.ftp_protocol,
    ftp_host: params.ftp_host,
    ftp_filename: params.ftp_filename,
    ftp_username: params.ftp_username,
    ftp_password: params.ftp_password,
    ftp_path: params.ftp_path,
  };

  if (
    !ftp_protocol ||
    !ftp_host ||
    !ftp_filename ||
    !ftp_username ||
    !ftp_password ||
    !ftp_path
  ) {
    return new Response(
      "Missing ftp_protocol, ftp_host, ftp_filename, ftp_username, ftp_password, or ftp_path",
      {
        status: 400,
      }
    );
  }

  let rows = [];
  try {
    console.log("[DOWNLOAD FTP] Connecting with:", {
      ftp_protocol,
      ftp_host,
      ftp_username,
      ftp_path,
      ftp_filename,
    });
    const conn = new Client();
    (conn.ftp as any).socketTimeout = 30000; // 30s timeout
    await conn.access({
      host: ftp_host,
      port: ftp_protocol === "ftp" ? 21 : 22,
      user: ftp_username,
      password: ftp_password,
      secure: false,
      // passive: true, // Not supported by basic-ftp, always passive by default
    });
    const list = await conn.list(ftp_path);
    console.log(
      "[DOWNLOAD FTP] Directory listing:",
      list.map((f) => f.name)
    );
    const remotePath = `${ftp_path}/${ftp_filename}`;
    console.log("[DOWNLOAD FTP] Downloading file from:", remotePath);
    const fileBuffer = await getFileContent(conn, remotePath);
    console.log("[DOWNLOAD FTP] File buffer length:", fileBuffer.length);
    console.log(
      "[DOWNLOAD FTP] File extension:",
      ftp_filename.split(".").pop()
    );

    let fileContentStr = null;
    if (ftp_filename.endsWith(".gz")) {
      console.log("[DOWNLOAD FTP] Detected .gz file, decompressing...");
      const decompressed = zlib.gunzipSync(fileBuffer);
      fileContentStr = decompressed.toString();
      console.log(
        "[DOWNLOAD FTP] Decompressed file content (first 500 chars):",
        fileContentStr.slice(0, 500)
      );
      // Determine the inner file type
      if (ftp_filename.replace(/\.gz$/, "").endsWith(".csv")) {
        console.log("[DOWNLOAD FTP] Parsing decompressed content as CSV");
        rows = await csvToJson().fromString(fileContentStr);
      } else if (ftp_filename.replace(/\.gz$/, "").endsWith(".json")) {
        console.log("[DOWNLOAD FTP] Parsing decompressed content as JSON");
        rows = JSON.parse(fileContentStr);
      } else {
        throw new Error("Unsupported file type inside .gz");
      }
    } else {
      fileContentStr = fileBuffer.toString();
      console.log(
        "[DOWNLOAD FTP] File content (first 500 chars):",
        fileContentStr.slice(0, 500)
      );
      if (ftp_filename.endsWith(".json")) {
        console.log("[DOWNLOAD FTP] Parsing as JSON");
        rows = JSON.parse(fileContentStr);
      } else if (ftp_filename.endsWith(".csv")) {
        console.log("[DOWNLOAD FTP] Parsing as CSV");
        rows = await csvToJson().fromString(fileContentStr);
      } else {
        throw new Error("Unsupported file type");
      }
    }
    await conn.close();
    console.log(
      "[DOWNLOAD FTP] Parsed rows count:",
      Array.isArray(rows) ? rows.length : typeof rows
    );
  } catch (err) {
    console.error("[DOWNLOAD FTP] File fetch or parse error:", err);
    return new Response("Failed to fetch or parse FTP file", { status: 500 });
  }

  // Format result
  try {
    if (format === "csv") {
      const parser = new Json2CsvParser();
      const csv = parser.parse(rows);

      // Increment download count
      try {
        await prisma.datasets.update({
          where: { id: parseInt(datasetId) },
          data: { downloads: { increment: 1 } },
        });
      } catch (err) {
        console.error(
          "[DOWNLOAD FTP] Failed to increment download count:",
          err
        );
      }

      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=\"${datasetName}.csv\"`,
        },
      });
    }

    // Increment download count
    try {
      await prisma.datasets.update({
        where: { id: parseInt(datasetId) },
        data: { downloads: { increment: 1 } },
      });
    } catch (err) {
      console.error("[DOWNLOAD FTP] Failed to increment download count:", err);
    }

    return new Response(JSON.stringify(rows), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename=\"${datasetName}.json\"`,
      },
    });
  } catch (err) {
    console.error("[DOWNLOAD FTP] Format conversion error:", err);
    return new Response("Error converting result", { status: 500 });
  }
}
