import Link from "next/link";
import { EDUCATION_ARTICLES } from "@/lib/constants";

const CATEGORIES = ["Semua", "Belanja Online", "Keamanan Digital", "Investasi", "Keamanan Akun", "Pinjaman Online", "Penipuan Sosial"];

export default function EdukasiPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-500 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">📚</div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">Edukasi Digital</h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">
            Pelajari modus penipuan terbaru, cara melindungi diri, dan tips aman berinternet dari para ahli keamanan digital Indonesia.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                cat === "Semua"
                  ? "bg-purple-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="text-6xl">{EDUCATION_ARTICLES[0].icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">⭐ Artikel Unggulan</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{EDUCATION_ARTICLES[0].category}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-3">{EDUCATION_ARTICLES[0].title}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{EDUCATION_ARTICLES[0].excerpt}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {EDUCATION_ARTICLES[0].tips.slice(0, 3).map((tip, i) => (
                  <span key={i} className="text-xs bg-white border border-purple-200 text-purple-700 px-3 py-1 rounded-full">
                    {tip}
                  </span>
                ))}
              </div>
              <Link
                href={`/edukasi/${EDUCATION_ARTICLES[0].slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Baca Artikel <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EDUCATION_ARTICLES.slice(1).map((article) => (
            <Link
              key={article.id}
              href={`/edukasi/${article.slug}`}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center text-5xl h-32">
                {article.icon}
              </div>
              <div className="p-5">
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                  {article.category}
                </span>
                <h3 className="font-bold text-gray-900 text-sm mt-3 mb-2 leading-snug group-hover:text-purple-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">{article.excerpt}</p>

                {/* Tips preview */}
                <div className="space-y-1 mb-4">
                  {article.tips.slice(0, 2).map((tip, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                      <span className="line-clamp-1">{tip}</span>
                    </div>
                  ))}
                  {article.tips.length > 2 && (
                    <p className="text-xs text-gray-500 pl-4">+{article.tips.length - 2} tips lainnya...</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span>⏱ {article.readTime}</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-purple-600 rounded-3xl p-8 text-white text-center">
          <div className="text-4xl mb-3">🤝</div>
          <h3 className="text-xl font-black mb-2">Ada pengalaman scam yang ingin dibagikan?</h3>
          <p className="text-purple-200 text-sm mb-5">
            Bantu edukasi komunitas dengan berbagi cerita dan tips dari pengalaman nyata kamu.
          </p>
          <Link
            href="/lapor"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-bold text-sm hover:bg-purple-50 transition-colors"
          >
            🚨 Lapor & Bantu Komunitas
          </Link>
        </div>
      </div>
    </div>
  );
}
