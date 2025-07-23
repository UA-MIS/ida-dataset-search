import { NextRequest } from "next/server";
// @ts-ignore: No types for json2csv
import { Parser as Json2CsvParser } from "json2csv";
import { prisma } from "@/prisma/client";
import mysql from "mysql2/promise";
// @ts-ignore: No types for pg
import { Client as PgClient } from "pg";

function sanitizeFilename(name: string) {
  return name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
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

  const { db_type, connection_string, sql_query } = {
    db_type: params.db_type,
    connection_string: params.connection_string,
    sql_query: params.sql_query,
  };

  if (!db_type || !connection_string || !sql_query) {
    return new Response("Missing db_type, connection_string, or sql_query", {
      status: 400,
    });
  }

  // Run query
  let rows: any[] = [];
  try {
    if (db_type === "mysql") {
      const conn = await mysql.createConnection(connection_string);
      const [mysqlRows] = await conn.execute(sql_query);
      if (!Array.isArray(mysqlRows)) {
        throw new Error("Expected rows to be an array");
      }
      rows = mysqlRows;
      await conn.end();
    } else if (db_type === "postgres") {
      const client = new PgClient({ connectionString: connection_string });
      await client.connect();
      const result = await client.query(sql_query);
      rows = result.rows;
      await client.end();
    } else {
      return new Response("Unsupported db_type", { status: 400 });
    }
  } catch (err) {
    console.error("[DOWNLOAD DB] Query error:", err);
    return new Response("Failed to run SQL query", { status: 500 });
  }

  // Format result
  try {
    if (format === "csv") {
      const parser = new Json2CsvParser();
      const csv = parser.parse(rows);
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${datasetName}.csv"`,
        },
      });
    }

    return new Response(JSON.stringify(rows), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${datasetName}.json"`,
      },
    });
  } catch (err) {
    console.error("[DOWNLOAD DB] Format conversion error:", err);
    return new Response("Error converting result", { status: 500 });
  }
}
