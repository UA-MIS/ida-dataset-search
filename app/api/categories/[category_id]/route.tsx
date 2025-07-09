import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(
  request: NextRequest,
  context: { params: { category_id: string } }
) {
  const { category_id } = await context.params;

  const category = await prisma.categories.findUnique({
    where: {
      id: parseInt(category_id),
    },
  });
  return NextResponse.json(category);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { category_id: string } }
) {
  const category = await prisma.categories.findUnique({
    where: { id: parseInt(params.category_id) },
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const body = await request.json();

  const updatedCategory = await prisma.categories.update({
    where: { id: category.id },
    data: {
      name: body.name,
    },
  });

  return NextResponse.json(updatedCategory);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { category_id: string } }
) {
  const category = await prisma.categories.findUnique({
    where: { id: parseInt(params.category_id) },
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  await prisma.categories.delete({
    where: { id: category.id },
  });

  return NextResponse.json({ message: "Category deleted" });
}
