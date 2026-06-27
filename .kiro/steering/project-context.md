# cek-scam.id — Project Context & Conventions

## Gambaran Umum

Platform komunitas Indonesia untuk deteksi penipuan online (anti-scam). Pengguna bisa cek keamanan website, melaporkan scammer, melihat database scam, dan membaca artikel edukasi keamanan digital. Dibangun dengan Next.js 15 App Router + TypeScript, di-deploy ke Vercel, backend Supabase, pemindaian URL via VirusTotal.

- **Live:** https://cek-scam.web.id
- **Repo:** ganoolmovie5th-cell/cek-scam-claude
- **Branch:** `main` (push langsung)

---

## Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | Next.js 15.3.6 (App Router) |
| Bahasa | TypeScript 5 (strict mode) |
| UI | React 19 |
| Styling | Tailwind CSS 3.4 |
| Icons | Lucide React — jangan tambah library icon lain |
| Database | Supabase (PostgreSQL + Row Level Security) |
| URL Scanning | VirusTotal API v3 |
| Deploy | Vercel |

---

## Konvensi Kode

- **Bahasa kode:** TypeScript strict — selalu typing yang tepat, hindari `any`. Di API route Supabase, pakai client untyped + cast `as never` untuk insert/update (lihat catatan Supabase di bawah).
- **Komponen:** React functional component. Komponen interaktif diberi `"use client"` (mis. `Navbar.tsx`).
- **Styling:** Tailwind utility classes inline. Tidak ada `cn()` helper — gunakan template string biasa untuk conditional class.
- **Import alias:** `@/` → `src/` (dikonfigurasi di `tsconfig.json`).
- **Bahasa UI:** Semua teks user-facing dalam **Bahasa Indonesia** kasual-profesional. Emoji dipakai aktif di label/CTA. Tanpa em-dash.
- **Warna brand:** Tema merah/oranye (anti-scam). Token kustom di `tailwind.config.ts`: `brand` (merah), `safe` (hijau), `warn` (kuning), `danger` (merah). Risk level juga didefinisikan di `RISK_LEVELS` (`constants.ts`).

---

## Struktur Direktori

```
src/
├── app/
│   ├── api/
│   │   ├── check-url/route.ts    # POST: scan URL (VT + heuristik + cache)
│   │   ├── reports/route.ts      # POST: submit laporan · GET: laporan verified
│   │   ├── clear-cache/route.ts  # GET: hapus cache url_checks (protected)
│   │   └── health/route.ts       # GET: diagnosa env + Supabase + VirusTotal
│   ├── cek-url/                  # Halaman cek URL
│   ├── database/                 # Halaman database scam
│   ├── edukasi/[slug]/           # Detail artikel
│   ├── lapor/                    # Form lapor scam
│   ├── layout.tsx · page.tsx · robots.ts · sitemap.ts
├── components/                   # Navbar, Footer
└── lib/
    ├── constants.ts              # SINGLE SOURCE OF TRUTH
    ├── supabase.ts               # Client Supabase
    └── database.types.ts         # Tipe tabel
supabase/schema.sql               # Skema DB
```

---

## Single Source of Truth — `src/lib/constants.ts`

Semua data statis dan konfigurasi situs ada di sini. **Jangan hardcode** di komponen:

- `SITE` — nama, tagline, deskripsi, URL, email, social. Dipakai di metadata, robots, sitemap.
- `STATS` — angka statistik beranda (totalReports, sitesBlocked, dll).
- `RISK_LEVELS` — definisi visual `SAFE` / `WARNING` / `DANGER` (warna, badge, icon).
- `SCAM_CATEGORIES` — kategori scam untuk form lapor.
- `SCAM_DATABASE` — data scam contoh (statis, untuk demo/seed tampilan).
- `EDUCATION_ARTICLES` — artikel edukasi (juga menggerakkan `sitemap.ts` & route `/edukasi/[slug]`).

Saat menambah artikel edukasi: tambah entry di `EDUCATION_ARTICLES`, sitemap otomatis ikut.

---

## Cek URL — Pipeline (`api/check-url/route.ts`)

Urutan logika (jangan diubah tanpa alasan):

1. **Normalisasi** — prepend `https://` jika tidak ada skema.
2. **Cache Supabase** (`url_checks`) — jika ada, increment `check_count` (fire-and-forget) lalu **tetap re-apply heuristik** di atas hasil cache, ambil risiko terburuk.
3. **Fast path heuristik** — jika `VIRUSTOTAL_API_KEY` kosong, hanya heuristik.
4. **VirusTotal** — `vtGetUrl` → jika 404, `vtScanUrl` + `vtPollAnalysis` (maks ~20s, polling 3s).
5. **Klasifikasi** — `classifyVT` (malicious ≥3 = DANGER, ≥1 atau suspicious ≥3 = WARNING) digabung `runHeuristic` via `worstRisk`.
6. **Simpan** — insert hasil ke `url_checks` (fire-and-forget).

`source` di response: `cache` | `heuristic` | `hybrid` | `virustotal`.

Heuristik (`runHeuristic`) mendeteksi: TLD buruk (`.xyz`, `.top`, `.tk`, dll), kata kunci berbahaya, typosquatting brand (`tok0pedia`, `sh0pee`, dll), kata promosi, angka berurutan ≥5, tanda hubung ≥4, subdomain berlapis.

---

## Supabase

- **Frontend:** `supabase` (typed) dari `lib/supabase.ts`.
- **Server/API:** buat client untyped via `createClient(URL, SERVICE_ROLE_KEY ?? ANON_KEY)` langsung di route. Ini **disengaja** untuk menghindari masalah inferensi generic Supabase di TS strict build — insert pakai cast `as never`.
- **RLS aktif** di kedua tabel. Publik hanya bisa baca `scam_reports` dengan `status = 'verified'`, dan insert laporan baru. `url_checks` bisa dibaca publik; insert/update lewat service role.

### Tabel

| Tabel | Kolom penting |
|---|---|
| `scam_reports` | scam_type, target_name, platform, description (min 30 char), loss_amount, anonymous, status (pending/verified/rejected), risk_level, votes |
| `url_checks` | url (unique), result, reasons[], check_count, vt_stats (jsonb), vt_detections (jsonb), vt_categories[], vt_permalink, total_engines |

Skema lengkap di `supabase/schema.sql` — jalankan di Supabase SQL Editor.

---

## Environment Variables

| Variable | Wajib | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Ya | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ya | Anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Ya (server) | Untuk insert/update di API routes |
| `VIRUSTOTAL_API_KEY` | Opsional | Tanpa ini cek URL fallback ke heuristik. Free tier: 500 req/hari, 4 req/menit |
| `CACHE_CLEAR_KEY` | Opsional | Secret untuk `/api/clear-cache` (fallback dev: `dev-clear-2024`) |

Salin `.env.example` → `.env.local` untuk development.

---

## API Routes

| Route | Method | Fungsi |
|---|---|---|
| `/api/check-url` | POST | Scan URL. Body: `{ url }`. `maxDuration = 30` (Vercel) |
| `/api/reports` | POST | Submit laporan. Validasi field wajib + deskripsi ≥30 char |
| `/api/reports` | GET | Ambil 50 laporan `verified` terbaru |
| `/api/clear-cache` | GET | Hapus semua `url_checks`. Butuh `?key=` |
| `/api/health` | GET | Diagnosa env, koneksi Supabase, validitas VT key |

---

## SEO

- Metadata global di `layout.tsx` (title template, OpenGraph, Twitter, keywords) — sumber dari `SITE`.
- `robots.ts` allow semua + pointer sitemap.
- `sitemap.ts` — 5 halaman statis + semua artikel edukasi (dari `EDUCATION_ARTICLES`).
- `lang="id"` di root html.

---

## Perintah Development

```bash
npm run dev      # Dev server (http://localhost:3000)
npm run build    # Build produksi
npm run start    # Jalankan hasil build
npm run lint     # ESLint check
```

Verifikasi sebelum selesai: `npm run build` harus sukses (TS strict). Cek `/api/health` setelah deploy untuk memastikan env & koneksi.

---

## Aturan Penting

- Push langsung ke `main` (auto-deploy Vercel).
- Jangan hardcode data situs di komponen — selalu dari `constants.ts`.
- Pertahankan pola client untyped di API routes Supabase (hindari error TS generic).
- Teks UI Bahasa Indonesia, tanpa em-dash.
- Jangan tambah library icon selain Lucide React.
- Jangan ubah urutan pipeline cek URL tanpa alasan jelas (cache → heuristik → VT → klasifikasi → simpan).
