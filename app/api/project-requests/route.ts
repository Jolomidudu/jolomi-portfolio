import { NextResponse } from "next/server";
import { callRailway } from "../portal/railway";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please provide valid project details." }, { status: 400 });
  }

  try {
    const response = await callRailway("/api/enquiries", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const responseBody = await response.text();
    return new Response(responseBody, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json(
      { error: "Project enquiries are temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }
}