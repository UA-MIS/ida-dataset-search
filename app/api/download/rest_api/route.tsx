import { NextRequest } from "next/server";
// @ts-ignore: No types for json2csv
import { Parser as Json2CsvParser } from "json2csv";
import { prisma } from "@/prisma/client";

function sanitizeFilename(name: string) {
  // Replace spaces with underscores, remove non-alphanumeric (except _ and -)
  return name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
}

export async function GET(req: NextRequest) {
  const format = req.nextUrl.searchParams.get("format") || "json";
  const datasetId = req.nextUrl.searchParams.get("datasetId");
  // Only log if error
  if (!datasetId) {
    console.error("[DOWNLOAD API] Missing datasetId");
    return new Response("Missing datasetId", { status: 400 });
  }

  // Fetch dataset name for filename
  let datasetName = "dataset";
  try {
    const dataset = await prisma.datasets.findUnique({
      where: { id: parseInt(datasetId) },
      select: { title: true },
    });
    if (dataset && dataset.title) {
      datasetName = sanitizeFilename(dataset.title);
    }
  } catch (err) {
    console.error("[DOWNLOAD API] Error fetching dataset name:", err);
  }

  // 1. Fetch access info for this dataset
  const accessInfo = await prisma.dataset_access_info.findMany({
    where: { dataset_id: parseInt(datasetId) },
  });
  const params = Object.fromEntries(
    accessInfo.map((ai) => [ai.field, ai.value])
  );

  // 2. Determine API call mode
  let apiUrl = "";
  let headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (process.env.API_KEY) {
    headers.Authorization = `Bearer ${process.env.API_KEY}`;
  }

  if (params.api_url) {
    // Mode 1: Full API URL provided
    apiUrl = params.api_url;
  } else if (params.url) {
    // Mode 2: Build URL from 'url', 'key', and context fields
    apiUrl = params.url;
    let urlObj = new URL(apiUrl);
    let keyUsed = false;
    if (params.key) {
      // Try to find a query param with empty value and fill it with the key
      for (const [k, v] of urlObj.searchParams.entries()) {
        if (v === "") {
          urlObj.searchParams.set(k, params.key);
          keyUsed = true;
          break;
        }
      }
      // If not used, append as 'apiKey' (common for many APIs)
      if (!keyUsed) {
        urlObj.searchParams.append("apiKey", params.key);
      }
    }
    // Add all other context fields as query params (excluding url, key, api_url)
    Object.entries(params).forEach(([k, v]) => {
      if (!["url", "key", "api_url"].includes(k)) {
        urlObj.searchParams.append(k, v);
      }
    });
    apiUrl = urlObj.toString();
  } else {
    console.error(
      "[DOWNLOAD API] No API URL or base url provided in access info",
      params
    );
    return new Response("No API URL or base url provided in access info", {
      status: 400,
    });
  }

  // 3. Make the GET request
  try {
    const apiRes = await fetch(apiUrl, {
      method: "GET",
      headers,
    });
    const data = await apiRes.json();

    if (format === "csv") {
      try {
        const parser = new Json2CsvParser();
        const csv = parser.parse(data);
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="${datasetName}.csv"`,
          },
        });
      } catch (err) {
        console.error("[DOWNLOAD API] Failed to convert to CSV", err);
        return new Response("Failed to convert to CSV", { status: 500 });
      }
    }

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${datasetName}.json"`,
      },
    });
  } catch (err) {
    console.error("[DOWNLOAD API] Error fetching or processing data:", err);
    return new Response("Failed to fetch or process data", { status: 500 });
  }
}
