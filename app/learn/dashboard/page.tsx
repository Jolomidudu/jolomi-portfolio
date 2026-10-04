"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const milestones = [
  "Programme onboarding",
  "Core learning path",
  "Assignments and feedback",
  "Portfolio project",
];

export default function LearningDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ fullName?: string; email?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch("/api/learning/session", { cache: "no-store" });
        if (response.status === 401) {
          router.push("/learn/login");
          return;
        }

        const result = await response.json() as { user?: { fullName?: string; email?: string }; error?: string };
        if (!response.ok || !result.user) {
          throw new Error(result.error ?? "Unable to load your learning session.");
        }

        setUser(result.user);
      } catch {
        router.push("/learn/login");
      } finally {
        setIsLoading(false);
      }
    }

    void loadSession();
  }, [router]);

  async function signOut() {
    await fetch("/api/learning/logout", { method: "POST" });
    router.push("/learn/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#f5f5f0] px-5 py-10 text-[#111111] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#547067]">Learner portal</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">Your learning dashboard</h1>
            {user && (
              <p className="mt-3 text-sm text-black/60">
                Signed in as <span className="font-semibold text-[#163d34]">{user.fullName || user.email}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/learn" className="inline-flex min-h-11 items-center justify-center bg-[#163d34] px-5 py-3 text-sm font-semibold text-white hover:bg-[#214d47]">
              Back to tracks
            </Link>
            <button type="button" onClick={signOut} className="inline-flex min-h-11 items-center justify-center border border-black/15 px-4 py-3 text-sm font-semibold text-[#163d34] hover:bg-black/5">
              Sign out
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/55">Loading your learning workspace...</div>
        ) : (
          <section className="grid gap-5 md:grid-cols-4">
            {milestones.map((label, index) => (
              <div key={label} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#547067]">Stage {index + 1}</p>
                <h2 className="mt-3 text-xl font-semibold">{label}</h2>
                <p className="mt-2 text-sm text-black/60">This dashboard will show your learning resources, tasks, assignments, mentor feedback, and completed milestones.</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
