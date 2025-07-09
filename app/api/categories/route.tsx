import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

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
    // Fetch categories and join usage_count from category_usage_summary
    const categories = await prisma.categories.findMany();
    const usageSummary = await prisma.category_usage_summary.findMany();
    // Merge usage_count into categories
    const categoriesWithUsage = categories.map((category) => {
      const usage = usageSummary.find((u) => u.category_id === category.id);
      return { ...category, usage_count: usage?.usage_count ?? 0 };
    });
    return NextResponse.json(categoriesWithUsage);
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
