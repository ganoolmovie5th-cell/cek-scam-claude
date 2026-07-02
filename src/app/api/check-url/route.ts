import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { encodeBase64Url } from "@/lib/base64";

export const maxDuration = 30; // Vercel: allow up to 30s for this route

// ── VirusTotal helpers ─────────────────────────────────────────────
const VT_API_KEY = process.env.VIRUSTOTAL_API_KEY ?? "";
const VT_BASE    = "https://www.virustotal.com/api/v3";

async function vtGetUrl(url: string) {
  const res = await fetch(`${VT_BASE}/urls/${encodeBase64Url(url)}`, {
    headers: { "x-apikey": VT_API_KEY },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`VT GET failed: ${res.status}`);
  return res.json();
}

async function vtScanUrl(url: string): Promise<string> {
  const res = await fetch(`${VT_BASE}/urls`, {
    method: "POST",
    headers: {
      "x-apikey": VT_API_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ url }),
  });
  if (!res.ok) throw new Error(`VT scan failed: ${res.status}`);
  const data = await res.json();
  return data?.data?.id as string;
}

async function vtPollAnalysis(analysisId: string, maxWaitMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const res = await fetch(`${VT_BASE}/analyses/${analysisId}`, {
      headers: { "x-apikey": VT_API_KEY },
    });
    if (!res.ok) throw new Error(`VT poll failed: ${res.status}`);
    const data = await res.json();
    if (data?.data?.attributes?.status === "completed") return data;
    await new Promise((r) => setTimeout(r, 3000));
  }
  return null;
}

// ── Supabase ───────────────────────────────────────────────────────
// ponytail: lazy singleton — defer createClient until first request (env not set at build time)
let _supabase: ReturnType<typeof createClient> | undefined;
const getSupabase = () =>
  (_supabase ??= createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));

// ── Risk classifiers ───────────────────────────────────────────────
function classifyVT(stats: {
  malicious: number; suspicious: number; harmless: number; undetected: number;
}): "SAFE" | "WARNING" | "DANGER" {
  if (stats.malicious >= 3) return "DANGER";
  if (stats.malicious >= 1 || stats.suspicious >= 3) return "WARNING";
  return "SAFE";
}

// ── Heuristic constants (module scope — not re-created per request) ─
const BAD_TLDS     = [".xyz", ".info", ".top", ".click", ".tk", ".ml", ".ga", ".cf", ".pw", ".cc"];
const BAD_KEYWORDS = ["phishing", "scam", "fraud", "cepat-kaya", "profit-harian", "investasi-bodong", "pinjol-cepat", "free-money"];
const WARN_WORDS   = ["gratis", "promo99", "flash-sale", "murah-banget", "bonus", "hadiah", "menang", "duit-cepat"];
const SPOOFED      = ["tok0pedia", "tokopedla", "shopppe", "sh0pee", "lazadaa", "gojekk", "grab-promo", "bcaa", "mandiri-bank", "bni-online", "bri-update", "ojk-resmi"];
const RE_MANY_DIGITS  = /\d{5,}/;
const RE_STRIP_PROTO  = /^https?:\/\//;
const RE_STRIP_WWW    = /^www\./;

function runHeuristic(raw: string): { risk: "SAFE" | "WARNING" | "DANGER"; reasons: string[] } {
  const clean = raw.toLowerCase()
    .replace(RE_STRIP_PROTO, "")
    .replace(RE_STRIP_WWW, "")
    .split("/")[0];

  const danger: string[] = [];
  const warn:   string[] = [];

  if (BAD_TLDS.some((t) => clean.endsWith(t)))
    danger.push(`TLD mencurigakan (.${clean.split(".").pop()}) — sering dipakai scammer`);
  if (BAD_KEYWORDS.some((k) => clean.includes(k)))
    danger.push("Kata kunci berbahaya terdeteksi dalam domain");
  if (SPOOFED.some((b) => clean.includes(b)))
    danger.push("Terindikasi typosquatting — meniru brand terkenal");
  if (WARN_WORDS.some((k) => clean.includes(k)))
    warn.push("Kata kunci promosi mencurigakan dalam URL");
  if (RE_MANY_DIGITS.test(clean))
    warn.push("Banyak angka berurutan dalam domain");
  if ((clean.match(/-/g) ?? []).length >= 4)
    warn.push("Terlalu banyak tanda hubung — pola umum domain scam");
  if (clean.split(".").length > 4)
    warn.push("Subdomain berlapis mencurigakan");

  if (danger.length > 0) return { risk: "DANGER", reasons: danger };
  if (warn.length > 0)   return { risk: "WARNING", reasons: warn };
  return { risk: "SAFE", reasons: [] };
}

function worstRisk(
  a: "SAFE" | "WARNING" | "DANGER",
  b: "SAFE" | "WARNING" | "DANGER"
): "SAFE" | "WARNING" | "DANGER" {
  const rank = { SAFE: 0, WARNING: 1, DANGER: 2 };
  return rank[a] >= rank[b] ? a : b;
}

// ── Main handler ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const url  = typeof body?.url === "string" ? body.url.trim() : "";

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const normalised = /^https?:\/\//i.test(url) ? url : `https://${url}`;

    // ── 1. Supabase cache ──────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cached: any = null;
    try {
      const { data } = await getSupabase()
        .from("url_checks")
        .select("*")
        .eq("url", normalised.toLowerCase())
        .single();
      cached = data;
    } catch {
      cached = null;
    }

    if (cached) {
      // fire-and-forget increment
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getSupabase() as any)
        .from("url_checks")
        .update({ check_count: (cached.check_count ?? 0) + 1 })
        .eq("id", cached.id)
        .then(() => {});

      // Always re-apply heuristic on top of cached VT result
      const heuristic = runHeuristic(normalised);
      const cachedVtRisk = (cached.result ?? "SAFE") as "SAFE" | "WARNING" | "DANGER";
      const finalRisk = worstRisk(cachedVtRisk, heuristic.risk);

      const cachedReasons: string[] = cached.reasons ?? [];
      const allReasons = [...new Set([...cachedReasons, ...heuristic.reasons])];

      return NextResponse.json({
        source: "cache",
        risk: finalRisk,
        reasons: allReasons,
        stats: cached.vt_stats ?? null,
        total_engines: cached.total_engines ?? 0,
        detections: cached.vt_detections ?? [],
        categories: cached.vt_categories ?? [],
        vt_permalink: cached.vt_permalink ?? null,
      });
    }

    // ── 2. Heuristic-only fast path (no VT key) ────────────────────
    if (!VT_API_KEY) {
      const h = runHeuristic(normalised);
      return NextResponse.json({ source: "heuristic", risk: h.risk, reasons: h.reasons });
    }

    // ── 3. VirusTotal ──────────────────────────────────────────────
    let vtData = await vtGetUrl(normalised).catch(() => null);

    if (!vtData) {
      // Submit for scanning, then poll
      const analysisId = await vtScanUrl(normalised).catch(() => null);
      if (analysisId) {
        vtData = await vtPollAnalysis(analysisId).catch(() => null);
      }
    }

    // ── 4. Parse VT response ───────────────────────────────────────
    const attrs = vtData?.data?.attributes ?? vtData?.attributes ?? {};
    const stats = (attrs?.last_analysis_stats ?? attrs?.stats ?? {
      malicious: 0, suspicious: 0, harmless: 0, undetected: 0,
    }) as { malicious: number; suspicious: number; harmless: number; undetected: number };

    const vtRisk    = classifyVT(stats);
    const heuristic = runHeuristic(normalised);
    const risk      = worstRisk(vtRisk, heuristic.risk);

    const categories: string[]    = Object.values(attrs?.categories ?? {}) as string[];
    const totalEngines: number    =
      (stats.malicious ?? 0) + (stats.suspicious ?? 0) +
      (stats.harmless ?? 0)  + (stats.undetected ?? 0);

    const analysisResults: Record<string, { category: string; result: string }> =
      attrs?.last_analysis_results ?? attrs?.results ?? {};
    const detections = Object.entries(analysisResults)
      .filter(([, v]) => v.category === "malicious" || v.category === "suspicious")
      .map(([vendor, v]) => ({ vendor, category: v.category, result: v.result }))
      .slice(0, 10);

    const reasons: string[] = [];
    if (stats.malicious > 0)
      reasons.push(`${stats.malicious} dari ${totalEngines} vendor mendeteksi berbahaya`);
    if (stats.suspicious > 0)
      reasons.push(`${stats.suspicious} vendor menandai mencurigakan`);
    if (categories.length > 0)
      reasons.push(`Kategori: ${categories.slice(0, 3).join(", ")}`);
    reasons.push(...heuristic.reasons);
    if (reasons.length === 0)
      reasons.push(
        `${stats.harmless} vendor menyatakan aman`,
        "Tidak ada indikasi malware atau phishing",
        "Tidak ada pola URL mencurigakan"
      );

    const source = !vtData
      ? "heuristic"
      : heuristic.risk !== "SAFE" && vtRisk === "SAFE"
      ? "hybrid"
      : "virustotal";

    const vt_permalink =
      attrs?.permalink ??
      `https://www.virustotal.com/gui/url/${encodeBase64Url(normalised)}`;

    // ── 5. Save to Supabase cache ──────────────────────────────────
    getSupabase().from("url_checks").insert({
      url: normalised.toLowerCase(),
      result: risk,
      reasons,
      check_count: 1,
      vt_stats: stats,
      vt_detections: detections,
      vt_categories: categories,
      vt_permalink,
      total_engines: totalEngines,
    } as never).then(() => {});

    return NextResponse.json({
      source,
      risk,
      stats,
      total_engines: totalEngines,
      detections,
      categories,
      reasons,
      vt_permalink,
    });

  } catch (err) {
    console.error("[check-url]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
