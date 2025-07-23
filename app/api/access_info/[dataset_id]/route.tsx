import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { dataset_id: string } }
) {
  const { dataset_id } = params;
  const accessInfo = await prisma.dataset_access_info.findMany({
    where: {
      dataset_id: parseInt(dataset_id),
    },
  });
  return NextResponse.json(accessInfo, { status: 200 });
}
