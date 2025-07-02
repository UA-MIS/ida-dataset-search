import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(
  request: NextRequest,
  context: { params: { dataset_id: string } }
) {
  const { dataset_id } = await context.params;
  try {
    const datasetTags = await prisma.dataset_tags_view.findMany({
      where: {
        dataset_id: parseInt(dataset_id),
      },
    });

    return NextResponse.json(datasetTags);
  } catch (error) {
    console.error("Error fetching dataset tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch dataset tags" },
      { status: 500 }
    );
  }
}

