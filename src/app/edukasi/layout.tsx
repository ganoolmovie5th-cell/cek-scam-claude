import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Edukasi Digital Anti Scam",
  description:
    "Pelajari modus penipuan terbaru, cara melindungi diri, dan tips aman berinternet dari para ahli keamanan digital Indonesia.",
  openGraph: {
    title: "Edukasi Digital Anti Scam | cek-scam.id",
    description:
      "Pelajari modus penipuan terbaru, cara melindungi diri, dan tips aman berinternet dari para ahli keamanan digital Indonesia.",
    url: `${SITE.url}/edukasi`,
  },
};

export default function EdukasiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
