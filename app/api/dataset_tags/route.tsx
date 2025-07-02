import { NextRequest, NextResponse } from "next/server";
//import a schema for validation
import { prisma } from "@/prisma/client";

export async function GET(request: NextRequest) {
  const datasets = await prisma.dataset_tags.findMany();
  return NextResponse.json(datasets);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  //validation goes here

  //   const dataset = await prisma.datasets.findUnique({
  //     where: { title: body.title },
  //   });

  //   if (dataset) return NextResponse.json({ error: "User already exists" });

  const newDataset = await prisma.dataset_tags.create({
    data: {
      dataset_id: body.dataset_id,
      tag_id: body.tag_id,
    },
  });

  return NextResponse.json(newDataset, { status: 201 });
}
