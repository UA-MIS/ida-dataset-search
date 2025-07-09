import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function DELETE(
  request: NextRequest,
  context: { params: { dataset_id: string; tag_id: string } }
) {
  const { dataset_id, tag_id } = await context.params;
  try {
    await prisma.dataset_tags.delete({
      where: {
        dataset_id_tag_id: {
          dataset_id: parseInt(dataset_id),
          tag_id: parseInt(tag_id),
        },
      },
    });
    return NextResponse.json({
      message: "Dataset tags deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting dataset tags:", error);
    return NextResponse.json(
      { error: "Failed to delete dataset tags" },
      { status: 500 }
    );
  }
}
