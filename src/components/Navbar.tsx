"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
const navLinks = [
  { href: "/cek-url", label: "🔍 Cek URL" },
  { href: "/database", label: "🗃️ Database Scam" },
  { href: "/edukasi", label: "📚 Edukasi" },
  { href: "/lapor", label: "📋 Lapor" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">
              🛡️
            </div>
            <span className="font-black text-xl text-gray-900">
              cek-<span className="text-red-600">scam</span>
              <span className="text-gray-500 font-medium">.id</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  pathname === link.href
                    ? "bg-red-50 text-red-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/lapor"
              className="ml-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-all duration-150 shadow-sm hover:shadow-md"
            >
              🚨 Lapor Sekarang
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-0.5 bg-current mb-1 transition-all" style={{ transform: menuOpen ? 'rotate(45deg) translate(2px, 6px)' : 'none' }} />
            <div className="w-5 h-0.5 bg-current mb-1 transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
            <div className="w-5 h-0.5 bg-current transition-all" style={{ transform: menuOpen ? 'rotate(-45deg) translate(2px, -6px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-2 pt-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-red-50 text-red-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/lapor"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold text-center mt-2"
            >
              🚨 Lapor Sekarang
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
