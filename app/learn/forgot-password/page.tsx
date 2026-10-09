"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, ChevronLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setTemporaryPassword("");
    try {
      const response = await fetch("/api/learning/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const result = await response.json() as { error?: string; sent?: boolean; temporaryPassword?: string; message?: string };
      if (!response.ok || !result.sent) {
        throw new Error(result.error ?? "Unable to reset your password. Please try again.");
      }
      setRequestSent(true);
      if (typeof result.temporaryPassword === "string" && result.temporaryPassword.length > 0) {
        setTemporaryPassword(result.temporaryPassword);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to reset your password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f0] px-5 py-10 text-[#111111] sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href="/learn"
          className="mb-4 inline-flex min-h-10 items-center gap-1 bg-[#494848] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#222222]"
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Back to LearnUp
        </Link>

        <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_30px_80px_rgba(18,33,31,0.08)]">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <section className="bg-[#163d34] px-6 py-8 text-[#f7f5ee] sm:px-10 sm:py-10">
              <Link href="/learn" className="inline-flex text-sm font-semibold uppercase tracking-[0.18em] text-[#d7f36a]">
                LearnUp
              </Link>
              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                Get back into your account.
              </h1>
              <p className="mt-4 max-w-md text-base leading-7 text-white/70">
                Send a password assistance request and learner support will help verify your account and restore access.
              </p>
              {/* <div className="mt-8 border-l-2 border-[#d7f36a] bg-white/5 px-4 py-3 text-sm leading-6 text-white/75">
                For account security, we&apos;ll confirm your request without revealing whether an email address has a learner account.
              </div> */}
            </section>

            <section className="px-6 py-8 sm:px-8 sm:py-10">
              {requestSent ? (
                <div className="flex h-full min-h-64 flex-col items-start justify-center">
                  <CheckCircle2 aria-hidden="true" className="h-9 w-9 text-[#16844a]" />
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#547067]">Password reset</p>
                  <h2 className="mt-2 text-2xl font-semibold">A new temporary password is ready</h2>
                  {temporaryPassword ? (
                    <>
                      <p className="mt-3 text-sm leading-6 text-black/60">
                        Use the password below to sign in to your learner account. After you sign in, update it from your dashboard.
                      </p>
                      <div className="mt-4 w-full rounded-2xl border border-[#163d34]/15 bg-[#f7f7f2] p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#547067]">Temporary password</p>
                        <p className="mt-2 break-all font-mono text-lg font-semibold text-[#163d34]">{temporaryPassword}</p>
                      </div>
                    </>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-black/60">
                      If this address is connected to a learner account, the reset has been processed and you can sign in with the new temporary password.
                    </p>
                  )}
                  <Link href="/learn/login" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#163d34] underline-offset-4 hover:underline">
                    Return to sign in <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#547067]">Learner portal</p>
                  <h2 className="mt-2 text-2xl font-semibold">Forgot your password?</h2>
                  <p className="mt-3 text-sm leading-6 text-black/55">
                    Enter the email address you used to register. We&apos;ll send a secure request to learner support.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                    <label className="block text-sm font-medium">
                      Email address
                      <input
                        required
                        type="email"
                        autoComplete="email"
                        maxLength={254}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="mt-2 w-full border border-black/15 bg-[#f7f7f2] px-4 py-3 outline-none focus:border-[#008c87]"
                        placeholder="you@example.com"
                      />
                    </label>

                    {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex min-h-12 w-full items-center justify-center bg-[#d7f36a] px-5 py-3 text-sm font-semibold text-[#163d34] transition-colors hover:bg-[#c7ea53] disabled:cursor-wait disabled:opacity-60"
                    >
                      {isSubmitting ? "Sending request..." : "Send reset request"}
                    </button>
                  </form>

                  <Link href="/learn/login" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[#163d34] underline-offset-4 hover:underline">
                    <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                    Back to sign in
                  </Link>
                </>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
