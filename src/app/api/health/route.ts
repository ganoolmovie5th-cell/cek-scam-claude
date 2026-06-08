import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Check env vars exist
  if (!url || !anonKey) {
    return NextResponse.json({
      status: "error",
      message: "Missing Supabase environment variables",
      env: {
        NEXT_PUBLIC_SUPABASE_URL: !!url,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!anonKey,
        SUPABASE_SERVICE_ROLE_KEY: !!serviceKey,
      },
    }, { status: 500 });
  }

  // Try a simple Supabase query
  try {
    const supabase = createClient(url, serviceKey ?? anonKey);
    const { error } = await supabase
      .from("scam_reports")
      .select("count")
      .limit(1);

    if (error) {
      return NextResponse.json({
        status: "error",
        message: "Supabase connection failed",
        error: error.message,
        hint: error.hint ?? null,
        env: {
          NEXT_PUBLIC_SUPABASE_URL: true,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: true,
          SUPABASE_SERVICE_ROLE_KEY: !!serviceKey,
        },
      }, { status: 500 });
    }

    return NextResponse.json({
      status: "ok",
      message: "Supabase connected successfully ✅",
      env: {
        NEXT_PUBLIC_SUPABASE_URL: true,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: true,
        SUPABASE_SERVICE_ROLE_KEY: !!serviceKey,
      },
    });
  } catch (err) {
    return NextResponse.json({
      status: "error",
      message: "Unexpected error",
      error: String(err),
    }, { status: 500 });
  }
}
