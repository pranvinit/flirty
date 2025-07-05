import { NextResponse } from "next/server";
import { judgeProfile } from "@/lib/gemini";

export async function POST(request) {
  const { profileData } = await request.json();

  try {
    const response = await judgeProfile(profileData);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching judge profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch judge profile", message: error.message },
      { status: 500 }
    );
  }
}
