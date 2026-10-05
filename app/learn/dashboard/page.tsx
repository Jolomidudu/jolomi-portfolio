"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

type Learner = {
  fullName?: string;
  email?: string;
  tutor?: { name?: string; email?: string | null } | null;
  enrollment?: {
    trackTitle?: string;
    status?: string;
    paymentPlan?: string;
    experienceLevel?: string;
    learningFormat?: string;
    preferredDays?: string[];
    preferredTime?: string;
    preferredStart?: string;
    timeZone?: string;
    goals?: string;
  };
};

type ProgressEntry = {
  id: string | number;
  topic: string;
  reflection: string;
  createdAt: string;
};

type CourseItem = {
  id: string | number;
  trackId: string;
  type: "resource" | "assignment";
  title: string;
  description: string;
  resourceUrl: string | null;
  dueDate: string | null;
  submission: {
    id: string | number;
    response: string;
    resourceUrl: string | null;
    status: "submitted" | "reviewed" | "needs_revision";
    feedback: string | null;
    submittedAt: string;
  } | null;
};

function formatLabel(value?: string) {
  if (!value) return "Not provided";
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDueDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeZone: "UTC" })
    .format(new Date(`${value.slice(0, 10)}T00:00:00Z`));
}

export default function LearningDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<Learner | null>(null);
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [courseItems, setCourseItems] = useState<CourseItem[]>([]);
  const [topic, setTopic] = useState("");
  const [reflection, setReflection] = useState("");
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | number | null>(null);
  const [assignmentResponse, setAssignmentResponse] = useState("");
  const [assignmentUrl, setAssignmentUrl] = useState("");
  const [assignmentError, setAssignmentError] = useState("");
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);
  const [progressError, setProgressError] = useState("");
  const [courseItemsError, setCourseItemsError] = useState("");
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch("/api/learning/session", { cache: "no-store" });
        if (response.status === 401) {
          router.push("/learn/login");
          return;
        }

        const result = await response.json() as { user?: Learner; error?: string };
        if (!response.ok || !result.user) {
          throw new Error(result.error ?? "Unable to load your learning session.");
        }

        setUser(result.user);
        try {
          const progressResponse = await fetch("/api/learning/progress", { cache: "no-store" });
          const progressResult = await progressResponse.json() as { entries?: ProgressEntry[]; error?: string };
          if (!progressResponse.ok) throw new Error(progressResult.error ?? "Unable to load your learning log.");
          setEntries(progressResult.entries ?? []);
        } catch (error) {
          setProgressError(error instanceof Error ? error.message : "Unable to load your learning log.");
        }
        try {
          const itemsResponse = await fetch("/api/learning/items", { cache: "no-store" });
          const itemsResult = await itemsResponse.json() as { items?: CourseItem[]; error?: string };
          if (!itemsResponse.ok) throw new Error(itemsResult.error ?? "Unable to load your course materials.");
          setCourseItems(itemsResult.items ?? []);
        } catch (error) {
          setCourseItemsError(error instanceof Error ? error.message : "Unable to load your course materials.");
        }
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

  async function saveProgress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingProgress(true);
    setProgressError("");

    try {
      const response = await fetch("/api/learning/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, reflection }),
      });
      const result = await response.json() as { entry?: ProgressEntry; error?: string };
      if (!response.ok || !result.entry) throw new Error(result.error ?? "Unable to save this learning log entry.");
      setEntries((currentEntries) => [result.entry!, ...currentEntries].slice(0, 100));
      setTopic("");
      setReflection("");
    } catch (error) {
      setProgressError(error instanceof Error ? error.message : "Unable to save this learning log entry.");
    } finally {
      setIsSavingProgress(false);
    }
  }

  function editAssignment(item: CourseItem) {
    setActiveAssignmentId(item.id);
    setAssignmentResponse(item.submission?.response ?? "");
    setAssignmentUrl(item.submission?.resourceUrl ?? "");
    setAssignmentError("");
  }

  async function submitAssignment(event: FormEvent<HTMLFormElement>, itemId: string | number) {
    event.preventDefault();
    setIsSubmittingAssignment(true);
    setAssignmentError("");
    try {
      const response = await fetch("/api/learning/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, submission: assignmentResponse, resourceUrl: assignmentUrl }),
      });
      const result = await response.json() as { submission?: NonNullable<CourseItem["submission"]>; error?: string };
      if (!response.ok || !result.submission) throw new Error(result.error ?? "Unable to submit this assignment.");
      setCourseItems((currentItems) => currentItems.map((item) => item.id === itemId
        ? { ...item, submission: result.submission! }
        : item));
    } catch (error) {
      setAssignmentError(error instanceof Error ? error.message : "Unable to submit this assignment.");
    } finally {
      setIsSubmittingAssignment(false);
    }
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
          <div className="border border-black/10 bg-white p-6 text-sm text-black/55">Loading your learning workspace...</div>
        ) : user?.enrollment ? (
          <div className="space-y-6">
            <section className="border border-black/10 bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#547067]">My program</p>
                  <h2 className="mt-2 text-3xl font-semibold">{user.enrollment.trackTitle ?? "Learning program"}</h2>
                </div>
                <span className="w-fit border border-[#163d34]/15 bg-[#163d34]/5 px-3 py-2 text-sm font-semibold text-[#163d34]">
                  {formatLabel(user.enrollment.status)}
                </span>
              </div>

              <dl className="mt-8 grid gap-x-8 gap-y-6 border-t border-black/10 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-black/45">Experience level</dt>
                  <dd className="mt-2 text-sm font-medium">{formatLabel(user.enrollment.experienceLevel)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-black/45">Learning format</dt>
                  <dd className="mt-2 text-sm font-medium">{formatLabel(user.enrollment.learningFormat)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-black/45">Payment plan</dt>
                  <dd className="mt-2 text-sm font-medium">{formatLabel(user.enrollment.paymentPlan)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-black/45">Preferred start</dt>
                  <dd className="mt-2 text-sm font-medium">{user.enrollment.preferredStart || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-black/45">Preferred days</dt>
                  <dd className="mt-2 text-sm font-medium">{user.enrollment.preferredDays?.join(", ") || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-black/45">Preferred time</dt>
                  <dd className="mt-2 text-sm font-medium">
                    {[user.enrollment.preferredTime, user.enrollment.timeZone].filter(Boolean).join(" · ") || "Not provided"}
                  </dd>
                </div>
              </dl>
            </section>

            {user.tutor && (
              <section className="border border-black/10 bg-white p-6 sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#547067]">Your tutor</p>
                <h2 className="mt-2 text-xl font-semibold">{user.tutor.name}</h2>
                {user.tutor.email && (
                  <a href={`mailto:${user.tutor.email}`} className="mt-2 inline-flex text-sm font-semibold text-[#007d79] underline decoration-[#007d79]/30 underline-offset-4 hover:decoration-[#007d79]">
                    {user.tutor.email}
                  </a>
                )}
              </section>
            )}

            {user.enrollment.goals && (
              <section className="border border-black/10 bg-white p-6 sm:p-8">
                <h2 className="text-lg font-semibold">Your learning goals</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-black/65">{user.enrollment.goals}</p>
              </section>
            )}

            <section className="border border-black/10 bg-white p-6 sm:p-8">
              <div className="border-b border-black/10 pb-5">
                <h2 className="text-xl font-semibold">Course materials and assignments</h2>
                <p className="mt-2 text-sm leading-6 text-black/55">Published items for {user.enrollment.trackTitle ?? "your track"}.</p>
              </div>
              {courseItemsError && <p role="alert" className="mt-5 text-sm text-red-700">{courseItemsError}</p>}
              {courseItems.length ? (
                <ul className="divide-y divide-black/10">
                  {courseItems.map((item) => (
                    <li key={item.id} className="py-5 first:pb-5">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#007d79]">{item.type}</span>
                        {item.dueDate && <span className="text-xs text-black/45">Due {formatDueDate(item.dueDate)}</span>}
                      </div>
                      <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-black/65">{item.description}</p>
                      {item.resourceUrl && (
                        <a href={item.resourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-semibold text-[#007d79] underline decoration-[#007d79]/30 underline-offset-4 hover:decoration-[#007d79]">
                          Open resource
                        </a>
                      )}
                      {item.type === "assignment" && (
                        <div className="mt-5 border-t border-black/10 pt-4">
                          {item.submission ? (
                            <div className="mb-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#547067]">
                                {formatLabel(item.submission.status)}
                              </p>
                              {item.submission.response && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-black/65">{item.submission.response}</p>}
                              {item.submission.resourceUrl && (
                                <a href={item.submission.resourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-sm font-semibold text-[#007d79] underline underline-offset-4">Open submitted work</a>
                              )}
                              {item.submission.feedback && (
                                <div className="mt-3 border-l-2 border-[#008c87] bg-[#f5f5f0] px-4 py-3">
                                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#547067]">Tutor feedback</p>
                                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-black/70">{item.submission.feedback}</p>
                                </div>
                              )}
                            </div>
                          ) : <p className="mb-3 text-sm text-black/55">No work submitted yet.</p>}
                          {activeAssignmentId === item.id ? (
                            <form onSubmit={(event) => submitAssignment(event, item.id)} className="grid gap-3">
                              <label className="block text-sm font-medium">
                                Your response
                                <textarea
                                  rows={3}
                                  maxLength={10000}
                                  required={!assignmentUrl.trim()}
                                  value={assignmentResponse}
                                  onChange={(event) => setAssignmentResponse(event.target.value)}
                                  className="mt-2 w-full resize-y border border-black/15 bg-[#f7f7f2] px-3 py-3 outline-none focus:border-[#008c87]"
                                  placeholder="Write your answer or reflection"
                                />
                              </label>
                              <label className="block text-sm font-medium">
                                Link to your work <span className="font-normal text-black/45">(optional)</span>
                                <input
                                  type="url"
                                  required={!assignmentResponse.trim()}
                                  value={assignmentUrl}
                                  onChange={(event) => setAssignmentUrl(event.target.value)}
                                  className="mt-2 w-full border border-black/15 bg-[#f7f7f2] px-3 py-3 outline-none focus:border-[#008c87]"
                                  placeholder="https://..."
                                />
                              </label>
                              {assignmentError && <p role="alert" className="text-sm text-red-700">{assignmentError}</p>}
                              <div className="flex flex-wrap gap-3">
                                <button type="submit" disabled={isSubmittingAssignment} className="min-h-10 bg-[#163d34] px-4 py-2 text-sm font-semibold text-white hover:bg-[#214d47] disabled:cursor-not-allowed disabled:opacity-60">
                                  {isSubmittingAssignment ? "Submitting..." : item.submission ? "Resubmit work" : "Submit work"}
                                </button>
                                <button type="button" onClick={() => setActiveAssignmentId(null)} className="min-h-10 border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5">
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <button type="button" onClick={() => editAssignment(item)} className="min-h-10 border border-[#163d34]/25 px-4 py-2 text-sm font-semibold text-[#163d34] hover:bg-[#163d34]/5">
                              {item.submission ? "Edit submission" : "Submit assignment"}
                            </button>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : !courseItemsError ? (
                <p className="py-5 text-sm text-black/55">No course materials or assignments have been published for this track yet.</p>
              ) : null}
            </section>

            <section className="border border-black/10 bg-white p-6 sm:p-8">
              <div className="mb-6 border-b border-black/10 pb-5">
                <h2 className="text-xl font-semibold">Learning log</h2>
                <p className="mt-2 text-sm leading-6 text-black/55">Record what you studied and what you learned. Entries are saved to your account.</p>
              </div>

              <form onSubmit={saveProgress} className="grid gap-4">
                <label className="block text-sm font-medium">
                  Topic or lesson
                  <input
                    required
                    maxLength={120}
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                    className="mt-2 w-full border border-black/15 bg-[#f7f7f2] px-4 py-3 outline-none focus:border-[#008c87]"
                    placeholder="For example, responsive layouts"
                  />
                </label>
                <label className="block text-sm font-medium">
                  What did you learn?
                  <textarea
                    required
                    maxLength={1200}
                    rows={3}
                    value={reflection}
                    onChange={(event) => setReflection(event.target.value)}
                    className="mt-2 w-full resize-y border border-black/15 bg-[#f7f7f2] px-4 py-3 outline-none focus:border-[#008c87]"
                    placeholder="Capture the key idea, exercise, or question you worked through."
                  />
                </label>
                {progressError && <p role="alert" className="text-sm text-red-700">{progressError}</p>}
                <button
                  type="submit"
                  disabled={isSavingProgress}
                  className="min-h-11 w-fit bg-[#163d34] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#214d47] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingProgress ? "Saving..." : "Add to learning log"}
                </button>
              </form>

              <div className="mt-8 border-t border-black/10 pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-black/45">Your entries</h3>
                {entries.length ? (
                  <ol className="mt-4 divide-y divide-black/10">
                    {entries.map((entry) => (
                      <li key={entry.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                          <h4 className="font-semibold">{entry.topic}</h4>
                          <time className="text-xs text-black/45" dateTime={entry.createdAt}>
                            {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(entry.createdAt))}
                          </time>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-black/65">{entry.reflection}</p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-3 text-sm text-black/55">No learning notes yet.</p>
                )}
              </div>
            </section>

            <p className="border-l-2 border-[#008c87] px-4 py-2 text-sm leading-6 text-black/55">
              Lesson completion and course progress tracking are not available in the portal yet.
            </p>
          </div>
        ) : (
          <section className="border border-black/10 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Enrollment details unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-black/60">Your account is signed in, but we could not find its linked program. Please contact us so we can review your enrollment.</p>
          </section>
        )}
      </div>
    </main>
  );
}
