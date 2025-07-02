import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { dataset_id: string } }
) {
  const { dataset_id } = await context.params;

  const dataset = await prisma.datasets.findUnique({
    where: {
      id: parseInt(dataset_id),
    },
    include: {
      dataset_tags: {
        include: {
          tags: true,
        },
      },
    },
  });

  if (!dataset) {
    return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
  }

  // Transform the data to match the expected format
  const transformedDataset = {
    ...dataset,
    tags: dataset.dataset_tags.map((dt) => dt.tags.name),
  };

  return NextResponse.json(transformedDataset);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { dataset_id: string } }
) {
  const dataset = await prisma.datasets.findUnique({
    where: { id: parseInt(params.dataset_id) },
  });

  if (!dataset) {
    return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
  }

  const body = await request.json();

  const updatedDataset = await prisma.datasets.update({
    where: { id: dataset.id },
    data: {
      title: body.title,
      description: body.description,
      category: body.category,
    },
  });

  return NextResponse.json(updatedDataset);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { dataset_id: string } }
) {
  try {
    const datasetId = parseInt(params.dataset_id);

    if (isNaN(datasetId)) {
      return NextResponse.json(
        { error: "Invalid dataset ID" },
        { status: 400 }
      );
    }

    // First check if the dataset exists
    const dataset = await prisma.datasets.findUnique({
      where: { id: datasetId },
      include: {
        dataset_tags: true,
      },
    });

    if (!dataset) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
    }

    // Delete the dataset (this should cascade to dataset_tags)
    const deletedDataset = await prisma.datasets.delete({
      where: { id: datasetId },
    });

    return NextResponse.json({
      message: "Dataset deleted successfully",
      deletedDataset,
    });
  } catch (error) {
    console.error("Error deleting dataset:", error);
    return NextResponse.json(
      {
        error: "Failed to delete dataset",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
