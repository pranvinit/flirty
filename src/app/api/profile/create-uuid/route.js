import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request) {
  try {
    // Generate a new UUID if it doesn't exist
    const newUUID = crypto.randomUUID();

    const emptyProfileData = {
      id: newUUID,
      bio: "",
      avatar_url: null,
      hobbies: [],
      traits: [],
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("profiles")
      .insert([emptyProfileData])
      .select()
      .single();

    if (error) {
      console.error("Error inserting new profile:", error);
      return NextResponse.json(
        { error: `Error creating profile: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        uuid: data.id,
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error in create-uuid route:", error);

    return NextResponse.json(
      {
        error: "Failed to create or retrieve UUID",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
