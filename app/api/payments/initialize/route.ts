import { NextResponse } from "next/server";
import { projectServices } from "../../../projects/project-services";

function appUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json();
    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Please provide valid payment details." }, { status: 400 });
    }

    const body = payload as Record<string, unknown>;
    const paymentType = body.paymentType;
    const serviceId = typeof body.serviceId === "string" ? body.serviceId : "";
    const service = projectServices.find((item) => item.slug === serviceId);
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    let amount: number;
    let serviceName: string;

    if (paymentType === "deposit" && service) {
      amount = Math.round(service.startingAmount * 0.25);
      serviceName = service.name;
    } else if (paymentType === "custom" && typeof body.customAmount === "number" && Number.isSafeInteger(body.customAmount) && body.customAmount >= 100 && body.customAmount <= Math.floor(Number.MAX_SAFE_INTEGER / 100)) {
      amount = body.customAmount;
      serviceName = "Custom amount";
    } else {
      return NextResponse.json({ error: "Choose a service deposit or enter a valid amount of at least ₦100." }, { status: 400 });
    }

    if (!email || !name) {
      return NextResponse.json({ error: "Please provide a valid name and email." }, { status: 400 });
    }

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const reference = `jolomi-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const callbackUrl = `${appUrl()}/api/payments/callback`;

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: "Paystack is not configured yet." }, { status: 503 });
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount * 100,
        reference,
        callback_url: callbackUrl,
        metadata: { customer_name: name, service: serviceName, payment_type: paymentType },
      }),
    });
    const data = await response.json();

    if (!response.ok || !data.status || !data.data?.authorization_url) {
      return NextResponse.json({ error: "Paystack could not start this payment." }, { status: 502 });
    }

    return NextResponse.json({ checkoutUrl: data.data.authorization_url });
  } catch {
    return NextResponse.json({ error: "Unable to start payment. Please try again." }, { status: 500 });
  }
}
