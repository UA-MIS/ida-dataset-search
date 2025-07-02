import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Check if the current user is authenticated (anyone who can access admin page is considered an admin)
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, firstName, lastName } = body;
    // Validate required fields
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields: email, firstName, lastName" },
        { status: 400 }
      );
    }

    const clerk = await clerkClient();

    // Check if user already exists in Clerk
    const existing = await clerk.users.getUserList({ emailAddress: [email] });
    if (existing.data.length > 0) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 409 }
      );
    }

    // Create user in Clerk WITH password (required by your Clerk instance)
    const userData = {
      emailAddress: [email],
      firstName,
      lastName,
      username: email.split("@")[0], // Use email prefix as username
      password: `Temp${Date.now()}${Math.random()
        .toString(36)
        .substring(2, 8)}!`, // Secure temporary password
      publicMetadata: {
        role: "admin",
      },
    };

    console.log(
      "Sending user data to Clerk:",
      JSON.stringify(userData, null, 2)
    );

    const newClerkUser = await clerk.users.createUser(userData);

    // Create user in your database with the correct clerk_id
    const newUser = await prisma.users.create({
      data: {
        username: email.split("@")[0], // Use email prefix as username
        email: email,
        clerk_id: newClerkUser.id, // Store the actual Clerk user ID
        first_name: firstName,
        last_name: lastName,
      },
    });

    return NextResponse.json(
      {
        message:
          "User created successfully. Share the temporary password below with the user. They can log in and use 'Forgot password?' to set a new password.",
        user: {
          id: newClerkUser.id,
          email: newClerkUser.emailAddresses[0]?.emailAddress,
          firstName: newClerkUser.firstName,
          lastName: newClerkUser.lastName,
          role: "admin",
        },
        temporaryPassword: userData.password, // Include temp password for admin to share
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);

    // Log detailed error information
    if (error && typeof error === "object" && "errors" in error) {
      console.error(
        "Clerk validation errors:",
        JSON.stringify(error.errors, null, 2)
      );
    }

    if (error && typeof error === "object" && "message" in error) {
      console.error("Error message:", error.message);
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check if the current user is authenticated (anyone who can access admin page is considered an admin)
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerk = await clerkClient();

    // Get all users from Clerk
    const clerkUsersResponse = await clerk.users.getUserList();
    const clerkUsers = clerkUsersResponse.data;

    // Get users from your database
    const dbUsers = await prisma.users.findMany();

    // Combine the data
    const users = clerkUsers.map((clerkUser: any) => {
      const dbUser = dbUsers.find((dbUser) => dbUser.clerk_id === clerkUser.id);
      return {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        role: clerkUser.publicMetadata?.role,
        createdAt: clerkUser.createdAt,
        username: dbUser?.username,
      };
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
