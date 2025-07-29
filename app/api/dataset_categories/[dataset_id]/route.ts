import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(
  request: NextRequest,
  context: { params: { dataset_id: string } }
) {
  const { dataset_id } = await context.params;
  try {
    const datasetCategories = await prisma.$queryRaw`
    SELECT
        CONCAT(dc.dataset_id, '-', dc.category_id) AS relation_id,
        dc.dataset_id AS dataset_id,
        dc.category_id AS category_id,
        c.name AS name
    FROM
        (dataset_categories dc
        JOIN categories c ON ((dc.category_id = c.id)))
    WHERE dc.dataset_id = ${dataset_id}
    `;

    return NextResponse.json(datasetCategories);
  } catch (error) {
    console.error("Error fetching dataset categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch dataset categories" },
      { status: 500 }
    );
  }
}
