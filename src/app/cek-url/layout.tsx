import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cek URL & Website",
  description:
    "Verifikasi keamanan website atau toko online sebelum belanja. Didukung VirusTotal — 87+ security engine.",
};

export default function CekUrlLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
