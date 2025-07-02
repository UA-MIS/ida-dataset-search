import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

async function validateRequest(
  request: NextRequest
): Promise<WebhookEvent | null> {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return null;
  }

  // Get the body
  const payload = await request.text();
  const body = JSON.parse(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return null;
  }

  return evt;
}

export async function POST(request: NextRequest) {
  try {
    const evt = await validateRequest(request);

    if (!evt) {
      return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
    }

    const eventData = evt.data as any;
    const { id } = eventData;
    const eventType = evt.type;

    if (eventType === "user.created") {
      const { email_addresses, username } = eventData;

      // Get the primary email
      const primaryEmail = email_addresses?.find(
        (email: any) => email.id === eventData.primary_email_address_id
      );

      if (!primaryEmail) {
        return NextResponse.json(
          { error: "No primary email found" },
          { status: 400 }
        );
      }

      // Create user in your database
      try {
        const newUser = await prisma.users.create({
          data: {
            username: username || primaryEmail.email_address.split("@")[0], // Use username or email prefix
            email: primaryEmail.email_address,
            clerk_id: id,
            first_name: eventData.first_name || "",
            last_name: eventData.last_name || "",
          },
        });

        console.log("User created in database:", newUser);
        return NextResponse.json({ message: "User created successfully" });
      } catch (error) {
        console.error("Error creating user in database:", error);
        return NextResponse.json(
          { error: "Failed to create user in database" },
          { status: 500 }
        );
      }
    }

    if (eventType === "user.updated") {
      // Handle user updates if needed
      console.log("User updated:", id);
    }

    if (eventType === "user.deleted") {
      // Handle user deletion if needed
      console.log("User deleted:", id);
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
