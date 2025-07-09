import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function DELETE(
  request: NextRequest,
  context: { params: { dataset_id: string; category_id: string } }
) {
  const { dataset_id, category_id } = await context.params;
  try {
    await prisma.dataset_categories.delete({
      where: {
        dataset_id_category_id: {
          dataset_id: parseInt(dataset_id),
          category_id: parseInt(category_id),
        },
      },
    });
    return NextResponse.json({
      message: "Dataset categories deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting dataset categories:", error);
    return NextResponse.json(
      { error: "Failed to delete dataset categories" },
      { status: 500 }
    );
  }
}
