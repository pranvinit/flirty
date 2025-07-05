import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  const { uuid } = await request.json();

  if (!uuid) {
    return NextResponse.json({ error: "UUID is required" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase.rpc("get_average_flirt_score", {
      user_uuid: uuid,
    });

    const averageScore = data !== null ? parseFloat(data.toFixed(2)) : 0;

    if (error) {
      return NextResponse.json(
        { error: `Error fetching average flirt score: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(averageScore, { status: 200 });
  } catch (error) {
    console.error("Error fetching average flirt score:", error);
    return NextResponse.json(
      { error: "Failed to fetch average flirt score", message: error.message },
      { status: 500 }
    );
  }
}
