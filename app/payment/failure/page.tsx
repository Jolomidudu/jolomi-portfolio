import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment failed",
  description: "Your payment was not completed. Please retry or contact support.",
};

type PaymentFailurePageProps = {
  searchParams: Promise<{
    type?: string | string[];
    payment?: string | string[];
    reason?: string | string[];
    reference?: string | string[];
  }>;
};

export default async function PaymentFailurePage({ searchParams }: PaymentFailurePageProps) {
  const params = await searchParams;
  const isLearning = params.type === "learning";
  const hasPaymentFailure = params.payment === "failed";
  const paymentNeedsSupport = isLearning && params.reason === "confirmation";
  const paymentReference = typeof params.reference === "string" ? params.reference : "";

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#111111]">
      <header className="flex h-16 items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Jolomi Dudu home" className="text-xl font-bold">J<span className="text-[#00A9A5]">.</span>D</Link>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#547067] sm:text-xs">Payment status</p>
      </header>

      <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-5 py-4 text-[#111111] sm:px-8">
        <section className="w-full max-w-4xl overflow-hidden border border-[#12211f]/10 shadow-[0_24px_80px_rgba(18,33,31,0.12)]">
          <div className="flex items-center justify-between gap-4 bg-[#f7d9d0] px-5 py-3 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4d2f2d]">Payment status</p>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#4d2f2d]">
              <span className="h-2 w-2 rounded-full bg-[#ef6a4c]" /> Unsuccessful
            </p>
          </div>

          <div className="grid md:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-[#1b1b1b] px-6 py-8 text-[#f8f7ef] sm:px-10 sm:py-9">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f7d9d0] text-[#1b1b1b]">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-none stroke-current stroke-[2.5]">
                  <path d="M7 7l10 10M17 7 7 17" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#d7b8b0]">Payment did not complete</p>
              <h1 className="mt-3 text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {isLearning ? "Payment" : "Your"}
                <span className="mt-1 block text-[#f7d9d0]">not completed.</span>
              </h1>
              <p className="mt-4 max-w-md text-base leading-7 text-white/70">
                {paymentNeedsSupport
                  ? "Paystack confirmed the payment, but we could not activate your enrollment. Please do not pay again yet; contact support with your payment reference so we can resolve it."
                  : isLearning
                    ? "Paystack did not confirm a successful payment. If your bank shows a debit, check your Paystack transaction status before trying again."
                  : "Your payment did not go through. You can try again securely or contact me directly for assistance."}
              </p>
              {paymentNeedsSupport && paymentReference && (
                <p className="mt-4 break-all font-mono text-xs text-white/55">Reference: {paymentReference}</p>
              )}
            </div>

            <div className="flex flex-col justify-between gap-6 bg-[#f0eddf] px-6 py-7 sm:px-9 sm:py-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#547067]">
                  {isLearning ? "Enrollment status" : "Next step"}
                </p>
                <h2 className="mt-3 text-2xl font-semibold leading-tight">
                  {isLearning ? "Your program is still pending." : "Let’s fix this together."}
                </h2>
                <p className="mt-3 text-sm leading-6 text-black/60">
                  {paymentNeedsSupport
                    ? "Your payment may have been collected even though enrollment setup did not finish. Contact support before making another payment."
                    : isLearning
                      ? "If your bank shows no debit and Paystack marks the transaction as failed, you can retry from the learning registration flow."
                    : "You can retry the payment or get in touch if you need help with a different payment method."}
                </p>
              </div>

              {!hasPaymentFailure && (
                <div className="rounded-2xl border border-[#163d34]/15 bg-[#f7f7f2] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#547067]">What happened</p>
                  <p className="mt-2 text-sm leading-6 text-black/60">
                    The payment attempt did not complete. You can retry without creating a duplicate enrollment.
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                {!paymentNeedsSupport && (
                  <Link href={isLearning ? "/learn" : "/services"} className="inline-flex min-h-14 flex-1 items-center justify-center bg-[#163d34] px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#00A9A5]">
                    {isLearning ? "Retry learning payment" : "Try payment again"}
                  </Link>
                )}
                <Link href={isLearning && !paymentNeedsSupport ? "/learn/login" : "/contact"} className="inline-flex min-h-14 flex-1 items-center justify-center border border-black/15 px-5 py-4 text-sm font-semibold text-[#163d34] hover:bg-black/5">
                  {isLearning && !paymentNeedsSupport ? "Go to sign in" : "Contact support"}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
