import { NextRequest, NextResponse } from "next/server";
//import a schema for validation
import { prisma } from "@/prisma/client";
import { Tag } from "@/app/types";

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
    const usedTagsRaw: Tag[] = await prisma.$queryRaw`
      SELECT 
      t.id AS tag_id,
      t.name AS tag_name,
      COUNT(dt.tag_id) AS usage_count
      FROM
          (tags t
          LEFT JOIN dataset_tags dt ON ((t.id = dt.tag_id)))
      GROUP BY t.id , t.name
      ORDER BY usage_count DESC
    `;

    const usedTags = usedTagsRaw.map((tag: any) => {
      return {
        id: Number(tag.tag_id),
        name: tag.tag_name,
        usage_count: Number(tag.usage_count),
      };
    });

    return NextResponse.json(usedTags);
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
