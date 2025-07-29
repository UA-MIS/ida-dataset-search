import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

async function updateClerkUser(
  clerkUserId: string,
  data: {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  }
) {
  const response = await fetch(
    `https://api.clerk.dev/v1/users/${clerkUserId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to update Clerk user: ${await response.text()}`);
  }
  return await response.json();
}

async function deleteClerkUser(clerkUserId: string) {
  const response = await fetch(
    `https://api.clerk.dev/v1/users/${clerkUserId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to delete Clerk user: ${await response.text()}`);
  }
  return await response.json();
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { user_id: string } }
) {
  const user = await prisma.users.findUnique({
    where: { id: parseInt(params.user_id) },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await request.json();

  try {
    // Update Clerk first
    await updateClerkUser(user.clerk_id, {
      username: body.username,
      email: body.email,
      first_name: body.first_name,
      last_name: body.last_name,
    });

    // Update DB
    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        username: body.username,
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { user_id: string } }
) {
  const user = await prisma.users.findUnique({
    where: { id: parseInt(params.user_id) },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    // Delete from Clerk first
    await deleteClerkUser(user.clerk_id);

    // Delete from DB
    await prisma.users.delete({
      where: { id: user.id },
    });

    return NextResponse.json({ message: "User deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
