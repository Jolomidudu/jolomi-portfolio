import { NextResponse } from "next/server";
import { callRailway } from "../../../../railway";

type RouteContext = {
  params: Promise<{ id: string; imageId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const token = request.headers.get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("portal_session="))
    ?.slice("portal_session=".length);
  if (!token) return NextResponse.json({ error: "Sign in to view blog images." }, { status: 401 });

  const { id, imageId } = await context.params;
  try {
    const response = await callRailway(
      `/api/admin/blog/${encodeURIComponent(id)}/images/${encodeURIComponent(imageId)}`,
      { headers: { Authorization: `Bearer ${decodeURIComponent(token)}` } },
    );
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/octet-stream",
        "Content-Length": response.headers.get("content-length") ?? "0",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to load this blog image." }, { status: 503 });
  }
}
