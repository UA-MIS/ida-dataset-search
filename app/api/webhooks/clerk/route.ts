import { NextRequest, NextResponse } from "next/server";

// Clerk webhooks disabled for now
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Clerk webhooks not yet configured" },
    { status: 501 }
  );
}
