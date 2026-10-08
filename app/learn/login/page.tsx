"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Eye, EyeOff, Headset } from "lucide-react";
import { useState, type FormEvent } from "react";

export default function LearningLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/learning/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json() as { error?: string; signedIn?: boolean };

      if (!response.ok || !result.signedIn) {
        throw new Error(result.error ?? "Unable to sign in.");
      }

      router.push("/learn/dashboard");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign in.");
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
              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] sm:text-4xl">Sign into your learnUp account.</h1>
              <p className="mt-4 max-w-md text-base leading-7 text-white/70">
                Access your enrollment details, learning plan, assignments, and progress tracking from here.
              </p>
              <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5 text-sm leading-6 text-white/75">
                <p className="font-semibold text-[#d7f36a]">After registration</p>
                <p className="mt-2">Your learnup profile is created automatically after payment is verified. Use the email address you registered with along with your temporary password.</p>
              </div>
            </section>

            <section className="px-6 py-8 sm:px-8 sm:py-10">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#547067]">Learner portal</p>
                  <h2 className="mt-2 text-2xl font-semibold">Welcome back</h2>
                </div>
                <Link href="/learn" className="text-sm font-medium text-[#163d34] underline-offset-4 hover:underline">
                  Explore tracks
                </Link>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block text-sm font-medium">
                  Email address
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 w-full border border-black/15 bg-[#f7f7f2] px-4 py-3 outline-none focus:border-[#008c87]"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="block text-sm font-medium">
                  Password
                  <span className="relative mt-2 block">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full border border-black/15 bg-[#f7f7f2] py-3 pl-4 pr-12 outline-none focus:border-[#008c87]"
                      placeholder="Your learnUp password"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-black/55 transition-colors hover:text-[#163d34]"
                    >
                      {showPassword ? (
                        <EyeOff aria-hidden="true" className="h-4 w-4" />
                      ) : (
                        <Eye aria-hidden="true" className="h-4 w-4" />
                      )}
                    </button>
                  </span>
                </label>

                {errorMessage && (
                  <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-12 w-full items-center justify-center bg-[#d7f36a] px-5 py-3 text-sm font-semibold text-[#163d34] transition-colors hover:bg-[#c7ea53] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
      <Link
        href="/contact"
        className="fixed bottom-[100px] right-6 z-40 flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-full bg-[#7b1e1e] px-2 text-center text-[10px] font-semibold leading-tight text-white shadow-lg transition-colors hover:bg-[#651717]"
      >
        <Headset aria-hidden="true" className="h-4 w-4" />
        <span>HELP</span>
      </Link>
    </main>
  );
}
