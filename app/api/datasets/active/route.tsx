import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const activeDatasets = await prisma.datasets.findMany({
    where: { isActive: "T" },
  });
  return NextResponse.json(activeDatasets);
}
