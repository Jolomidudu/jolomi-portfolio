import { NextResponse } from "next/server";
import { callRailway } from "../../portal/railway";

function getLearningToken(request: Request) {
  return request.headers.get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("learning_session="))
    ?.slice("learning_session=".length);
}

async function forwardProgressRequest(request: Request, method: "GET" | "POST") {
  const token = getLearningToken(request);
  if (!token) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: string | undefined;
  if (method === "POST") {
    try {
      body = JSON.stringify(await request.json());
    } catch {
      return NextResponse.json({ error: "Enter a topic and learning note." }, { status: 400 });
    }
  }

  try {
    const railwayResponse = await callRailway("/api/learning/progress", {
      method,
      body,
      headers: { Authorization: `Bearer ${decodeURIComponent(token)}` },
    });
    const result = await railwayResponse.json();
    return NextResponse.json(result, { status: railwayResponse.status });
  } catch {
    return NextResponse.json({ error: "The learning portal is unavailable. Please try again later." }, { status: 503 });
  }
}

export async function GET(request: Request) {
  return forwardProgressRequest(request, "GET");
}

export async function POST(request: Request) {
  return forwardProgressRequest(request, "POST");
}