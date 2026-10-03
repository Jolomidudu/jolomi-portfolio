import { NextResponse } from "next/server";

const recipient = "jollofdudu@gmail.com";
const services = new Set([
  "Branding",
  "Logo",
  "Web App",
  "Mobile App",
  "Product Design",
  "Data Analytics",
  "IT Coaching",
  "Gadget Repair",
  "Strategic Planning",
  "Project Management",
]);
const countryCodes = new Set(["+234", "+233", "+254", "+27", "+44", "+1", "+61", "+91"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please provide valid project details." }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: "Please provide valid project details." }, { status: 400 });
  }

  const service = getString(body.service, 80);
  const description = getString(body.description, 5000);
  const startDate = getString(body.startDate, 10);
  const firstName = getString(body.firstName, 100);
  const lastName = getString(body.lastName, 100);
  const email = getString(body.email, 254);
  const countryCode = getString(body.countryCode, 5);
  const phone = getString(body.phone, 10);
  const date = new Date(`${startDate}T00:00:00.000Z`);
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(startDate)
    && !Number.isNaN(date.getTime())
    && date.toISOString().slice(0, 10) === startDate;
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (
    !services.has(service)
    || !description
    || !validDate
    || !firstName
    || !lastName
    || !validEmail
    || !countryCodes.has(countryCode)
    || !/^\d{10}$/.test(phone)
  ) {
    return NextResponse.json({ error: "Please check the form details and try again." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    return NextResponse.json(
      { error: "Project requests are not configured yet. Please email jollofdudu@gmail.com directly." },
      { status: 503 },
    );
  }

  const text = [
    "New project request",
    "",
    `Service: ${service}`,
    `Preferred start date: ${startDate}`,
    "",
    "Project description:",
    description,
    "",
    `Name: ${firstName} ${lastName}`,
    `Email: ${email}`,
    `Phone: ${countryCode} ${phone}`,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: email,
        subject: `${service} project request from ${firstName} ${lastName}`,
        text,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "We couldn't send your request. Please try again shortly." }, { status: 502 });
    }

    return NextResponse.json({ sent: true });
  } catch {
    return NextResponse.json({ error: "We couldn't send your request. Please try again shortly." }, { status: 502 });
  }
}