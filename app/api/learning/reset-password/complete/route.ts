import { NextResponse } from "next/server";
import { callRailway } from "../../../portal/railway";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await callRailway("/api/learning/reset-password/complete", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return new Response(await response.text(), {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ error: "Password recovery is temporarily unavailable." }, { status: 503 });
  }
}
