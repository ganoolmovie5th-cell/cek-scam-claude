import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scamType, targetName, platform, description, lossAmount, reporterContact, anonymous } = body;

    // Validation
    if (!scamType || !targetName || !platform || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (description.length < 30) {
      return NextResponse.json({ error: "Description too short" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("scam_reports")
      .insert({
        scam_type: scamType,
        target_name: targetName,
        platform,
        description,
        loss_amount: lossAmount ? parseInt(lossAmount.replace(/\D/g, "")) : null,
        reporter_contact: anonymous ? null : reporterContact,
        anonymous: anonymous ?? true,
        status: "pending",
        risk_level: "DANGER",
        votes: 0,
      })
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
    const supabase = createServerSupabaseClient();

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
