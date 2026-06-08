import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    const supabase = createServerSupabaseClient();

    // Check if URL was already analyzed — increment counter
    const { data: existing } = await supabase
      .from("url_checks")
      .select("*")
      .eq("url", url.toLowerCase().trim())
      .single();

    if (existing) {
      await supabase
        .from("url_checks")
        .update({ check_count: existing.check_count + 1 })
        .eq("id", existing.id);

      return NextResponse.json({ cached: true, result: existing });
    }

    // Otherwise log the new check (result comes from client-side heuristic)
    return NextResponse.json({ cached: false });
  } catch (err) {
    console.error("check-url error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
