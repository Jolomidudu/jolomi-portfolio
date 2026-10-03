import { NextResponse } from "next/server";
import { callRailway } from "./railway";

export async function proxyPortalBlog(request: Request, path: string, method: string) {
  const token = request.headers.get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("portal_session="))
    ?.slice("portal_session=".length);

  if (!token) return NextResponse.json({ error: "Sign in to manage blog posts." }, { status: 401 });

  try {
    const response = await callRailway(path, {
      method,
      headers: { Authorization: `Bearer ${decodeURIComponent(token)}` },
      ...(method === "GET" || method === "DELETE" ? {} : { body: await request.text() }),
    });
    return new Response(await response.text(), {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ error: "Blog management is temporarily unavailable." }, { status: 503 });
  }
}