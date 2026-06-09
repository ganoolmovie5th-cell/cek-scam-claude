import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

// DELETE /api/clear-cache — wipe all url_checks cache
// Protected by secret key: ?key=YOUR_SECRET
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  // Simple protection — dev fallback only allowed in development environment
  const isDev = process.env.NODE_ENV === "development";
  if (key !== process.env.CACHE_CLEAR_KEY && !(isDev && key === "dev-clear-2024")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();

  const { error, count } = await supabase
    .from("url_checks")
    .delete({ count: "exact" })
    .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    status: "ok",
    message: `Cache cleared — ${count ?? 0} entries deleted ✅`,
  });
}
