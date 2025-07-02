import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, first_name, last_name, clerk_id } = body;

    // Validate required fields
    if (!username || !email || !first_name || !last_name || !clerk_id) {
      return NextResponse.json(
        { error: "Missing required fields: username, email, first_name, last_name, clerk_id" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ username }, { clerk_id }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this username or clerk_id" },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        first_name,
        last_name,
        clerk_id,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: newUser.username, // Using username as identifier
          username: newUser.username,
          clerk_id: newUser.clerk_id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        clerk_id: true,
        email: true,
        first_name: true,
        last_name: true,
        create_time: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
