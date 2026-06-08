import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use plain untyped client to avoid Supabase generic inference issues in strict TS build
function getServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scamType, targetName, platform, description, lossAmount, reporterContact, anonymous } = body;

    if (!scamType || !targetName || !platform || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (description.length < 30) {
      return NextResponse.json({ error: "Description too short" }, { status: 400 });
    }

    const supabase = getServerClient();

    const payload = {
      scam_type: scamType,
      target_name: targetName,
      platform,
      description,
      loss_amount: lossAmount ? parseInt(String(lossAmount).replace(/\D/g, "")) : null,
      reporter_contact: anonymous ? null : (reporterContact ?? null),
      anonymous: anonymous ?? true,
      status: "pending",
      risk_level: "DANGER",
      votes: 0,
    };

    const { data, error } = await supabase
      .from("scam_reports")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
    }

    return NextResponse.json({ success: true, reportId: data.id }, { status: 201 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = getServerClient();

    const { data, error } = await supabase
      .from("scam_reports")
      .select("*")
      .eq("status", "verified")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
