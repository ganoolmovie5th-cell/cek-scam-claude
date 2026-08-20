# Cek Scam

Platform komunitas Indonesia untuk deteksi penipuan online. Cek keamanan website, laporkan scammer, lihat database scam, dan belajar keamanan digital.

**Tech Stack:** Next.js 15 · TypeScript · Tailwind CSS · Supabase · VirusTotal API

**Live:** [cek-scam.web.id](https://www.cek-scam.web.id)

## Features

- Cek URL (verifikasi keamanan website via VirusTotal + heuristik domain)
- Database Scam (daftar website, toko, nomor scammer dari komunitas)
- Edukasi (artikel keamanan digital)
- Lapor Scam (form pelaporan penipuan, anonim opsional)
- Cache hasil pemindaian di Supabase
- SEO (robots.txt, sitemap, Open Graph, JSON-LD)

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` — URL project Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Anon key Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (API routes)
- `VIRUSTOTAL_API_KEY` — opsional, fallback ke heuristik jika kosong
- `CACHE_CLEAR_KEY` — opsional, secret untuk clear cache endpoint

## Project Structure

```
src/
  app/
    api/
      check-url/      → POST: scan URL (VirusTotal + heuristik + cache)
      reports/        → POST: submit laporan, GET: ambil verified
      clear-cache/    → GET: hapus cache (protected)
      health/         → GET: health check
    cek-url/          → Halaman cek URL
    database/         → Halaman database scam
    edukasi/          → Daftar + detail artikel
    lapor/            → Form lapor scam
  components/         → Navbar, Footer
  lib/
    constants.ts      → Single source of truth (data, config)
    supabase.ts       → Supabase client singleton
    base64.ts         → Utility encode/decode
supabase/
  schema.sql          → Database schema (jalankan di SQL Editor)
```

## License

MIT
