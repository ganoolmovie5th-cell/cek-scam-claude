import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #111827 0%, #470707 55%, #e51b1b 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 140, marginBottom: 24 }}>🛡️</div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 900, letterSpacing: -2 }}>
          <span>cek-</span>
          <span style={{ color: "#ff6b6b" }}>scam</span>
          <span style={{ color: "#9ca3af" }}>.id</span>
        </div>
        <div
          style={{
            fontSize: 38,
            marginTop: 24,
            color: "#f3f4f6",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          {SITE.tagline}
        </div>
        <div
          style={{
            fontSize: 26,
            marginTop: 40,
            color: "#fca5a5",
            display: "flex",
            gap: 24,
          }}
        >
          <span>🔍 Cek URL</span>
          <span>🗃️ Database Scam</span>
          <span>🚨 Lapor</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
