import { NextResponse } from "next/server";
import { callRailway } from "../../portal/railway";

function redirect(
  request: Request,
  result: "success" | "failed",
  reference?: string,
  isLearning = false,
  accountCreated = false,
  temporaryPassword?: string,
  paymentPlan?: string,
  balanceDue?: number,
) {
  const url = new URL(result === "success" ? "/payment/success" : "/payment/failure", request.url);
  if (result === "success" && reference) {
    url.searchParams.set("reference", reference);
    if (isLearning) {
      url.searchParams.set("type", "learning");
      url.searchParams.set("accountCreated", accountCreated ? "1" : "0");
      if (paymentPlan) {
        url.searchParams.set("paymentPlan", paymentPlan);
      }
      if (typeof balanceDue === "number" && Number.isFinite(balanceDue) && balanceDue > 0) {
        url.searchParams.set("balanceDue", String(balanceDue));
      }
      if (temporaryPassword) {
        url.searchParams.set("temporaryPassword", temporaryPassword);
      }
    }
  } else if (result === "failed") {
    if (isLearning) url.searchParams.set("type", "learning");
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
      const confirmationData = await confirmation.json().catch(() => ({}));
      if (!confirmation.ok) return redirect(request, "failed", undefined, true);
      const accountCreated = Boolean(confirmationData?.accountCreated || confirmationData?.account);
      const paymentPlan = typeof confirmationData?.paymentPlan === "string" ? confirmationData.paymentPlan : undefined;
      const balanceDue = typeof confirmationData?.balanceDue === "number" ? confirmationData.balanceDue : undefined;
      return redirect(
        request,
        "success",
        reference,
        isLearning,
        accountCreated,
        typeof confirmationData?.temporaryPassword === "string" ? confirmationData.temporaryPassword : undefined,
        paymentPlan,
        balanceDue,
      );
    }

    return redirect(request, "success", reference, isLearning);
  } catch {
    return redirect(request, "failed", undefined, isLearning);
  }
}
