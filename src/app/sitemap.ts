import { MetadataRoute } from "next";
import { SITE, EDUCATION_ARTICLES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;

  const staticPages = [
    { url: base, priority: 1.0, changeFrequency: "daily" as const },
    { url: `${base}/cek-url`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${base}/database`, priority: 0.9, changeFrequency: "daily" as const },
    { url: `${base}/lapor`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${base}/edukasi`, priority: 0.8, changeFrequency: "weekly" as const },
  ];

  const articlePages = EDUCATION_ARTICLES.map((article) => ({
    url: `${base}/edukasi/${article.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: new Date(article.date),
  }));

  return [...staticPages, ...articlePages];
}
