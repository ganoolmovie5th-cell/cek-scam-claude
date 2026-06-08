"use client";

import { useState } from "react";
import { SCAM_DATABASE, RISK_LEVELS } from "@/lib/constants";
import type { ScamEntry } from "@/lib/constants";

type CheckResult = {
  query: string;
  entry: ScamEntry | null;
  risk: "SAFE" | "WARNING" | "DANGER";
  reasons: string[];
};

function analyzeUrl(input: string): CheckResult {
  const clean = input.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];

  // Check against database
  const found = SCAM_DATABASE.find(
    (s) => s.name.toLowerCase().includes(clean) || clean.includes(s.name.toLowerCase().replace(/^www\./, ""))
  );

  if (found) {
    return {
      query: input,
      entry: found,
      risk: found.risk,
      reasons:
        found.risk === "DANGER"
          ? [`Terdeteksi dalam database scam`, `${found.reports} laporan komunitas`, found.description]
          : [`Masuk watchlist komunitas`, `${found.reports} laporan`, "Sedang dalam investigasi"],
    };
  }

  // Heuristic checks
  const dangerSignals: string[] = [];
  const warnSignals: string[] = [];

  const suspiciousTLDs = [".xyz", ".info", ".top", ".click", ".tk", ".ml", ".ga", ".cf"];
  const suspiciousKeywords = ["gratis", "promo99", "flash-sale", "murah-banget", "cepat-kaya", "profit", "bonus", "hadiah", "menang"];
  const brandSpoof = ["tokoepdia", "shopppe", "lazadaa", "gojekk", "bcaa", "mandiri-bank", "bni-online"];

  if (suspiciousTLDs.some((t) => clean.endsWith(t))) dangerSignals.push(`Domain TLD mencurigakan (${suspiciousTLDs.find((t) => clean.endsWith(t))})`);
  if (suspiciousKeywords.some((k) => clean.includes(k))) warnSignals.push("Kata kunci promosi mencurigakan dalam URL");
  if (brandSpoof.some((b) => clean.includes(b))) dangerSignals.push("Kemungkinan meniru brand terkenal (typosquatting)");
  if (/\d{4,}/.test(clean)) warnSignals.push("Banyak angka dalam domain — pola umum scam");
  if ((clean.match(/-/g) || []).length > 3) warnSignals.push("Terlalu banyak tanda hubung dalam domain");

  if (dangerSignals.length > 0) {
    return { query: input, entry: null, risk: "DANGER", reasons: dangerSignals };
  } else if (warnSignals.length > 0) {
    return { query: input, entry: null, risk: "WARNING", reasons: warnSignals };
  }

  return {
    query: input,
    entry: null,
    risk: "SAFE",
    reasons: ["Tidak ditemukan dalam database scam", "Tidak ada indikator URL berbahaya", "Domain terlihat normal"],
  };
}

const TIPS = [
  { icon: "🔒", text: "Selalu cek HTTPS sebelum input data pribadi" },
  { icon: "🎯", text: "Hati-hati URL yang mirip brand besar (tokopedia → tok0pedia)" },
  { icon: "📅", text: "Website baru (< 6 bulan) lebih berisiko" },
  { icon: "💰", text: "Harga terlalu murah dari pasaran = red flag" },
  { icon: "📞", text: "Cek ada kontak resmi yang bisa dihubungi" },
  { icon: "⭐", text: "Cari review di Google sebelum bertransaksi" },
];

export default function CekUrlPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(analyzeUrl(input));
      setLoading(false);
    }, 1200);
  };

  const risk = result ? RISK_LEVELS[result.risk] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">Cek Keamanan URL / Website</h1>
          <p className="text-blue-100 text-lg">
            Masukkan URL website atau nama toko online untuk dicek keamanannya sebelum bertransaksi.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Masukkan URL atau Nama Toko
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              placeholder="Contoh: toko-murah.com atau bca-update.info"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleCheck}
              disabled={!input.trim() || loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-semibold text-sm transition-colors min-w-[80px]"
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
          <p className="text-xs text-gray-400 mt-2">
            Contoh URL yang bisa dicek: bca-update-akun.info, invest-cepat-kaya.com, tokopedia.com
          </p>
        </div>

        {/* Result Card */}
        {result && risk && (
          <div className={`rounded-2xl border-2 ${risk.border} ${risk.bg} p-6 mb-6 animate-in fade-in`}>
            <div className="flex items-start gap-4">
              <div className="text-4xl">{risk.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xl font-black ${risk.text}`}>{risk.label}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${risk.badge}`}>
                    {result.risk}
                  </span>
                </div>
                <p className="text-gray-700 text-sm font-medium mb-4">
                  Hasil analisis untuk: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{result.query}</span>
                </p>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Alasan / Detail:</p>
                  {result.reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-0.5 text-xs">{result.risk === "SAFE" ? "✅" : result.risk === "WARNING" ? "⚠️" : "🚨"}</span>
                      {r}
                    </div>
                  ))}
                </div>

                {result.entry && (
                  <div className="mt-4 pt-4 border-t border-gray-200/60 grid grid-cols-2 gap-3 text-xs text-gray-500">
                    <div><span className="font-medium">Tipe:</span> {result.entry.type}</div>
                    <div><span className="font-medium">Platform:</span> {result.entry.platform}</div>
                    <div><span className="font-medium">Laporan:</span> {result.entry.reports}x</div>
                    <div><span className="font-medium">Terakhir:</span> {result.entry.date}</div>
                  </div>
                )}

                {result.risk !== "SAFE" && (
                  <div className="mt-4 flex gap-3">
                    <a href="/lapor" className="text-sm px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                      🚨 Laporkan
                    </a>
                    <a href="/edukasi" className="text-sm px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      📚 Tips Aman
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
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
        </div>
      </div>
    </div>
  );
}
