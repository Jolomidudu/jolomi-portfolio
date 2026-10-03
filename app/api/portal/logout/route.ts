import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ signedOut: true });
  response.cookies.set("portal_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/portal",
    maxAge: 0,
  });
  return response;
}