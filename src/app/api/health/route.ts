import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  // Check env vars exist
  if (!url || !anonKey || !serviceKey) {
    return NextResponse.json({
      status: "error",
      message: "Missing environment variables",
      env: {
        NEXT_PUBLIC_SUPABASE_URL: !!url,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!anonKey,
        SUPABASE_SERVICE_ROLE_KEY: !!serviceKey,
      },
    }, { status: 500 });
  }

  // Test connection using service_role key (server-side)
  try {
    const supabase = createClient(url, serviceKey);

    const { error } = await supabase
      .from("scam_reports")
      .select("count")
      .limit(1);

    if (error) {
      return NextResponse.json({
        status: "error",
        message: "Supabase query failed",
        error: error.message,
        hint: error.message.includes("does not exist")
          ? "Tabel belum dibuat — jalankan supabase/schema.sql di Supabase SQL Editor"
          : error.message,
        debug: {
          url_preview: url.substring(0, 40),
          url_length: url.length,
          service_key_prefix: serviceKey.substring(0, 20),
          service_key_length: serviceKey.length,
        },
      }, { status: 500 });
    }

    return NextResponse.json({
      status: "ok",
      message: "Supabase connected successfully ✅",
      env: {
        NEXT_PUBLIC_SUPABASE_URL: true,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: true,
        SUPABASE_SERVICE_ROLE_KEY: true,
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
