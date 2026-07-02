import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// DELETE /api/clear-cache — wipe all url_checks cache
// Protected by secret key: ?key=YOUR_SECRET
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  // Simple protection
  if (key !== process.env.CACHE_CLEAR_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();

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
