# cek-scam.id 🛡️

> Lindungi Dirimu dari Penipuan Online

Platform komunitas Indonesia untuk deteksi penipuan online: cek keamanan website, laporkan scammer, lihat database scam, dan belajar keamanan digital. Dibangun dengan Next.js 15 App Router + TypeScript, di-deploy ke Vercel, dengan Supabase sebagai backend dan VirusTotal untuk pemindaian URL.

**Live:** https://cek-scam.web.id
**Repo:** [ganoolmovie5th-cell/cek-scam-claude](https://github.com/ganoolmovie5th-cell/cek-scam-claude)

---

## Fitur

| Fitur | Route | Keterangan |
|---|---|---|
| 🔍 Cek URL | `/cek-url` | Verifikasi keamanan website via VirusTotal + heuristik domain, dengan cache Supabase |
| 🗃️ Database Scam | `/database` | Daftar website, toko, dan nomor scammer yang dilaporkan komunitas |
| 📚 Edukasi | `/edukasi`, `/edukasi/[slug]` | Artikel edukasi keamanan digital |
| 🚨 Lapor Scam | `/lapor` | Form pelaporan penipuan (anonim opsional) ke Supabase |

---

## Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | Next.js 15.3.6 (App Router) |
| Bahasa | TypeScript 5 (strict) + React 19 |
| Styling | Tailwind CSS 3.4 |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL + RLS) |
| URL Scanning | VirusTotal API v3 |
| Deploy | Vercel |

---

## Arsitektur

```
src/
├── app/
│   ├── api/
│   │   ├── check-url/    # POST: scan URL (VirusTotal + heuristik + cache Supabase)
│   │   ├── reports/      # POST: submit laporan · GET: ambil laporan verified
│   │   ├── clear-cache/  # GET: hapus cache url_checks (protected by key)
│   │   └── health/       # GET: cek koneksi env, Supabase, VirusTotal
│   ├── cek-url/          # Halaman cek URL
│   ├── database/         # Halaman database scam
│   ├── edukasi/          # Daftar + detail artikel [slug]
│   ├── lapor/            # Form lapor scam
│   ├── layout.tsx        # Root layout + metadata SEO
│   ├── page.tsx          # Beranda
│   ├── robots.ts         # robots.txt
│   └── sitemap.ts        # sitemap.xml (statis + artikel)
├── components/           # Navbar, Footer
└── lib/
    ├── constants.ts      # SINGLE SOURCE OF TRUTH — SITE, STATS, data, kategori
    ├── supabase.ts       # Client Supabase (typed frontend + untyped server)
    └── database.types.ts # Tipe tabel Supabase
supabase/
└── schema.sql            # Skema DB — jalankan di Supabase SQL Editor
```

---

## Cara Kerja Cek URL

Endpoint `POST /api/check-url` memakai pipeline berlapis:

1. **Cache Supabase** — jika URL sudah pernah dicek, ambil dari tabel `url_checks` dan increment `check_count`. Heuristik tetap diterapkan ulang di atas hasil cache.
2. **Fast path heuristik** — jika `VIRUSTOTAL_API_KEY` tidak diset, hanya jalankan analisis heuristik domain.
3. **VirusTotal** — GET hasil analisis URL; jika belum ada, submit untuk scan lalu polling sampai `completed` (maks ~20 detik).
4. **Klasifikasi risiko** — gabungkan hasil VirusTotal dan heuristik, ambil yang **terburuk** (`SAFE` < `WARNING` < `DANGER`).
5. **Simpan ke cache** — hasil baru di-insert ke `url_checks`.

Heuristik mendeteksi TLD mencurigakan, kata kunci berbahaya/promosi, typosquatting brand, angka berurutan, tanda hubung berlebih, dan subdomain berlapis.

---

## Setup Lokal

```bash
# 1. Install dependencies
npm install

# 2. Salin env dan isi nilainya
cp .env.example .env.local

# 3. Jalankan skema di Supabase SQL Editor
#    (copy isi supabase/schema.sql)

# 4. Dev server
npm run dev      # http://localhost:3000
```

### Environment Variables

| Variable | Wajib | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Ya | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ya | Anon key Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Ya (server) | Service role key untuk API routes (insert/update) |
| `VIRUSTOTAL_API_KEY` | Opsional | API key VirusTotal. Tanpa ini, cek URL fallback ke heuristik saja. Free tier: 500 req/hari, 4 req/menit |
| `CACHE_CLEAR_KEY` | Opsional | Secret untuk endpoint `/api/clear-cache` |

---

## Perintah Development

```bash
npm run dev      # Dev server (http://localhost:3000)
npm run build    # Build produksi
npm run start    # Jalankan hasil build
npm run lint     # ESLint check
```

---

## Database (Supabase)

Dua tabel utama dengan Row Level Security aktif:

- **`scam_reports`** — laporan scam dari komunitas. Publik bisa insert; hanya laporan `status = 'verified'` yang bisa dibaca publik.
- **`url_checks`** — cache hasil pemindaian URL termasuk field VirusTotal (`vt_stats`, `vt_detections`, `vt_categories`, `vt_permalink`, `total_engines`).

Skema lengkap ada di [`supabase/schema.sql`](supabase/schema.sql).

---

## Health Check

`GET /api/health` memverifikasi env vars, koneksi Supabase, dan validitas VirusTotal API key. Berguna untuk debug deployment di Vercel.

## Pembersihan Kode / Ponytail Audit (Juni 2026)

Hapusan aman (verifikasi `tsc --noEmit` lolos), tanpa menyentuh pipeline cek URL, validasi, RLS, atau keamanan:
- Hapus dependency `lucide-react` (0 import; UI pakai emoji).
- Hapus `src/lib/supabase.ts` & `src/lib/database.types.ts` (dead: 0 importer, API route bikin client untyped inline sendiri).
- Hapus field tak terpakai di `constants.ts`: `STATS.activeSince`, `STATS.communityMembers`, dan `RISK_LEVELS[].color`.
- Perbaiki type drift: `CheckResult.source` di `cek-url/page.tsx` kini menyertakan `"hybrid"` (server memang bisa mengembalikannya).

Catatan: form lapor (`/api/reports`) sengaja DIBIARKAN tersimulasi untuk sekarang (belum disambungkan ke Supabase) sesuai keputusan. Refactor opsional yang ditunda: konsolidasi factory Supabase server di 4 route + pindah daftar TLD/keyword/spoof heuristik ke `constants.ts`.

### Audit Lanjutan (Juli 2026)

Hapus stub & dead code. Verifikasi: `tsc --noEmit` lolos.
- Hapus `src/app/edukasi/layout.tsx` — metadata dipindah ke `page.tsx` (page sudah `"use client"`, layout tidak bisa export metadata)
- Hapus array `CATEGORIES` + tombol dekoratif di `edukasi/page.tsx` (tidak ada logika filter)
- Ganti `setTimeout(1500)` palsu di form lapor → `fetch()` POST nyata ke `/api/reports`
- Hapus hardcoded fallback `&& key !== "dev-clear-2024"` di `api/clear-cache/route.ts`

### Audit Lanjutan 2 (Juli 2026)

- `tailwind.config.ts`: hapus 3 warna custom tak terpakai (`brand`, `safe`, `warn`)
- `next.config.ts`: hapus file (boilerplate kosong, Next.js pakai default)
- `src/app/page.tsx:131`: ganti class `text-gradient` (tidak ada rule CSS-nya) → Tailwind gradient inline
- `src/app/api/check-url/route.ts`: hapus helper `dedupeReasons` → inline `[...new Set(...)]` langsung di call site

### Audit Lanjutan 3 (Juli 2026)

- `src/lib/base64.ts`: ekstrak `encodeBase64Url` ke shared lib (sebelumnya duplikat inline di `check-url/route.ts` dan `health/route.ts`)
- `check-url/route.ts`: supabase client → singleton module scope; array heuristik (`BAD_TLDS`, `BAD_KEYWORDS`, dll.) + regex → module scope (tidak dibuat ulang per request)
- `database/page.tsx`: precompute `DANGER_COUNT`/`WARN_COUNT`/`SAFE_COUNT` di module scope (import statis, tidak perlu dihitung per render)
