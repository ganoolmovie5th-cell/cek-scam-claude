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

  // Show diagnostics
  const urlTrimmed = url.trim();
  const anonKeyTrimmed = anonKey.trim();
  const urlValid = urlTrimmed.startsWith("https://") && urlTrimmed.includes(".supabase.co");

  // Try raw fetch first to diagnose network issues
  try {
    const pingRes = await fetch(`${urlTrimmed}/rest/v1/`, {
      headers: {
        apikey: anonKeyTrimmed,
        Authorization: `Bearer ${anonKeyTrimmed}`,
      },
    });
    
    if (!pingRes.ok) {
      const body = await pingRes.text().catch(() => "");
      return NextResponse.json({
        status: "error",
        message: "Supabase REST API unreachable",
        http_status: pingRes.status,
        hint: pingRes.status === 401
          ? "Invalid API key — pastikan anon key bukan service_role, dan tidak ada spasi/karakter tersembunyi"
          : pingRes.status === 404
          ? "URL salah atau project tidak ditemukan"
          : "Cek apakah Supabase project aktif (tidak paused)",
        debug: {
          url_format_valid: urlValid,
          url_preview: urlTrimmed.substring(0, 40),
          url_length: urlTrimmed.length,
          anon_key_prefix: anonKeyTrimmed.substring(0, 20),
          anon_key_length: anonKeyTrimmed.length,
          response_body: body.substring(0, 200),
        },
      }, { status: 500 });
    }
  } catch (fetchErr) {
    return NextResponse.json({
      status: "error",
      message: "Cannot reach Supabase URL",
      error: String(fetchErr),
      hint: "Supabase project mungkin paused atau URL salah",
      debug: {
        url_preview: urlTrimmed.substring(0, 40),
        url_length: urlTrimmed.length,
        url_format_valid: urlValid,
      },
    }, { status: 500 });
  }

  // Try a simple Supabase query
  try {
    const supabase = createClient(urlTrimmed, serviceKey?.trim() ?? anonKeyTrimmed);
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
          ? "Table not found — please run supabase/schema.sql in Supabase SQL Editor"
          : error.hint ?? "Check RLS policies",
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
