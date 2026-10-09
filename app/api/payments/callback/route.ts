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
  failureReason?: "verification" | "confirmation" | "callback",
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
    if (failureReason) url.searchParams.set("reason", failureReason);
    if (reference) url.searchParams.set("reference", reference);
  }
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference");
  const isLearning = reference?.startsWith("jolomi-learning-") ?? false;
  if (!reference || !process.env.PAYSTACK_SECRET_KEY) {
    console.error("Payment callback is missing a reference or Paystack secret.", { hasReference: Boolean(reference) });
    return redirect(request, "failed", reference ?? undefined, isLearning, false, undefined, undefined, undefined, "callback");
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      cache: "no-store",
    });
    const data = await response.json();
    const verified = response.ok && data.data?.status === "success";
    if (!verified) {
      console.error("Paystack payment verification did not succeed.", {
        reference,
        httpStatus: response.status,
        paymentStatus: data.data?.status,
        message: data.message,
      });
      return redirect(request, "failed", reference, isLearning, false, undefined, undefined, undefined, "verification");
    }

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
      if (!confirmation.ok) {
        console.error("Verified learning payment could not be confirmed by the backend.", {
          reference,
          httpStatus: confirmation.status,
          error: confirmationData?.error,
        });
        return redirect(request, "failed", reference, true, false, undefined, undefined, undefined, "confirmation");
      }
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
  } catch (error) {
    console.error("Payment callback failed unexpectedly.", {
      reference,
      error: error instanceof Error ? error.message : "Unknown callback error",
    });
    return redirect(request, "failed", reference, isLearning, false, undefined, undefined, undefined, "callback");
  }
}
