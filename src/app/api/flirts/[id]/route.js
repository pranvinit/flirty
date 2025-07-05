import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { judgeFlirt } from "@/lib/gemini";

export async function PATCH(request, { params }) {
  const { id: flirtId } = await params;
  const { uuid, updatedFlirt, profileData } = await request.json();

  if (!uuid || !flirtId || !updatedFlirt) {
    return NextResponse.json(
      { error: "UUID, flirt ID, and updated flirt content are required" },
      { status: 400 }
    );
  }

  // judge the updated flirt
  const judgeResponse = await judgeFlirt(updatedFlirt.text, profileData || {});

  updatedFlirt.ai_score = judgeResponse.score;
  updatedFlirt.ai_feedback = judgeResponse.feedback;

  try {
    const { data, error } = await supabase
      .from("flirts")
      .update(updatedFlirt)
      .eq("id", flirtId)
      .eq("profile_id", uuid)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Error updating flirt: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error updating flirt:", error);
    return NextResponse.json(
      { error: "Failed to update flirt" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  await params;
  const { id: flirtId } = await params;
  const { uuid } = await request.json();

  if (!uuid || !flirtId) {
    return NextResponse.json(
      { error: "UUID and flirt ID are required" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("flirts")
      .delete()
      .eq("id", flirtId)
      .eq("profile_id", uuid)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Error deleting flirt: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error deleting flirt:", error);
    return NextResponse.json(
      { error: "Failed to delete flirt" },
      { status: 500 }
    );
  }
}
