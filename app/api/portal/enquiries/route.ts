import { NextResponse } from "next/server";
import { callRailway } from "../railway";

export async function GET(request: Request) {
  const token = request.headers.get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("portal_session="))
    ?.slice("portal_session=".length);

  if (!token) return NextResponse.json({ error: "Sign in to view enquiries." }, { status: 401 });

  try {
    const response = await callRailway("/api/enquiries", {
      headers: { Authorization: `Bearer ${decodeURIComponent(token)}` },
    });
    const responseBody = await response.text();
    return new Response(responseBody, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ error: "Unable to load enquiries right now." }, { status: 503 });
  }
}