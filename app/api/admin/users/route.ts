import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

// Clerk auth disabled for now — simplified version
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "User creation requires Clerk authentication (not yet configured)" },
    { status: 501 }
  );
}

export async function GET() {
  try {
    const dbUsers = await prisma.users.findMany();
    return NextResponse.json(dbUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
