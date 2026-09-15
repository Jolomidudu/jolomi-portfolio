import { NextResponse } from "next/server";

const services = {
  web: { title: "Websites & web apps", amount: 450000 },
  mobile: { title: "Mobile app development", amount: 750000 },
  design: { title: "UI/UX design", amount: 250000 },
  analytics: { title: "Data analytics", amount: 200000 },
  consultancy: { title: "Consultancy & business development", amount: 75000 },
  maintenance: { title: "Maintenance & social media", amount: 100000 },
} as const;

function appUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const service = services[body.serviceId as keyof typeof services];
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!service || !email || !name) {
      return NextResponse.json({ error: "Please provide a valid service, name and email." }, { status: 400 });
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
        amount: service.amount * 100,
        reference,
        callback_url: callbackUrl,
        metadata: { customer_name: name, service: service.title },
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
