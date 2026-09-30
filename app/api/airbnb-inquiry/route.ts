import { NextRequest, NextResponse } from "next/server";
import { AIRBNB_INQUIRY_WEBHOOK_URL, AIRBNB_WEBHOOK_CONFIGURED } from "../../lib/config";

export async function POST(request: NextRequest) {
  if (!AIRBNB_WEBHOOK_CONFIGURED) {
    return NextResponse.json(
      { error: "Airbnb inquiry webhook is not configured yet." },
      { status: 503 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const webhookRes = await fetch(AIRBNB_INQUIRY_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!webhookRes.ok) {
      throw new Error(`Webhook responded with status ${webhookRes.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Airbnb inquiry webhook error:", err);
    return NextResponse.json(
      { error: "Failed to submit inquiry to CRM." },
      { status: 502 }
    );
  }
}