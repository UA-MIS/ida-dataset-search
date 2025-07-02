import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { tag_id: string } }
) {
  const { tag_id } = await context.params;

  const tag = await prisma.tags.findUnique({
    where: {
      id: parseInt(tag_id),
    },
  });
  return NextResponse.json(tag);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { tag_id: string } }
  ) {
    const tag = await prisma.tags.findUnique({
      where: { id: parseInt(params.tag_id) },
    });
  
    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }
  
    const body = await request.json();
  
    const updatedTag = await prisma.tags.update({
      where: { id: tag.id },
      data: {
        name: body.name,
      },
    });
  
    return NextResponse.json(updatedTag);
  }
  
  export async function DELETE(
    request: NextRequest,
    { params }: { params: { tag_id: string } }
  ) {
    const tag = await prisma.tags.findUnique({
      where: { id: parseInt(params.tag_id) },
    });
  
    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }
  
    await prisma.tags.delete({
      where: { id: tag.id },
    });
  
    return NextResponse.json({ message: "Tag deleted" });
  }
