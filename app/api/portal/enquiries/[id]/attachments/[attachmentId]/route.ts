import { NextResponse } from "next/server";
import { callRailway } from "../../../../railway";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string; attachmentId: string }> },
) {
  const token = request.headers.get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("portal_session="))
    ?.slice("portal_session=".length);

  if (!token) return NextResponse.json({ error: "Sign in to download attachments." }, { status: 401 });

  const { id, attachmentId } = await context.params;
  try {
    const response = await callRailway(
      `/api/enquiries/${encodeURIComponent(id)}/attachments/${encodeURIComponent(attachmentId)}`,
      { headers: { Authorization: `Bearer ${decodeURIComponent(token)}` } },
    );

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/octet-stream",
        "Content-Disposition": response.headers.get("content-disposition") ?? "attachment",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to download this attachment." }, { status: 503 });
  }
}
