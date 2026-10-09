import { callRailway } from "../../portal/railway";

export async function POST(request: Request) {
  try {
    const response = await callRailway("/api/learning/enrollments", {
      method: "POST",
      body: await request.text(),
    });
    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage = "Registration is temporarily unavailable.";

      try {
        const payload = JSON.parse(responseText);
        if (typeof payload?.error === "string" && payload.error.trim()) {
          errorMessage = payload.error;
        }
      } catch {
        // Preserve the fallback message for non-JSON backend failures.
      }

      return Response.json({ error: errorMessage }, { status: response.status || 503 });
    }

    return new Response(responseText, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : "Registration is temporarily unavailable.";
    return Response.json({ error: message }, { status: 503 });
  }
}
