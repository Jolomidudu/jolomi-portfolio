import { NextResponse } from "next/server";
import { callRailway } from "../../portal/railway";

export async function GET(request: Request) {
  const token = request.headers.get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("learning_session="))
    ?.slice("learning_session=".length);

  if (!token) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  try {
    const railwayResponse = await callRailway("/api/learning/me", {
      headers: {
        Authorization: `Bearer ${decodeURIComponent(token)}`,
      },
    });

    const result = await railwayResponse.json() as {
      error?: string;
      user?: {
        id?: number | string;
        email?: string;
        fullName?: string;
        enrollment?: {
          trackTitle?: string;
          status?: string;
          paymentPlan?: string;
          experienceLevel?: string;
          learningFormat?: string;
          preferredDays?: string[];
          preferredTime?: string;
          preferredStart?: string;
          timeZone?: string;
          goals?: string;
        };
      };
    };

    if (!railwayResponse.ok || !result.user) {
      return NextResponse.json(
        { error: result.error ?? "Not signed in." },
        { status: railwayResponse.status || 401 },
      );
    }

    return NextResponse.json({ user: result.user });
  } catch {
    return NextResponse.json({ error: "The learning portal is unavailable. Please try again later." }, { status: 503 });
  }
}
