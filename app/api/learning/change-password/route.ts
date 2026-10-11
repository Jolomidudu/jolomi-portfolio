import { NextResponse } from "next/server";
import { callRailway } from "../../portal/railway";

export async function POST(request: Request) {
  const token = request.headers.get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("learning_session="))
    ?.slice("learning_session=".length);
  if (!token) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  try {
    const body = JSON.stringify(await request.json());
    const response = await callRailway("/api/learning/change-password", {
      method: "POST",
      body,
      headers: { Authorization: `Bearer ${decodeURIComponent(token)}` },
    });
    return new Response(await response.text(), {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ error: "Unable to update your password right now." }, { status: 503 });
  }
}
