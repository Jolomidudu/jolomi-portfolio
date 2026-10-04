import { callRailway } from "../../portal/railway";

export async function POST(request: Request) {
  try {
    const response = await callRailway("/api/learning/enrollments", {
      method: "POST",
      body: await request.text(),
    });
    return new Response(await response.text(), {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return Response.json({ error: "Registration is temporarily unavailable." }, { status: 503 });
  }
}
