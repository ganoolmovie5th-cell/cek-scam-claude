import Link from "next/link";
import { STATS, SCAM_DATABASE, EDUCATION_ARTICLES, RISK_LEVELS, SITE } from "@/lib/constants";

export default function HomePage() {
  const recentScams = SCAM_DATABASE.filter((s) => s.risk === "DANGER").slice(0, 3);
  const recentArticles = EDUCATION_ARTICLES.slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        email: SITE.email,
        sameAs: [SITE.social.twitter, SITE.social.instagram],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        inLanguage: "id-ID",
        publisher: { "@id": `${SITE.url}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE.url}/database?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-red-900/50 border border-red-700/50 rounded-full px-4 py-1.5 text-sm text-red-300 mb-6">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              {STATS.totalReports.toLocaleString("id-ID")}+ laporan tercatat hari ini
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              Lindungi Dirimu dari{" "}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Penipuan Online
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl">
              Platform komunitas #1 Indonesia untuk cek keamanan website, laporkan scammer, dan belajar cara aman berinternet. Gratis, cepat, dan terpercaya.
            </p>

            {/* Quick URL Check */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-8 max-w-xl">
              <p className="text-sm text-gray-300 mb-3 font-medium">🔍 Cek website sekarang:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Contoh: toko-murah-banget.com"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:border-red-400"
                  readOnly
                />
                <Link
                  href="/cek-url"
                  className="px-5 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  Cek →
                </Link>
              </div>
              <p className="text-xs text-gray-400 mt-2">* Klik Cek untuk menggunakan fitur lengkap</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link href="/cek-url" className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-red-900/30">
                🔍 Cek URL Sekarang
              </Link>
              <Link href="/lapor" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold text-sm transition-all">
                🚨 Lapor Scam
              </Link>
              <Link href="/database" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold text-sm transition-all">
                🗃️ Lihat Database
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: STATS.totalReports.toLocaleString("id-ID"), label: "Total Laporan", icon: "📋", color: "text-red-600" },
              { value: STATS.sitesBlocked.toLocaleString("id-ID"), label: "Situs Diblokir", icon: "🚫", color: "text-orange-600" },
              { value: STATS.usersSaved.toLocaleString("id-ID"), label: "Pengguna Terselamatkan", icon: "✅", color: "text-green-600" },
              { value: STATS.totalLossPrevented, label: "Kerugian Dicegah", icon: "💰", color: "text-blue-600" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className={`text-2xl md:text-3xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Semua yang Kamu Butuhkan untuk <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Aman Online</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              4 fitur utama yang dirancang khusus untuk melindungi warga Indonesia dari penipuan digital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🔍",
                title: "Cek URL",
                desc: "Verifikasi keamanan website atau toko online sebelum kamu belanja atau memasukkan data.",
                href: "/cek-url",
                color: "from-blue-500 to-cyan-500",
                bg: "bg-blue-50",
                border: "border-blue-100",
              },
              {
                icon: "🗃️",
                title: "Database Scam",
                desc: "Lihat daftar lengkap website, toko, dan nomor scammer yang telah dilaporkan komunitas.",
                href: "/database",
                color: "from-red-500 to-orange-500",
                bg: "bg-red-50",
                border: "border-red-100",
              },
              {
                icon: "📚",
                title: "Edukasi Digital",
                desc: "Pelajari modus-modus penipuan terbaru dan cara melindungi diri dengan artikel kuratif.",
                href: "/edukasi",
                color: "from-purple-500 to-pink-500",
                bg: "bg-purple-50",
                border: "border-purple-100",
              },
              {
                icon: "🚨",
                title: "Lapor Scam",
                desc: "Bantu komunitas dengan melaporkan pengalaman penipuan yang kamu alami atau ketahui.",
                href: "/lapor",
                color: "from-green-500 to-emerald-500",
                bg: "bg-green-50",
                border: "border-green-100",
              },
            ].map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className={`group card-hover ${f.bg} border ${f.border} rounded-2xl p-6 block`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-4 text-sm font-semibold text-gray-700 group-hover:text-gray-900 flex items-center gap-1">
                  Gunakan fitur <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT SCAMS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">🚨 Laporan Terbaru</h2>
              <p className="text-gray-500 text-sm mt-1">Scammer yang baru saja dilaporkan komunitas</p>
            </div>
            <Link href="/database" className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-1">
              Lihat semua <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentScams.map((scam) => {
              const risk = RISK_LEVELS[scam.risk];
              return (
                <div key={scam.id} className={`rounded-2xl border ${risk.border} ${risk.bg} p-5`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${risk.badge}`}>
                      {risk.icon} {risk.label}
                    </span>
                    <span className="text-xs text-gray-600">{scam.reports} laporan</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 truncate">{scam.name}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">{scam.description}</p>
                  <div className="mt-3 pt-3 border-t border-gray-200/60 flex items-center justify-between">
                    <span className="text-xs text-gray-600">{scam.platform}</span>
                    <span className="text-xs text-gray-600">{scam.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── EDUCATION PREVIEW ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">📚 Tips & Edukasi</h2>
              <p className="text-gray-500 text-sm mt-1">Pelajari cara aman berinternet dari artikel terpercaya</p>
            </div>
            <Link href="/edukasi" className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-1">
              Lihat semua <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <Link
                key={article.id}
                href={`/edukasi/${article.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl p-6 card-hover block"
              >
                <div className="text-3xl mb-4">{article.icon}</div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                  {article.category}
                </span>
                <h3 className="font-bold text-gray-900 text-sm mt-3 mb-2 leading-snug group-hover:text-red-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{article.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>⏱ {article.readTime}</span>
                  <span>{article.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO CONTENT (heading cascade h2→h6) ── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
            Tentang cek-scam.id: Lawan Penipuan Online Bersama
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            cek-scam.id adalah platform komunitas Indonesia yang membantu kamu mendeteksi penipuan digital sebelum menjadi korban. Mulai dari verifikasi keamanan website, database scammer yang dilaporkan komunitas, hingga edukasi keamanan digital, semuanya gratis dan terbuka untuk siapa saja.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Cara Melindungi Diri dari Scam</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Penipuan online terus berkembang, dari phishing, investasi bodong, sampai pinjol ilegal. Kenali polanya dan biasakan langkah pencegahan sederhana setiap hari.
              </p>

              <h4 className="text-base font-bold text-gray-900 mb-2">Verifikasi Sebelum Percaya</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Selalu cek URL, reputasi toko, dan izin resmi sebelum mengirim uang atau data pribadi. Satu menit verifikasi bisa menyelamatkan tabunganmu.
              </p>

              <h5 className="text-sm font-bold text-gray-900 mb-2">Tanda Bahaya yang Sering Muncul</h5>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Harga terlalu murah, tekanan untuk segera transfer, domain mirip brand terkenal, dan permintaan OTP adalah sinyal klasik penipuan.
              </p>

              <h6 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Langkah Cepat Jika Ragu</h6>
              <p className="text-gray-600 text-sm leading-relaxed">
                Gunakan fitur <Link href="/cek-url" className="text-red-600 font-semibold hover:underline">Cek URL</Link> untuk memindai situs, lalu cek <Link href="/database" className="text-red-600 font-semibold hover:underline">Database Scam</Link> untuk melihat apakah sudah pernah dilaporkan.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Peran Komunitas</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Setiap laporan dari pengguna memperkuat database dan membantu orang lain terhindar dari modus yang sama. Kamu bisa ikut berkontribusi tanpa harus menyebut identitas.
              </p>

              <h4 className="text-base font-bold text-gray-900 mb-2">Laporkan dengan Aman</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Fitur <Link href="/lapor" className="text-red-600 font-semibold hover:underline">Lapor Scam</Link> mendukung pelaporan anonim. Tim kami memverifikasi sebelum data ditampilkan ke publik.
              </p>

              <h5 className="text-sm font-bold text-gray-900 mb-2">Belajar dari Kasus Nyata</h5>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Halaman <Link href="/edukasi" className="text-red-600 font-semibold hover:underline">Edukasi</Link> berisi artikel praktis tentang phishing, investasi bodong, pinjol ilegal, dan keamanan akun.
              </p>

              <h6 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Tetap Waspada</h6>
              <p className="text-gray-600 text-sm leading-relaxed">
                Keamanan digital adalah kebiasaan, bukan sekali jalan. Bagikan informasi ini ke keluarga dan teman agar makin banyak yang terlindungi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-4">🛡️</div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Pernah kena scam? Bantu orang lain!
          </h2>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
            Setiap laporan kamu membantu ribuan orang Indonesia terhindar dari penipuan yang sama. Laporan gratis, cepat, dan anonim.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/lapor" className="px-8 py-4 bg-white text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors shadow-lg">
              🚨 Lapor Scam Sekarang
            </Link>
            <Link href="/edukasi" className="px-8 py-4 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl font-bold text-sm transition-colors">
              📚 Belajar Cara Aman
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
