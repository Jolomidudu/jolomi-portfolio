import { NextResponse } from "next/server";
import { callRailway } from "../../../../portal/railway";

type RouteContext = {
  params: Promise<{ slug: string; imageId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug, imageId } = await context.params;
  try {
    const response = await callRailway(
      `/api/blog/${encodeURIComponent(slug)}/images/${encodeURIComponent(imageId)}`,
      { method: "GET" },
    );
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/octet-stream",
        "Content-Length": response.headers.get("content-length") ?? "0",
        "Cache-Control": response.headers.get("cache-control") ?? "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to load this blog image." }, { status: 503 });
  }
}
