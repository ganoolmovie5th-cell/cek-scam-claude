"use client";

import { useState } from "react";
import { SCAM_CATEGORIES } from "@/lib/constants";

type FormState = {
  scamType: string;
  targetName: string;
  platform: string;
  description: string;
  lossAmount: string;
  reporterContact: string;
  anonymous: boolean;
};

const PLATFORMS = [
  "Website / Toko Online",
  "WhatsApp",
  "Telegram",
  "Instagram",
  "Facebook",
  "TikTok",
  "SMS",
  "Tokopedia",
  "Shopee",
  "Lazada",
  "Lainnya",
];

export default function LaporPage() {
  const [form, setForm] = useState<FormState>({
    scamType: "",
    targetName: "",
    platform: "",
    description: "",
    lossAmount: "",
    reporterContact: "",
    anonymous: true,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.scamType) e.scamType = "Pilih tipe penipuan";
    if (!form.targetName.trim()) e.targetName = "Nama/URL wajib diisi";
    if (!form.platform) e.platform = "Pilih platform";
    if (!form.description.trim() || form.description.length < 30)
      e.description = "Deskripsi minimal 30 karakter";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    // Simulate API call (Supabase insert will go here)
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Laporan Diterima!</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Terima kasih telah melaporkan. Tim kami akan memverifikasi laporan kamu dalam 1–3 hari kerja dan menambahkannya ke database jika terbukti valid.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-green-700 mb-1">Nomor Laporan Kamu:</p>
            <p className="font-mono text-green-800 font-bold">RPT-{Date.now().toString().slice(-8)}</p>
          </div>
          <div className="flex flex-col gap-2">
            <a href="/database" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors">
              🗃️ Lihat Database Scam
            </a>
            <button onClick={() => { setSubmitted(false); setForm({ scamType: "", targetName: "", platform: "", description: "", lossAmount: "", reporterContact: "", anonymous: true }); }}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors">
              📋 Lapor Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-orange-500 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🚨</div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">Lapor Penipuan Online</h1>
          <p className="text-red-100 text-lg">
            Laporan kamu membantu ribuan orang Indonesia terhindar dari penipuan yang sama. Gratis & anonim.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Info banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
          <span className="text-xl">⚠️</span>
          <div className="text-sm text-amber-800">
            <strong>Untuk keadaan darurat:</strong> Hubungi <strong>110 (Polri)</strong> atau <strong>157 (OJK)</strong> segera. Platform ini untuk pelaporan komunitas, bukan pengganti laporan resmi.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Tipe Penipuan */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-black">1</span>
              Tipe Penipuan
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SCAM_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setForm({ ...form, scamType: cat.id })}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    form.scamType === cat.id
                      ? "border-red-500 bg-red-50"
                      : "border-gray-100 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="text-xl mb-1">{cat.icon}</div>
                  <div className="text-xs font-medium text-gray-700 leading-tight">{cat.label}</div>
                </button>
              ))}
            </div>
            {errors.scamType && <p className="text-red-500 text-xs mt-2">{errors.scamType}</p>}
          </div>

          {/* Card 2: Detail Target */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-black">2</span>
              Detail Target
            </h2>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Nama Website / Toko / Nomor HP Penipu *
              </label>
              <input
                type="text"
                value={form.targetName}
                onChange={(e) => setForm({ ...form, targetName: e.target.value })}
                placeholder="Contoh: toko-murah.com atau 0812xxxx"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {errors.targetName && <p className="text-red-500 text-xs mt-1">{errors.targetName}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Platform *</label>
              <select
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="">Pilih platform...</option>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.platform && <p className="text-red-500 text-xs mt-1">{errors.platform}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Estimasi Kerugian (Rp) — opsional
              </label>
              <input
                type="text"
                value={form.lossAmount}
                onChange={(e) => setForm({ ...form, lossAmount: e.target.value })}
                placeholder="Contoh: 500000"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Card 3: Kronologi */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-black">3</span>
              Kronologi / Deskripsi
            </h2>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5}
              placeholder="Ceritakan kronologi penipuan yang kamu alami atau ketahui. Sertakan detail seperti modus operandi, cara kontak, dan bukti yang ada..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
            <div className="flex justify-between mt-1">
              {errors.description
                ? <p className="text-red-500 text-xs">{errors.description}</p>
                : <span />
              }
              <p className="text-xs text-gray-400">{form.description.length} karakter</p>
            </div>
          </div>

          {/* Card 4: Identitas */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-black">4</span>
              Identitas Pelapor
            </h2>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.anonymous}
                onChange={(e) => setForm({ ...form, anonymous: e.target.checked })}
                className="w-4 h-4 rounded accent-red-600"
              />
              <span className="text-sm text-gray-700">Laporkan secara anonim (nama tidak ditampilkan)</span>
            </label>

            {!form.anonymous && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Email / WhatsApp (untuk follow-up) — opsional
                </label>
                <input
                  type="text"
                  value={form.reporterContact}
                  onChange={(e) => setForm({ ...form, reporterContact: e.target.value })}
                  placeholder="email@kamu.com atau 0812xxxx"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Mengirim Laporan...
              </>
            ) : (
              "🚨 Kirim Laporan"
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            Dengan mengirim laporan, kamu menyatakan bahwa informasi ini benar dan bukan untuk memfitnah.
          </p>
        </form>
      </div>
    </div>
  );
}
