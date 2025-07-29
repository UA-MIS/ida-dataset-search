import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: { access_id: string; dataset_id: string } }
) {
  const { access_id, dataset_id } = params;
  const body = await request.json();
  const accessInfo = await prisma.dataset_access_info.update({
    where: { id: parseInt(access_id), dataset_id: parseInt(dataset_id) },
    data: {
      field: body.field,
      value: body.value,
    },
  });
  return NextResponse.json(accessInfo, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { access_id: string; dataset_id: string } }
) {
  const { access_id, dataset_id } = params;
  const accessInfo = await prisma.dataset_access_info.delete({
    where: { id: parseInt(access_id), dataset_id: parseInt(dataset_id) },
  });
  return NextResponse.json(accessInfo, { status: 200 });
}
