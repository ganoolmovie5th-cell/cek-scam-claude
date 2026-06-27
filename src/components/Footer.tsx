import Link from "next/link";
import { SITE, STATS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white text-lg">
                🛡️
              </div>
              <span className="font-black text-xl text-white">
                cek-<span className="text-red-400">scam</span>
                <span className="text-gray-400 font-medium">.id</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Platform komunitas Indonesia untuk deteksi penipuan online, verifikasi keamanan website, dan edukasi digital. Bersama kita lebih aman.
            </p>
            <div className="flex gap-3 mt-4">
              <a href={SITE.social.twitter} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-sm transition-colors">
                𝕏
              </a>
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-sm transition-colors">
                📸
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Fitur</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/cek-url", label: "Cek URL / Website" },
                { href: "/database", label: "Database Scammer" },
                { href: "/edukasi", label: "Edukasi Digital" },
                { href: "/lapor", label: "Lapor Scam" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Statistik</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-400">Total Laporan</span>
                <span className="text-white font-medium">{STATS.totalReports.toLocaleString("id-ID")}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Situs Diblokir</span>
                <span className="text-white font-medium">{STATS.sitesBlocked.toLocaleString("id-ID")}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Pengguna Terselamatkan</span>
                <span className="text-white font-medium">{STATS.usersSaved.toLocaleString("id-ID")}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Kerugian Dicegah</span>
                <span className="text-white font-medium">{STATS.totalLossPrevented}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} {SITE.name}. Dibuat dengan ❤️ untuk Indonesia yang lebih aman.
          </p>
          <div className="flex gap-4 text-xs text-gray-400">
            <span>Bukan pengganti laporan resmi ke OJK atau Polri</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
