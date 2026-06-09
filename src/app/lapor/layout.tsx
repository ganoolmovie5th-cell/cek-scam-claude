import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Lapor Penipuan Online",
  description:
    "Laporkan website scam, penipu online, atau penipuan digital ke komunitas cek-scam.id. Gratis, cepat, dan anonim.",
  openGraph: {
    title: "Lapor Penipuan Online | cek-scam.id",
    description:
      "Laporkan website scam, penipu online, atau penipuan digital ke komunitas cek-scam.id. Gratis, cepat, dan anonim.",
    url: `${SITE.url}/lapor`,
  },
};

export default function LaporLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
