import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(
  request: NextRequest,
  context: { params: { dataset_id: string } }
) {
  const { dataset_id } = await context.params;
  try {
    const datasetTags = await prisma.$queryRaw`
    SELECT 
        CONCAT(dt.dataset_id, '-', dt.tag_id) AS relation_id,
        dt.dataset_id AS dataset_id,
        dt.tag_id AS tag_id,
        t.name AS name
    FROM
        (dataset_tags dt
        JOIN tags t ON ((dt.tag_id = t.id)))
    WHERE dt.dataset_id = ${dataset_id}
    `;

    return NextResponse.json(datasetTags);
  } catch (error) {
    console.error("Error fetching dataset tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch dataset tags" },
      { status: 500 }
    );
  }
}
