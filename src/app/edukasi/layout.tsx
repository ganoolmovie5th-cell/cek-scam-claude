import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edukasi Digital Anti Scam",
  description:
    "Pelajari modus penipuan terbaru, cara melindungi diri, dan tips aman berinternet dari para ahli keamanan digital Indonesia.",
};

export default function EdukasiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
