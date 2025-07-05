import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("avatar");
  const uuid = formData.get("uuid");

  if (!file || !uuid) {
    return NextResponse.json(
      { error: "File and UUID are required" },
      { status: 400 }
    );
  }

  try {
    // Upload to Supabase Storage with public access
    const fileName = `${uuid}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(data.path);

    return NextResponse.json({ avatar_url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 }
    );
  }
}
