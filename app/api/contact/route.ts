import { NextResponse } from "next/server";
import { callRailway } from "../portal/railway";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please complete the contact form and try again." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Please complete the contact form and try again." }, { status: 400 });
  }

  try {
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const response = await callRailway("/api/contact", {
      method: "POST",
      headers: { "x-client-ip": clientIp },
      body: JSON.stringify(body),
    });
    const responseBody = await response.text();
    return new Response(responseBody, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ error: "Contact messaging is temporarily unavailable. Please try again later." }, { status: 503 });
  }
}
