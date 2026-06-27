import Link from "next/link";
import { notFound } from "next/navigation";
import { EDUCATION_ARTICLES, SITE } from "@/lib/constants";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return EDUCATION_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = EDUCATION_ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `/edukasi/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${SITE.url}/edukasi/${slug}`,
      type: "article",
      publishedTime: new Date(article.date).toISOString(),
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = EDUCATION_ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = EDUCATION_ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: new Date(article.date).toISOString(),
    dateModified: new Date(article.date).toISOString(),
    articleSection: article.category,
    inLanguage: "id-ID",
    author: { "@type": "Organization", name: SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/edukasi/${slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900">Beranda</Link>
          <span>/</span>
          <Link href="/edukasi" className="hover:text-gray-900">Edukasi</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">{article.title}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
              {/* Article Header */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 text-center border-b border-gray-100">
                <div className="text-6xl mb-4">{article.icon}</div>
                <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                  {article.category}
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-4 mb-3 leading-tight">
                  {article.title}
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed max-w-xl mx-auto">{article.excerpt}</p>
                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                  <span>⏱ {article.readTime}</span>
                  <span>•</span>
                  <span>📅 {article.date}</span>
                  <span>•</span>
                  <span>✍️ Tim cek-scam.id</span>
                </div>
              </div>

              {/* Article Body */}
              <div className="p-8">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {article.excerpt} Dalam artikel ini, kami akan membahas secara detail tips dan langkah konkret yang bisa kamu lakukan untuk melindungi dirimu.
                  </p>

                  <h2 className="text-xl font-black text-gray-900 mb-4 mt-8">
                    {article.tips.length} Tips Penting yang Wajib Kamu Tahu
                  </h2>

                  <div className="space-y-4">
                    {article.tips.map((tip, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium text-sm">{tip}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-6">
                    <h3 className="font-black text-red-800 mb-2 flex items-center gap-2">
                      <span>🚨</span> Sudah Terlanjur Kena Scam?
                    </h3>
                    <p className="text-red-700 text-sm leading-relaxed mb-4">
                      Jangan panik. Segera lakukan langkah berikut: amankan akun/rekening kamu, kumpulkan bukti, dan laporkan ke pihak berwajib.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href="/lapor" className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                        Lapor ke cek-scam.id
                      </Link>
                      <a href="https://www.ojk.go.id" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors">
                        Lapor ke OJK
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Action */}
            <div className="bg-red-600 rounded-2xl p-5 text-white text-center">
              <div className="text-3xl mb-2">🚨</div>
              <h3 className="font-black mb-2">Pernah kena scam?</h3>
              <p className="text-red-200 text-xs mb-4">Bantu komunitas dengan melaporkan pengalaman kamu</p>
              <Link href="/lapor" className="block py-2.5 bg-white text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors">
                Lapor Sekarang
              </Link>
            </div>

            {/* Cek URL */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">Curiga dengan sebuah website?</h3>
              <p className="text-gray-500 text-xs mb-3">Cek dulu sebelum belanja atau memasukkan data</p>
              <Link href="/cek-url" className="block py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs text-center hover:bg-blue-700 transition-colors">
                Cek URL Sekarang
              </Link>
            </div>

            {/* Related Articles */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">📖 Artikel Terkait</h3>
              <div className="space-y-3">
                {related.map((a) => (
                  <Link key={a.id} href={`/edukasi/${a.slug}`} className="flex gap-3 group">
                    <span className="text-xl shrink-0">{a.icon}</span>
                    <div>
                      <p className="text-xs font-medium text-gray-800 group-hover:text-purple-600 transition-colors leading-snug line-clamp-2">
                        {a.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.readTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
