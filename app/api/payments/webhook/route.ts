import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { callRailway } from "../../portal/railway";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: "Payment webhook is not configured." }, { status: 503 });

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";
  const expectedSignature = createHmac("sha512", secret).update(rawBody).digest();
  const actualSignature = Buffer.from(signature, "hex");
  if (signature.length !== 128 || actualSignature.length !== expectedSignature.length || !timingSafeEqual(actualSignature, expectedSignature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  let event: {
    event?: string;
    data?: {
      reference?: unknown;
      amount?: unknown;
      customer?: { email?: unknown };
      metadata?: { payment_type?: unknown; enrollment_id?: unknown };
    };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  if (event.event !== "charge.success") return NextResponse.json({ received: true });
  const data = event.data;
  if (data?.metadata?.payment_type !== "learning-enrollment") {
    return NextResponse.json({ received: true });
  }

  const reference = typeof data.reference === "string" ? data.reference : "";
  const enrollmentId = String(data.metadata.enrollment_id ?? "");
  const amountKobo = data.amount;
  const email = typeof data.customer?.email === "string" ? data.customer.email : "";
  if (!reference || !/^\d+$/.test(enrollmentId) || !Number.isSafeInteger(amountKobo) || !email) {
    return NextResponse.json({ error: "Incomplete course payment details." }, { status: 400 });
  }

  try {
    const confirmation = await callRailway(`/api/learning/payments/${encodeURIComponent(reference)}/confirm`, {
      method: "POST",
      body: JSON.stringify({ enrollmentId, amountKobo, email }),
    });
    if (!confirmation.ok) {
      console.error("Paystack webhook could not confirm course payment:", confirmation.status);
      return NextResponse.json({ error: "Unable to confirm course payment." }, { status: 503 });
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Unable to confirm course payment." }, { status: 503 });
  }
}
