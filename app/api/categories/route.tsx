import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { Category } from "@/app/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const withUsage = searchParams.get("withUsage");

  if (name) {
    const categories = await prisma.categories.findMany({
      where: {
        name: name,
      },
    });
    return NextResponse.json(categories);
  }

  if (withUsage === "true") {
    const usedCategoriesRaw: Category[] = await prisma.$queryRaw`
      SELECT 
      c.id AS category_id,
      c.name AS category_name,
      COUNT(dc.category_id) AS usage_count
      FROM
          (categories c
          LEFT JOIN dataset_categories dc ON ((c.id = dc.category_id)))
      GROUP BY c.id , c.name
      ORDER BY usage_count DESC
    `;

    const usedCategories = usedCategoriesRaw.map((category: any) => {
      return {
        id: Number(category.category_id),
        name: category.category_name,
        usage_count: Number(category.usage_count),
      };
    });

    return NextResponse.json(usedCategories);
  }

  const categories = await prisma.categories.findMany();
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const category = await prisma.categories.findUnique({
    where: { name: body.name },
  });

  if (category) return NextResponse.json({ error: "Category already exists" });

  const newCategory = await prisma.categories.create({
    data: {
      name: body.name,
    },
  });

  return NextResponse.json(newCategory, { status: 201 });
}
