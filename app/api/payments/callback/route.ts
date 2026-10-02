import { NextResponse } from "next/server";

function redirect(request: Request, result: "success" | "failed", reference?: string) {
  const url = new URL(result === "success" ? "/payment/success" : "/services", request.url);
  if (result === "success" && reference) {
    url.searchParams.set("reference", reference);
  } else if (result === "failed") {
    url.searchParams.set("payment", result);
  }
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
  const verified = response.ok && data.data?.status === "success";
  return redirect(request, verified ? "success" : "failed", verified ? reference : undefined);
}
