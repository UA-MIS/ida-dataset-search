import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { Overview } from "@/app/types";

export async function GET(request: NextRequest) {
  const overview = await prisma.$queryRaw<Overview[]>`
  SELECT
  (SELECT COUNT(*) FROM datasets) AS datasets,
  (SELECT COUNT(*) FROM datasets WHERE isActive = "T") AS active_datasets,
  (SELECT SUM(downloads) FROM datasets) AS total_downloads,
  (SELECT COUNT(*) FROM users) AS users,
  (SELECT COUNT(*) FROM tags) AS tags,
  (SELECT COUNT(*) FROM categories) AS categories;
  `;

  if (!overview || overview.length === 0) {
    return NextResponse.json(
      { error: "No overview data found" },
      { status: 404 }
    );
  }

  // Convert BigInt values to numbers/strings for JSON serialization
  const data = overview[0];
  return NextResponse.json({
    datasets: Number(data.datasets),
    active_datasets: Number(data.active_datasets),
    total_downloads: Number(data.total_downloads),
    users: Number(data.users),
    tags: Number(data.tags),
    categories: Number(data.categories),
  });
}
