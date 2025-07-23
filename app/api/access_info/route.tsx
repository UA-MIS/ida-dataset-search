import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(request: NextRequest) {
  const accessInfo = await prisma.dataset_access_info.findMany();
  return NextResponse.json(accessInfo, { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const accessInfo = await prisma.dataset_access_info.create({
    data: {
      dataset_id: body.dataset_id,
      field: body.field,
      value: body.value,
    },
  });

  return NextResponse.json(accessInfo, { status: 201 });
}