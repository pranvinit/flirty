import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { judgeFlirt } from "@/lib/gemini";

const FLIRTS_PER_PAGE = 3;

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const uuid = searchParams.get("uuid");
  const page = parseInt(searchParams.get("page")) || 1;

  if (!uuid) {
    return NextResponse.json({ error: "UUID is required" }, { status: 400 });
  }

  const from = (page - 1) * FLIRTS_PER_PAGE;
  const to = from + FLIRTS_PER_PAGE - 1;

  try {
    const { data, error, count } = await supabase
      .from("flirts")
      .select("*", { count: "exact" })
      .eq("profile_id", uuid)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      return NextResponse.json(
        { error: `Error fetching flirts: ${error.message}` },
        { status: 500 }
      );
    }

    const hasMore = to < count - 1;

    // wait for 2 second to simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ flirts: data, hasMore }, { status: 200 });
  } catch (error) {
    console.error("Error fetching flirts:", error);
    return NextResponse.json(
      { error: "Failed to fetch flirts" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { uuid, flirt, profileData } = await request.json();

  if (!uuid || !flirt) {
    return NextResponse.json(
      { error: "UUID and flirt content are required" },
      { status: 400 }
    );
  }

  // get response from judgeFlirt
  const judgeResponse = await judgeFlirt(flirt, profileData);

  const flirtData = {
    profile_id: uuid,
    text: flirt,
    ai_score: judgeResponse.score,
    ai_feedback: judgeResponse.feedback,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from("flirts")
      .insert(flirtData)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Error creating flirt: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating flirt:", error);
    return NextResponse.json(
      { error: "Failed to create flirt" },
      { status: 500 }
    );
  }
}
