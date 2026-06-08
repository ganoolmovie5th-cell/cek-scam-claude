import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ── VirusTotal helpers ─────────────────────────────────────────────
const VT_API_KEY = process.env.VIRUSTOTAL_API_KEY ?? "";
const VT_BASE = "https://www.virustotal.com/api/v3";

function encodeBase64Url(str: string): string {
  // VirusTotal requires base64url-encoded URL (no padding)
  const b64 = Buffer.from(str).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function vtGetUrl(url: string) {
  const id = encodeBase64Url(url);
  const res = await fetch(`${VT_BASE}/urls/${id}`, {
    headers: { "x-apikey": VT_API_KEY },
    next: { revalidate: 3600 }, // cache 1 hour
  });
  if (res.status === 404) return null; // not analysed yet
  if (!res.ok) throw new Error(`VT GET failed: ${res.status}`);
  return res.json();
}

async function vtScanUrl(url: string) {
  const body = new URLSearchParams({ url });
  const res = await fetch(`${VT_BASE}/urls`, {
    method: "POST",
    headers: {
      "x-apikey": VT_API_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) throw new Error(`VT scan failed: ${res.status}`);
  const data = await res.json();
  return data?.data?.id as string; // analysis id
}

async function vtGetAnalysis(analysisId: string) {
  const res = await fetch(`${VT_BASE}/analyses/${analysisId}`, {
    headers: { "x-apikey": VT_API_KEY },
  });
  if (!res.ok) throw new Error(`VT analysis fetch failed: ${res.status}`);
  return res.json();
}

// Poll until analysis is complete (max 15s)
async function vtWaitForAnalysis(analysisId: string, maxWaitMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const data = await vtGetAnalysis(analysisId);
    if (data?.data?.attributes?.status === "completed") return data;
    await new Promise((r) => setTimeout(r, 3000));
  }
  return null;
}

// ── Supabase cache ─────────────────────────────────────────────────
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ── Risk classifier ────────────────────────────────────────────────
function classifyVTStats(stats: {
  malicious: number;
  suspicious: number;
  harmless: number;
  undetected: number;
}): "SAFE" | "WARNING" | "DANGER" {
  if (stats.malicious >= 3) return "DANGER";
  if (stats.malicious >= 1 || stats.suspicious >= 3) return "WARNING";
  return "SAFE";
}

// ── Main handler ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const cleanUrl = url.trim();

    // Normalise — add https:// if missing
    const normalised = /^https?:\/\//i.test(cleanUrl)
      ? cleanUrl
      : `https://${cleanUrl}`;

    // ── 1. Check Supabase cache first ──────────────────────────────
    const supabase = getSupabase();
    const { data: cached } = await supabase
      .from("url_checks")
      .select("*")
      .eq("url", normalised.toLowerCase())
      .single();

    if (cached) {
      // Increment check count (fire-and-forget, ignore type errors)
      supabase
        .from("url_checks")
        .update({ check_count: cached.check_count + 1 } as never)
        .eq("id", cached.id)
        .then(() => {});

      return NextResponse.json({ source: "cache", ...cached });
    }

    // ── 2. No cache — call VirusTotal ──────────────────────────────
    if (!VT_API_KEY) {
      return NextResponse.json(
        { error: "VIRUSTOTAL_API_KEY not configured" },
        { status: 503 }
      );
    }

    // Try GET first (might already be in VT database)
    let vtData = await vtGetUrl(normalised).catch(() => null);

    // If not in VT yet, submit for scanning
    if (!vtData) {
      const analysisId = await vtScanUrl(normalised);
      vtData = await vtWaitForAnalysis(analysisId);
    }

    if (!vtData) {
      return NextResponse.json(
        { error: "VirusTotal analysis timed out. Try again shortly." },
        { status: 504 }
      );
    }

    const attrs = vtData?.data?.attributes ?? vtData?.attributes ?? {};
    const stats: { malicious: number; suspicious: number; harmless: number; undetected: number } =
      attrs?.last_analysis_stats ?? attrs?.stats ?? {
        malicious: 0,
        suspicious: 0,
        harmless: 0,
        undetected: 0,
      };

    const risk = classifyVTStats(stats);
    const categories: string[] = Object.values(attrs?.categories ?? {}) as string[];
    const totalEngines =
      (stats.malicious ?? 0) +
      (stats.suspicious ?? 0) +
      (stats.harmless ?? 0) +
      (stats.undetected ?? 0);

    // Build vendor detections list (malicious + suspicious only)
    const analysisResults: Record<string, { category: string; result: string }> =
      attrs?.last_analysis_results ?? attrs?.results ?? {};
    const detections = Object.entries(analysisResults)
      .filter(([, v]) => v.category === "malicious" || v.category === "suspicious")
      .map(([vendor, v]) => ({ vendor, category: v.category, result: v.result }))
      .slice(0, 10);

    const reasons: string[] = [];
    if (stats.malicious > 0)
      reasons.push(`${stats.malicious} dari ${totalEngines} vendor mendeteksi sebagai berbahaya`);
    if (stats.suspicious > 0)
      reasons.push(`${stats.suspicious} vendor menandai sebagai mencurigakan`);
    if (categories.length > 0)
      reasons.push(`Kategori: ${categories.slice(0, 3).join(", ")}`);
    if (risk === "SAFE")
      reasons.push(`${stats.harmless} vendor menyatakan aman`, "Tidak ada indikasi malware atau phishing");

    const result = {
      url: normalised,
      risk,
      stats,
      total_engines: totalEngines,
      detections,
      categories,
      reasons,
      vt_permalink: attrs?.permalink ?? `https://www.virustotal.com/gui/url/${encodeBase64Url(normalised)}`,
      source: "virustotal",
    };

    // ── 3. Save to Supabase cache ──────────────────────────────────
    await supabase.from("url_checks").insert({
      url: normalised.toLowerCase(),
      result: risk,
      reasons,
      check_count: 1,
      vt_stats: stats,
      vt_detections: detections,
      vt_categories: categories,
      vt_permalink: result.vt_permalink,
      total_engines: totalEngines,
    } as never);

    return NextResponse.json(result);
  } catch (err) {
    console.error("check-url error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
