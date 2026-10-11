"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

export default function ResetPasswordPage() {
  const tokenRef = useRef("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    tokenRef.current = params.get("token") ?? "";
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    if (password !== confirmation) {
      setErrorMessage("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/learning/reset-password/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenRef.current, password }),
      });
      const result = await response.json() as { updated?: boolean; error?: string };
      if (!response.ok || !result.updated) throw new Error(result.error ?? "Unable to update your password.");
      setIsComplete(true);
      setPassword("");
      setConfirmation("");
      tokenRef.current = "";
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update your password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5f0] px-5 py-10 text-[#111111]">
      <section className="w-full max-w-lg border border-black/10 bg-white p-6 shadow-sm sm:p-9">
        <Link href="/learn" className="text-xs font-semibold uppercase tracking-[0.18em] text-[#007d79]">LearnUp</Link>
        {isComplete ? (
          <>
            <h1 className="mt-7 text-3xl font-semibold">Password updated</h1>
            <p className="mt-3 text-sm leading-6 text-black/60">Your password is ready. Sign in to continue to your learner dashboard.</p>
            <Link href="/learn/login" className="mt-7 inline-flex min-h-11 items-center bg-[#163d34] px-5 py-3 text-sm font-semibold text-white hover:bg-[#214d47]">Go to sign in</Link>
          </>
        ) : (
          <>
            <h1 className="mt-7 text-3xl font-semibold">Set a new password</h1>
            <p className="mt-3 text-sm leading-6 text-black/60">Choose a password with at least 12 characters.</p>
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <label className="block text-sm font-medium">
                  New password
                  <input required minLength={12} maxLength={128} autoComplete="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full border border-black/15 bg-[#f7f7f2] px-4 py-3 outline-none focus:border-[#008c87]" />
                </label>
                <label className="block text-sm font-medium">
                  Confirm new password
                  <input required minLength={12} maxLength={128} autoComplete="new-password" type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-2 w-full border border-black/15 bg-[#f7f7f2] px-4 py-3 outline-none focus:border-[#008c87]" />
                </label>
                {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
                <button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 w-full items-center justify-center bg-[#d7f36a] px-5 py-3 text-sm font-semibold text-[#163d34] hover:bg-[#c7ea53] disabled:cursor-wait disabled:opacity-60">
                  {isSubmitting ? "Updating password..." : "Set password"}
                </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
