import { NextResponse } from "next/server";
import { getFlirtSuggestions } from "@/lib/gemini";

export async function POST(request) {
  const { profileData } = await request.json();

  try {
    const suggestions = await getFlirtSuggestions(profileData);

    return NextResponse.json(suggestions, { status: 200 });
  } catch (error) {
    console.error("Error fetching flirt suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch flirt suggestions", message: error.message },
      { status: 500 }
    );
  }
}
