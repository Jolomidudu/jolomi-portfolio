import { NextResponse } from "next/server";
import { callRailway } from "../railway";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter your portal email and password." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Enter your portal email and password." }, { status: 400 });
  }

  const { email, password } = body as Record<string, unknown>;
  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Enter your portal email and password." }, { status: 400 });
  }

  try {
    const railwayResponse = await callRailway("/api/auth/login", {
      method: "POST",
      headers: {
        "x-client-ip": request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown",
      },
      body: JSON.stringify({ email, password }),
    });
    const result = await railwayResponse.json() as { error?: string; token?: string; expiresIn?: number };
    if (!railwayResponse.ok || !result.token || !result.expiresIn) {
      return NextResponse.json(
        { error: result.error ?? "Unable to sign in." },
        { status: railwayResponse.status },
      );
    }

    const response = NextResponse.json({ signedIn: true });
    response.cookies.set("portal_session", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/portal",
      maxAge: result.expiresIn,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "The portal is unavailable. Please try again later." }, { status: 503 });
  }
}