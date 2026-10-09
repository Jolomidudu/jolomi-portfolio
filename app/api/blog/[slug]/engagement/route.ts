import { NextResponse } from "next/server";
import { callRailway } from "../../../portal/railway";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const visitorId = new URL(request.url).searchParams.get("visitorId") ?? "";
  try {
    const response = await callRailway(
      `/api/blog/${encodeURIComponent(slug)}/engagement?visitorId=${encodeURIComponent(visitorId)}`,
      { method: "GET" },
    );
    return new Response(await response.text(), {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ error: "Unable to load blog engagement." }, { status: 503 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid engagement request." }, { status: 400 });
  }

  try {
    const response = await callRailway(`/api/blog/${encodeURIComponent(slug)}/engagement`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return new Response(await response.text(), {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ error: "Unable to update blog engagement." }, { status: 503 });
  }
}
