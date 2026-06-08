import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    // URL analysis is handled client-side with heuristics.
    // This endpoint is a placeholder for future server-side enrichment
    // (e.g. VirusTotal API, WHOIS lookup, etc.)
    return NextResponse.json({ cached: false, url });
  } catch (err) {
    console.error("check-url error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
