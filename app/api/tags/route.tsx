import { NextRequest, NextResponse } from "next/server";
//import a schema for validation
import { prisma } from "@/prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (name) {
    const tags = await prisma.tags.findMany({
      where: {
        name: name,
      },
    });
    return NextResponse.json(tags);
  }

  const tags = await prisma.tags.findMany();
  return NextResponse.json(tags);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  //validation goes here

  //   const dataset = await prisma.datasets.findUnique({
  //     where: { title: body.title },
  //   });

  //   if (dataset) return NextResponse.json({ error: "User already exists" });

  const newTag = await prisma.tags.create({
    data: {
      name: body.name,
    },
  });

  return NextResponse.json(newTag, { status: 201 });
}
