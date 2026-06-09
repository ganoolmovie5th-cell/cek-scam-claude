import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Database Scammer Indonesia",
  description:
    "Daftar lengkap website, toko, dan platform penipuan yang telah dilaporkan dan diverifikasi komunitas cek-scam.id.",
  openGraph: {
    title: "Database Scammer Indonesia | cek-scam.id",
    description:
      "Daftar lengkap website, toko, dan platform penipuan yang telah dilaporkan dan diverifikasi komunitas cek-scam.id.",
    url: `${SITE.url}/database`,
  },
};

export default function DatabaseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
