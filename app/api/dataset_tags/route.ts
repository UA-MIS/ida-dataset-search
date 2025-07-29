import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(request: NextRequest) {
  const datasets = await prisma.dataset_tags.findMany();
  return NextResponse.json(datasets);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Validate dataset exists
  const dataset = await prisma.datasets.findUnique({
    where: { id: body.dataset_id },
  });
  if (!dataset) {
    return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
  }

  // Validate tag exists
  const tag = await prisma.tags.findUnique({
    where: { id: body.tag_id },
  });
  if (!tag) {
    return NextResponse.json({ error: "Tag not found" }, { status: 404 });
  }

  // Prevent duplicate relation
  const existingRelation = await prisma.dataset_tags.findFirst({
    where: { dataset_id: body.dataset_id, tag_id: body.tag_id },
  });
  if (existingRelation) {
    return NextResponse.json(
      { error: "Relation already exists" },
      { status: 409 }
    );
  }

  try {
    const newDatasetTag = await prisma.dataset_tags.create({
      data: {
        dataset_id: body.dataset_id,
        tag_id: body.tag_id,
      },
    });
    return NextResponse.json(newDatasetTag, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create relation" },
      { status: 500 }
    );
  }
}
