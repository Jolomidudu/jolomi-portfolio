import { NextResponse } from "next/server";
import { callRailway } from "../../portal/railway";

function redirect(request: Request, result: "success" | "failed", reference?: string, isLearning = false) {
  const url = new URL(result === "success" ? "/payment/success" : isLearning ? "/learn" : "/services", request.url);
  if (result === "success" && reference) {
    url.searchParams.set("reference", reference);
    if (isLearning) url.searchParams.set("type", "learning");
  } else if (result === "failed") {
    url.searchParams.set("payment", result);
  }
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference");
  const isLearning = reference?.startsWith("jolomi-learning-") ?? false;
  if (!reference || !process.env.PAYSTACK_SECRET_KEY) return redirect(request, "failed", undefined, isLearning);

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      cache: "no-store",
    });
    const data = await response.json();
    const verified = response.ok && data.data?.status === "success";
    if (!verified) return redirect(request, "failed", undefined, isLearning);

    if (isLearning) {
      const enrollmentId = data.data?.metadata?.enrollment_id;
      const confirmation = await callRailway(`/api/learning/payments/${encodeURIComponent(reference)}/confirm`, {
        method: "POST",
        body: JSON.stringify({
          enrollmentId: String(enrollmentId ?? ""),
          amountKobo: data.data?.amount,
          email: data.data?.customer?.email,
        }),
      });
      if (!confirmation.ok) return redirect(request, "failed", undefined, true);
    }

    return redirect(request, "success", reference, isLearning);
  } catch {
    return redirect(request, "failed", undefined, isLearning);
  }
}
