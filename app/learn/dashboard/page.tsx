import Link from "next/link";

export const metadata = {
  title: "Learning dashboard",
  description: "Learner dashboard and progress workspace.",
};

const milestones = [
  "Programme onboarding",
  "Core learning path",
  "Assignments and feedback",
  "Portfolio project",
];

export default function LearningDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f0] px-5 py-10 text-[#111111] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#547067]">Learner portal</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">Your learning dashboard</h1>
          </div>
          <Link href="/learn" className="inline-flex min-h-11 items-center justify-center bg-[#163d34] px-5 py-3 text-sm font-semibold text-white hover:bg-[#214d47]">
            Back to tracks
          </Link>
        </header>

        <section className="grid gap-5 md:grid-cols-4">
          {milestones.map((label, index) => (
            <div key={label} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#547067]">Stage {index + 1}</p>
              <h2 className="mt-3 text-xl font-semibold">{label}</h2>
              <p className="mt-2 text-sm text-black/60">This dashboard will show your learning resources, tasks, assignments, mentor feedback, and completed milestones.</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
