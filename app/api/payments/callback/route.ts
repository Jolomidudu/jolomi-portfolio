import { NextResponse } from "next/server";

function redirect(request: Request, result: "success" | "failed") {
  const url = new URL("/services", request.url);
  url.searchParams.set("payment", result);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference");
  if (!reference || !process.env.PAYSTACK_SECRET_KEY) return redirect(request, "failed");

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      cache: "no-store",
  });
  const data = await response.json();
  return redirect(request, response.ok && data.data?.status === "success" ? "success" : "failed");
}
