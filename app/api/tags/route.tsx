import { NextRequest, NextResponse } from "next/server";
//import a schema for validation
import { prisma } from "@/prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const withUsage = searchParams.get("withUsage");

  if (name) {
    const tags = await prisma.tags.findMany({
      where: {
        name: name,
      },
    });
    return NextResponse.json(tags);
  }

  if (withUsage === "true") {
    // Fetch tags and join usage_count from tag_usage_summary
    const tags = await prisma.tags.findMany();
    const usageSummary = await prisma.tag_usage_summary.findMany();
    // Merge usage_count into tags
    const tagsWithUsage = tags.map((tag) => {
      const usage = usageSummary.find((u) => u.tag_id === tag.id);
      return { ...tag, usage_count: usage?.usage_count ?? 0 };
    });
    return NextResponse.json(tagsWithUsage);
  }

  const tags = await prisma.tags.findMany();
  return NextResponse.json(tags);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const tag = await prisma.tags.findUnique({
    where: { name: body.name },
  });

  if (tag) return NextResponse.json({ error: "Tag already exists" });

  const newTag = await prisma.tags.create({
    data: {
      name: body.name,
    },
  });

  return NextResponse.json(newTag, { status: 201 });
}
