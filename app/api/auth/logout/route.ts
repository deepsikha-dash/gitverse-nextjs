import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/middleware";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");

    if (contentType && !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json"},
        { status: 400 }
      );
    }

const contentLength = request.headers.get("content-length");

if (
  contentType &&
  contentType.includes("application/json") &&
  contentLength !== "0"
) {
  const rawBody = await request.text();

  // Only validate JSON when body actually exists
  if (rawBody.trim().length > 0) {
    try {
      JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }
  }
}
    //Authentication user
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 });
    }

  //Logout response

  // In a stateless JWT setup, logout is handled client-side by removing the token
  // We can optionally implement token blacklisting here if needed

  return NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

} catch (error) {
    console.error("Logout API Error:", error);

    //prevent stack trace from reaching client
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}