import { NextResponse } from "next/server";
import { callRailway } from "../../../../portal/railway";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = request.headers.get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("learning_session="))
    ?.slice("learning_session=".length);

  if (!token) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;

  try {
    const body = JSON.stringify(await request.json());
    const response = await callRailway(`/api/learning/items/${encodeURIComponent(id)}/completion`, {
      method: "PATCH",
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
