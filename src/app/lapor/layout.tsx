import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lapor Penipuan Online",
  description:
    "Laporkan website scam, penipu online, atau penipuan digital ke komunitas cek-scam.id. Gratis, cepat, dan anonim.",
};

export default function LaporLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
