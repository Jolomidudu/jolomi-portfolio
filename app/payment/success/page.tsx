import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment success",
  description: "Your Paystack payment has been verified successfully.",
};

type PaymentSuccessPageProps = {
  searchParams: Promise<{ reference?: string | string[]; type?: string | string[]; accountCreated?: string | string[] }>;
};

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const params = await searchParams;
  const reference = typeof params.reference === "string" ? params.reference : undefined;
  const isLearning = params.type === "learning";
  const accountCreated = typeof params.accountCreated === "string" ? params.accountCreated === "1" : false;

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#111111]">
      <header className="flex h-16 items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Jolomi Dudu home" className="text-xl font-bold">J<span className="text-[#00A9A5]">.</span>D</Link>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#547067] sm:text-xs">Paystack secure checkout</p>
      </header>
      <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-5 py-4 text-[#111111] sm:px-8">
        <section className="w-full max-w-4xl overflow-hidden border border-[#12211f]/10 shadow-[0_24px_80px_rgba(18,33,31,0.12)]">
          <div className="flex items-center justify-between gap-4 bg-[#d7f36a] px-5 py-3 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#193b32]">Payment status</p>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#193b32]">
              <span className="h-2 w-2 rounded-full bg-[#ef6a4c]" /> Successful
            </p>
          </div>

          <div className="grid md:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-[#163d34] px-6 py-8 text-[#f8f7ef] sm:px-10 sm:py-9">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d7f36a] text-[#163d34]">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-none stroke-current stroke-[2.5]">
                  <path d="m5 12.5 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#b8d8c9]">Transaction complete</p>
              <h1 className="mt-3 text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Payment
                <span className="mt-1 block text-[#d7f36a]">received.</span>
              </h1>
              <p className="mt-4 max-w-md text-base leading-7 text-white/70">
                {isLearning
                  ? accountCreated
                    ? "Paystack has verified your payment and your learning account is ready. Sign in with the email used for registration and the temporary password assigned to your learner profile."
                    : "Paystack has verified your payment and your program registration is received. Tutor assignment and your learning schedule will be confirmed separately."
                  : "Paystack has verified your payment. Thank you for choosing to work with me; I&apos;ll be in touch about the next steps."}
              </p>
            </div>

            <div className="flex flex-col justify-between gap-6 bg-[#f0eddf] px-6 py-7 sm:px-9 sm:py-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#547067]">{isLearning ? "Registration received" : "You're all set"}</p>
                <h2 className="mt-3 text-2xl font-semibold leading-tight">{isLearning ? "Your learning journey is getting started." : "A good next step starts here."}</h2>
                <p className="mt-3 text-sm leading-6 text-black/60">
                  {isLearning
                    ? accountCreated
                      ? "Your learner profile is active. Use the login page to continue into your learning dashboard and track your course progress."
                      : "Keep your payment reference for your records. We will follow up about tutor assignment and scheduling."
                    : "Take a look through the services and find what you'd like to build next."}
                </p>
              </div>

              {reference && (
                <div className="border-y border-[#163d34]/15 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/45">Transaction reference</p>
                  <p className="mt-2 break-all font-mono text-xs text-[#163d34]">{reference}</p>
                </div>
              )}

              <Link href={isLearning ? (accountCreated ? "/learn/login" : "/learn") : "/services"} className="inline-flex min-h-14 items-center justify-between gap-5 bg-[#163d34] px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#00A9A5]">
                {isLearning ? (accountCreated ? "Open learner sign in" : "Return to learning programs") : "Check out my services"}
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-2">
                  <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
