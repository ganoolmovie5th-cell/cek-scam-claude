import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Cek Keamanan URL & Website",
  description:
    "Verifikasi keamanan website atau toko online sebelum belanja. Didukung VirusTotal — 87+ security engine sekaligus.",
  openGraph: {
    title: "Cek Keamanan URL & Website | cek-scam.id",
    description:
      "Verifikasi keamanan website atau toko online sebelum belanja. Didukung VirusTotal — 87+ security engine sekaligus.",
    url: `${SITE.url}/cek-url`,
  },
};

export default function CekUrlLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
