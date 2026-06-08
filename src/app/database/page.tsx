"use client";

import { useState } from "react";
import Link from "next/link";
import { SCAM_DATABASE, SCAM_CATEGORIES, RISK_LEVELS } from "@/lib/constants";

const ALL_RISKS = ["Semua", "DANGER", "WARNING", "SAFE"];

export default function DatabasePage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("Semua");
  const [categoryFilter, setCategoryFilter] = useState("Semua");

  const filtered = SCAM_DATABASE.filter((entry) => {
    const matchSearch =
      entry.name.toLowerCase().includes(search.toLowerCase()) ||
      entry.description.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === "Semua" || entry.risk === riskFilter;
    const matchCat = categoryFilter === "Semua" || entry.type === categoryFilter;
    return matchSearch && matchRisk && matchCat;
  });

  const dangerCount = SCAM_DATABASE.filter((e) => e.risk === "DANGER").length;
  const warnCount = SCAM_DATABASE.filter((e) => e.risk === "WARNING").length;
  const safeCount = SCAM_DATABASE.filter((e) => e.risk === "SAFE").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-red-950 text-white py-14">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🗃️</div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">Database Scammer Indonesia</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Daftar website, toko, dan platform penipuan yang telah dilaporkan dan diverifikasi komunitas cek-scam.id
          </p>

          {/* Stats Row */}
          <div className="flex justify-center gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-black text-red-400">{dangerCount}</div>
              <div className="text-xs text-gray-300">Berbahaya</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-black text-yellow-400">{warnCount}</div>
              <div className="text-xs text-gray-300">Waspada</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-black text-green-400">{safeCount}</div>
              <div className="text-xs text-gray-300">Aman Terverifikasi</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-black text-white">{SCAM_DATABASE.length}</div>
              <div className="text-xs text-gray-300">Total Entri</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama website, toko, atau deskripsi..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 self-center mr-1">Risk:</span>
            {ALL_RISKS.map((r) => {
              const colors: Record<string, string> = {
                Semua: "bg-gray-100 text-gray-700 hover:bg-gray-200",
                DANGER: riskFilter === "DANGER" ? "bg-red-600 text-white" : "bg-red-50 text-red-700 hover:bg-red-100",
                WARNING: riskFilter === "WARNING" ? "bg-yellow-500 text-white" : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
                SAFE: riskFilter === "SAFE" ? "bg-green-600 text-white" : "bg-green-50 text-green-700 hover:bg-green-100",
              };
              return (
                <button key={r} onClick={() => setRiskFilter(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${riskFilter === r && r === "Semua" ? "bg-gray-900 text-white" : colors[r]}`}>
                  {r === "DANGER" ? "🚨 Berbahaya" : r === "WARNING" ? "⚠️ Waspada" : r === "SAFE" ? "✅ Aman" : "Semua"}
                </button>
              );
            })}
            <span className="text-xs text-gray-400 self-center mx-1">|</span>
            <span className="text-xs text-gray-500 self-center mr-1">Tipe:</span>
            <button onClick={() => setCategoryFilter("Semua")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${categoryFilter === "Semua" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              Semua
            </button>
            {SCAM_CATEGORIES.slice(0, 5).map((cat) => (
              <button key={cat.id} onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${categoryFilter === cat.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Menampilkan <strong>{filtered.length}</strong> dari {SCAM_DATABASE.length} entri
          </p>
          <Link href="/lapor" className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-1">
            + Tambah Laporan
          </Link>
        </div>

        {/* Database Table / Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-bold text-gray-900 mb-2">Tidak ditemukan</h3>
            <p className="text-gray-500 text-sm mb-4">Tidak ada entri yang cocok dengan pencarian kamu.</p>
            <Link href="/lapor" className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">
              Laporkan Scammer Baru
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((entry) => {
              const risk = RISK_LEVELS[entry.risk];
              const cat = SCAM_CATEGORIES.find((c) => c.id === entry.type);
              return (
                <div key={entry.id} className={`bg-white rounded-2xl border ${risk.border} p-5 flex gap-4`}>
                  {/* Risk indicator */}
                  <div className={`w-12 h-12 rounded-xl ${risk.bg} flex items-center justify-center text-xl shrink-0`}>
                    {risk.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-sm font-mono">{entry.name}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${risk.badge}`}>
                        {risk.label}
                      </span>
                      {cat && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {cat.icon} {cat.label}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-2">{entry.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                      <span>📱 {entry.platform}</span>
                      <span>📋 {entry.reports} laporan</span>
                      <span>📅 {entry.date}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0 flex flex-col gap-2">
                    <Link href="/cek-url"
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors text-center">
                      Cek URL
                    </Link>
                    {entry.risk !== "SAFE" && (
                      <Link href="/lapor"
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium transition-colors text-center">
                        Konfirmasi
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-10 bg-gray-900 rounded-3xl p-8 text-white text-center">
          <div className="text-4xl mb-3">🚨</div>
          <h3 className="text-xl font-black mb-2">Tahu website scam yang belum ada di sini?</h3>
          <p className="text-gray-400 text-sm mb-5">
            Bantu komunitas dengan melaporkan. Setiap laporan diverifikasi tim kami sebelum ditambahkan.
          </p>
          <Link href="/lapor" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors">
            🚨 Laporkan Scammer Baru
          </Link>
        </div>
      </div>
    </div>
  );
}
