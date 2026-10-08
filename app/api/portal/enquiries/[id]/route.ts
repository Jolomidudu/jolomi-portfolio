import { NextResponse } from "next/server";
import { callRailway } from "../../railway";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const token = request.headers.get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("portal_session="))
    ?.slice("portal_session=".length);

  if (!token) return NextResponse.json({ error: "Sign in to delete enquiries." }, { status: 401 });

  const { id } = await context.params;
  if (!/^\d+$/.test(id)) return NextResponse.json({ error: "Invalid enquiry ID." }, { status: 400 });

  try {
    const response = await callRailway(`/api/enquiries/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${decodeURIComponent(token)}` },
    });
    const responseBody = await response.text();
    return new Response(responseBody, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ error: "Unable to delete this enquiry right now." }, { status: 503 });
  }
}
