import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request, { params }) {
  const { id: uuid } = await params;

  if (!uuid) {
    return NextResponse.json({ error: "UUID is required" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uuid)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Error fetching profile: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  const { id: uuid } = await params;
  // skip validation for simplicity
  const { profileData } = await request.json();

  if (!uuid || !profileData) {
    return NextResponse.json(
      { error: "UUID and profile information are required" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", uuid)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Error updating profile: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
