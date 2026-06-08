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

  // Validate URL format
  const urlValid = url.startsWith("https://") && url.includes(".supabase.co");
  if (!urlValid) {
    return NextResponse.json({
      status: "error",
      message: "NEXT_PUBLIC_SUPABASE_URL format invalid",
      hint: "Should be: https://xxxxxxxxxxxx.supabase.co",
      received_format: url.substring(0, 10) + "...",
    }, { status: 500 });
  }

  // Try raw fetch first to diagnose network issues
  try {
    const pingRes = await fetch(`${url}/rest/v1/`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });
    
    if (!pingRes.ok) {
      return NextResponse.json({
        status: "error",
        message: "Supabase REST API unreachable",
        http_status: pingRes.status,
        hint: pingRes.status === 401
          ? "Invalid API key"
          : pingRes.status === 404
          ? "Wrong Supabase URL or project not found"
          : "Check if Supabase project is active (not paused)",
      }, { status: 500 });
    }
  } catch (fetchErr) {
    return NextResponse.json({
      status: "error",
      message: "Cannot reach Supabase URL",
      error: String(fetchErr),
      hint: "Check: 1) Supabase project is not paused, 2) URL is correct (https://xxxx.supabase.co)",
      url_preview: url.substring(0, 30) + "...",
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
