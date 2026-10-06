import { NextResponse } from "next/server";
import { callRailway } from "../../portal/railway";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter your learning email and password." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Enter your learning email and password." }, { status: 400 });
  }

  const { email, password } = body as Record<string, unknown>;
  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Enter your learning email and password." }, { status: 400 });
  }

  try {
    const railwayResponse = await callRailway("/api/learning/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "x-client-ip": request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown",
      },
    });
    const result = await railwayResponse.json() as {
      error?: string;
      token?: string;
      expiresIn?: number;
      user?: { id?: number | string; email?: string; fullName?: string };
    };

    if (!railwayResponse.ok || !result.token || !result.expiresIn) {
      return NextResponse.json(
        { error: result.error ?? "Unable to sign in." },
        { status: railwayResponse.status },
      );
    }

    const response = NextResponse.json({ signedIn: true, user: result.user ?? { email } });
    response.cookies.set("learning_session", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: result.expiresIn,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "The learning portal is unavailable. Please try again later." }, { status: 503 });
  }
}
