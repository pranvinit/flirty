import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { uuid } = await request.json();

    if (!uuid) {
      return NextResponse.json({ error: "UUID is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("flirts")
      .select("*")
      .eq("profile_id", uuid)
      .order("ai_score", { ascending: false })
      .limit(3);

    if (error) {
      return NextResponse.json(
        { error: `Error fetching top flirts: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching top flirts:", error);
    return NextResponse.json(
      { error: "Failed to fetch top flirts", message: error.message },
      { status: 500 }
    );
  }
}
