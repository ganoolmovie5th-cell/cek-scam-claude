import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Database Scammer Indonesia",
  description:
    "Daftar website, toko, dan platform penipuan yang telah dilaporkan dan diverifikasi komunitas cek-scam.id.",
};

export default function DatabaseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
