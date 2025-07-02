import { NextRequest, NextResponse } from "next/server";
//import a schema for validation
import { prisma } from "@/prisma/client";

export async function GET(request: NextRequest) {
  const datasets = await prisma.datasets.findMany();
  return NextResponse.json(datasets);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  //validation goes here

//   const dataset = await prisma.datasets.findUnique({
//     where: { title: body.title },
//   });

//   if (dataset) return NextResponse.json({ error: "User already exists" });

  const newDataset = await prisma.datasets.create({
    data: {
      title: body.title,
      category: body.category,
      description: body.description,
    },
  });

  return NextResponse.json(newDataset, { status: 201 });
}
