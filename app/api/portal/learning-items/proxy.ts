import { NextResponse } from "next/server";
import { callRailway } from "../railway";

export async function proxyLearningItems(request: Request, backendPath: string, method: "GET" | "POST" | "PATCH" | "DELETE") {
  const token = request.headers.get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("portal_session="))
    ?.slice("portal_session=".length);

  if (!token) return NextResponse.json({ error: "Sign in to manage learning content." }, { status: 401 });

  let body: string | undefined;
  if (method === "POST" || method === "PATCH") {
    try {
      body = JSON.stringify(await request.json());
    } catch {
      return NextResponse.json({ error: "Enter the learning content details." }, { status: 400 });
    }
  }

  try {
    const response = await callRailway(backendPath, {
      method,
      body,
      headers: { Authorization: `Bearer ${decodeURIComponent(token)}` },
    });
    return new Response(await response.text(), {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ error: "Unable to reach the learning portal." }, { status: 503 });
  }
}