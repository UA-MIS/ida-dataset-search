import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(
  request: NextRequest,
  context: { params: { dataset_id: string } }
) {
  const { dataset_id } = await context.params;
  try {
    const datasetCategories = await prisma.dataset_categories_view.findMany({
      where: {
        dataset_id: parseInt(dataset_id),
      },
    });

    return NextResponse.json(datasetCategories);
  } catch (error) {
    console.error("Error fetching dataset categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch dataset categories" },
      { status: 500 }
    );
  }
}
