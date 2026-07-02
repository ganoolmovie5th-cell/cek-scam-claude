import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { encodeBase64Url } from "@/lib/base64";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey    = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const vtKey      = process.env.VIRUSTOTAL_API_KEY?.trim();

  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!anonKey,
      SUPABASE_SERVICE_ROLE_KEY: !!serviceKey,
      VIRUSTOTAL_API_KEY: !!vtKey,
    },
  };

  // ── 1. Test Supabase ───────────────────────────────────────────
  if (!supabaseUrl || !serviceKey) {
    results.supabase = { status: "error", message: "Missing Supabase env vars" };
  } else {
    try {
      const supabase = createClient(supabaseUrl, serviceKey);
      const { error } = await supabase.from("scam_reports").select("count").limit(1);
      if (error) {
        results.supabase = {
          status: "error",
          message: error.message,
          hint: error.message.includes("does not exist")
            ? "Jalankan schema.sql di Supabase SQL Editor"
            : null,
        };
      } else {
        results.supabase = { status: "ok", message: "Connected ✅" };
      }
    } catch (e) {
      results.supabase = { status: "error", message: String(e) };
    }
  }

  // ── 2. Test VirusTotal ─────────────────────────────────────────
  if (!vtKey) {
    results.virustotal = { status: "error", message: "VIRUSTOTAL_API_KEY not set" };
  } else {
    try {
      // Ping VT API with a known safe URL (google.com)
      const testId = encodeBase64Url("https://www.google.com");

      const vtRes = await fetch(`https://www.virustotal.com/api/v3/urls/${testId}`, {
        headers: { "x-apikey": vtKey },
      });

      if (vtRes.status === 200) {
        const data = await vtRes.json();
        const stats = data?.data?.attributes?.last_analysis_stats;
        results.virustotal = {
          status: "ok",
          message: "API Key valid ✅",
          test_url: "https://www.google.com",
          stats,
        };
      } else if (vtRes.status === 401) {
        results.virustotal = {
          status: "error",
          message: "API Key invalid — cek ulang VIRUSTOTAL_API_KEY di Vercel",
          http_status: 401,
        };
      } else if (vtRes.status === 404) {
        // URL not in VT yet — but key is valid!
        results.virustotal = {
          status: "ok",
          message: "API Key valid ✅ (URL not in VT cache yet — normal)",
          http_status: 404,
        };
      } else if (vtRes.status === 429) {
        results.virustotal = {
          status: "warning",
          message: "Rate limit reached (4 req/min) — coba lagi 1 menit",
          http_status: 429,
        };
      } else {
        results.virustotal = {
          status: "error",
          message: `Unexpected response: ${vtRes.status}`,
        };
      }
    } catch (e) {
      results.virustotal = { status: "error", message: String(e) };
    }
  }

  // ── Overall status ─────────────────────────────────────────────
  const allOk =
    (results.supabase as Record<string, string>)?.status === "ok" &&
    ["ok", "warning"].includes((results.virustotal as Record<string, string>)?.status);

  return NextResponse.json({
    status: allOk ? "ok" : "partial",
    ...results,
  }, { status: 200 });
}
