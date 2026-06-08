"use client";

import { useState } from "react";
import Link from "next/link";
import { SCAM_DATABASE, RISK_LEVELS } from "@/lib/constants";
import type { ScamEntry } from "@/lib/constants";

// ── Types ──────────────────────────────────────────────────────────
type VTStats = {
  malicious: number;
  suspicious: number;
  harmless: number;
  undetected: number;
};

type VTDetection = {
  vendor: string;
  category: string;
  result: string;
};

type CheckResult = {
  query: string;
  risk: "SAFE" | "WARNING" | "DANGER";
  reasons: string[];
  source: "database" | "heuristic" | "virustotal" | "cache";
  entry?: ScamEntry | null;
  // VirusTotal extras
  vtStats?: VTStats;
  vtDetections?: VTDetection[];
  vtCategories?: string[];
  vtPermalink?: string;
  totalEngines?: number;
};

// ── Local heuristic fallback ───────────────────────────────────────
function analyzeHeuristic(input: string): CheckResult {
  const clean = input.trim().toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];

  const found = SCAM_DATABASE.find(
    (s) => s.name.toLowerCase().includes(clean) || clean.includes(s.name.toLowerCase().replace(/^www\./, ""))
  );
  if (found) {
    return {
      query: input,
      entry: found,
      risk: found.risk,
      source: "database",
      reasons: found.risk === "DANGER"
        ? [`Terdeteksi dalam database scam komunitas`, `${found.reports} laporan`, found.description]
        : [`Masuk watchlist komunitas`, `${found.reports} laporan`, "Sedang dalam investigasi"],
    };
  }

  const dangerSignals: string[] = [];
  const warnSignals: string[] = [];
  const suspiciousTLDs = [".xyz", ".info", ".top", ".click", ".tk", ".ml", ".ga", ".cf"];
  const suspiciousKeywords = ["gratis", "promo99", "flash-sale", "murah-banget", "cepat-kaya", "profit", "bonus", "hadiah", "menang"];
  const brandSpoof = ["tokoepdia", "shopppe", "lazadaa", "gojekk", "bcaa", "mandiri-bank", "bni-online"];

  if (suspiciousTLDs.some((t) => clean.endsWith(t)))
    dangerSignals.push(`TLD mencurigakan (${suspiciousTLDs.find((t) => clean.endsWith(t))})`);
  if (suspiciousKeywords.some((k) => clean.includes(k)))
    warnSignals.push("Kata kunci promosi mencurigakan dalam URL");
  if (brandSpoof.some((b) => clean.includes(b)))
    dangerSignals.push("Kemungkinan typosquatting — meniru brand terkenal");
  if (/\d{4,}/.test(clean)) warnSignals.push("Banyak angka berurutan dalam domain");
  if ((clean.match(/-/g) || []).length > 3) warnSignals.push("Terlalu banyak tanda hubung dalam domain");

  if (dangerSignals.length > 0) return { query: input, entry: null, risk: "DANGER", source: "heuristic", reasons: dangerSignals };
  if (warnSignals.length > 0) return { query: input, entry: null, risk: "WARNING", source: "heuristic", reasons: warnSignals };
  return { query: input, entry: null, risk: "SAFE", source: "heuristic", reasons: ["Tidak ditemukan dalam database scam", "Tidak ada pola URL berbahaya yang terdeteksi"] };
}

const TIPS = [
  { icon: "🔒", text: "Selalu cek HTTPS sebelum input data pribadi" },
  { icon: "🎯", text: "Hati-hati URL yang mirip brand besar (tokopedia → tok0pedia)" },
  { icon: "📅", text: "Website baru (< 6 bulan) lebih berisiko" },
  { icon: "💰", text: "Harga terlalu murah dari pasaran = red flag" },
  { icon: "📞", text: "Cek ada kontak resmi yang bisa dihubungi" },
  { icon: "⭐", text: "Cari review di Google sebelum bertransaksi" },
];

// ── Progress bar component ─────────────────────────────────────────
function StatBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 w-8 text-right">{value}</span>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────
export default function CekUrlPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");

  const handleCheck = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      setLoadingMsg("Mengirim ke VirusTotal...");
      const res = await fetch("/api/check-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: input.trim() }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        // Fallback to heuristic if VT unavailable
        if (res.status === 503 || res.status === 504) {
          setLoadingMsg("VirusTotal tidak tersedia, pakai analisis lokal...");
          await new Promise((r) => setTimeout(r, 800));
          setResult(analyzeHeuristic(input));
          return;
        }
        throw new Error(err.error ?? "Gagal cek URL");
      }

      const data = await res.json();
      setLoadingMsg("Memproses hasil...");

      setResult({
        query: input,
        risk: data.risk,
        reasons: data.reasons ?? [],
        source: data.source ?? "virustotal",
        vtStats: data.stats,
        vtDetections: data.detections,
        vtCategories: data.categories,
        vtPermalink: data.vt_permalink,
        totalEngines: data.total_engines,
      });
    } catch {
      // Fallback to heuristic
      setLoadingMsg("Menggunakan analisis lokal...");
      await new Promise((r) => setTimeout(r, 600));
      setResult(analyzeHeuristic(input));
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  };

  const risk = result ? RISK_LEVELS[result.risk] : null;

  const sourceLabel: Record<string, string> = {
    virustotal: "🔬 VirusTotal (87 vendor)",
    cache: "💾 VirusTotal (cached)",
    database: "🗃️ Database Komunitas",
    heuristic: "🤖 Analisis Heuristik",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">Cek Keamanan URL / Website</h1>
          <p className="text-blue-100 text-lg">
            Didukung <strong>VirusTotal</strong> — 87+ vendor security engine dicek sekaligus.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            {["🦠 Malware", "🎣 Phishing", "🚫 Scam", "🔒 SSL"].map((tag) => (
              <span key={tag} className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Masukkan URL atau Domain
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleCheck()}
              placeholder="Contoh: toko-murah.com atau https://bca-update.info"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleCheck}
              disabled={!input.trim() || loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-semibold text-sm transition-colors min-w-[90px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Cek...
                </span>
              ) : "Cek →"}
            </button>
          </div>

          {/* Loading status */}
          {loading && loadingMsg && (
            <div className="mt-3 flex items-center gap-2 text-xs text-blue-600">
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              {loadingMsg}
            </div>
          )}

          <p className="text-xs text-gray-400 mt-2">
            Coba: <button onClick={() => setInput("bca-update-akun.info")} className="text-blue-500 hover:underline">bca-update-akun.info</button>
            {" · "}
            <button onClick={() => setInput("tokopedia.com")} className="text-blue-500 hover:underline">tokopedia.com</button>
            {" · "}
            <button onClick={() => setInput("invest-cepat-kaya.com")} className="text-blue-500 hover:underline">invest-cepat-kaya.com</button>
          </p>
        </div>

        {/* Result Card */}
        {result && risk && (
          <div className={`rounded-2xl border-2 ${risk.border} ${risk.bg} p-6 mb-6`}>
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="text-4xl">{risk.icon}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xl font-black ${risk.text}`}>{risk.label}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${risk.badge}`}>{result.risk}</span>
                  </div>
                  <p className="text-gray-600 text-xs">
                    Sumber: <span className="font-medium">{sourceLabel[result.source] ?? result.source}</span>
                  </p>
                </div>
              </div>
              {result.vtPermalink && (
                <a
                  href={result.vtPermalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs px-3 py-1.5 bg-white/60 hover:bg-white border border-gray-200 rounded-lg text-gray-600 font-medium transition-colors"
                >
                  Lihat di VT →
                </a>
              )}
            </div>

            {/* URL */}
            <div className="bg-white/60 rounded-xl px-4 py-2.5 mb-4 font-mono text-sm text-gray-800 break-all">
              {result.query}
            </div>

            {/* VirusTotal Stats */}
            {result.vtStats && result.totalEngines && (
              <div className="bg-white/60 rounded-xl p-4 mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  📊 Hasil Scan — {result.totalEngines} Security Engines
                </p>
                <div className="space-y-2">
                  <StatBar label="🚨 Berbahaya" value={result.vtStats.malicious} total={result.totalEngines} color="bg-red-500" />
                  <StatBar label="⚠️ Mencurigakan" value={result.vtStats.suspicious} total={result.totalEngines} color="bg-yellow-500" />
                  <StatBar label="✅ Aman" value={result.vtStats.harmless} total={result.totalEngines} color="bg-green-500" />
                  <StatBar label="❔ Tidak diketahui" value={result.vtStats.undetected} total={result.totalEngines} color="bg-gray-300" />
                </div>
              </div>
            )}

            {/* Categories */}
            {result.vtCategories && result.vtCategories.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">🏷️ Kategori</p>
                <div className="flex flex-wrap gap-2">
                  {result.vtCategories.map((cat) => (
                    <span key={cat} className="text-xs bg-white/80 border border-gray-200 px-3 py-1 rounded-full text-gray-700 capitalize">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reasons */}
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">📋 Ringkasan</p>
              <div className="space-y-1.5">
                {result.reasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-0.5 shrink-0">{result.risk === "SAFE" ? "✅" : result.risk === "WARNING" ? "⚠️" : "🚨"}</span>
                    {r}
                  </div>
                ))}
              </div>
            </div>

            {/* Vendor Detections */}
            {result.vtDetections && result.vtDetections.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  🦠 Vendor yang Mendeteksi ({result.vtDetections.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {result.vtDetections.map((d) => (
                    <div key={d.vendor} className="flex items-center justify-between bg-red-50 border border-red-100 rounded-lg px-3 py-1.5">
                      <span className="text-xs font-medium text-gray-800">{d.vendor}</span>
                      <span className="text-xs text-red-600 font-semibold capitalize">{d.result}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Database entry extras */}
            {result.entry && (
              <div className="bg-white/60 rounded-xl p-3 mb-4 grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div><span className="font-medium">Tipe:</span> {result.entry.type}</div>
                <div><span className="font-medium">Platform:</span> {result.entry.platform}</div>
                <div><span className="font-medium">Laporan:</span> {result.entry.reports}x</div>
                <div><span className="font-medium">Terakhir:</span> {result.entry.date}</div>
              </div>
            )}

            {/* Actions */}
            {result.risk !== "SAFE" && (
              <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200/60">
                <Link href="/lapor" className="text-sm px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                  🚨 Laporkan ke Komunitas
                </Link>
                <Link href="/edukasi" className="text-sm px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  📚 Tips Aman
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">💡 Tips Cek Website Aman</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TIPS.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-lg">{tip.icon}</span>
                <p className="text-sm text-gray-600 leading-snug">{tip.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
            <span>🔬</span>
            <span>Powered by <a href="https://www.virustotal.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">VirusTotal</a> — 87+ security vendor engines</span>
          </div>
        </div>
      </div>
    </div>
  );
}
