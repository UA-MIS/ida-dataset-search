import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(request: NextRequest) {
  const datasets = await prisma.dataset_categories.findMany();
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

  // Validate category exists
  const category = await prisma.categories.findUnique({
    where: { id: body.category_id },
  });
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  // Prevent duplicate relation
  const existingRelation = await prisma.dataset_categories.findFirst({
    where: { dataset_id: body.dataset_id, category_id: body.category_id },
  });
  if (existingRelation) {
    return NextResponse.json(
      { error: "Relation already exists" },
      { status: 409 }
    );
  }

  try {
    const newDatasetCategory = await prisma.dataset_categories.create({
      data: {
        dataset_id: body.dataset_id,
        category_id: body.category_id,
      },
    });
    return NextResponse.json(newDatasetCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create relation" },
      { status: 500 }
    );
  }
}
