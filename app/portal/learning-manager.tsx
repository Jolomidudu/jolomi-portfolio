"use client";

import { useEffect, useState, type FormEvent } from "react";
import tracks from "../../backend/learning-tracks.json";

type LearningItem = {
  id: string;
  trackId: string;
  type: "resource" | "assignment";
  title: string;
  description: string;
  resourceUrl: string | null;
  dueDate: string | null;
  status: "draft" | "published";
  updatedAt: string;
};

type ItemForm = Omit<LearningItem, "id" | "updatedAt">;

type AssignmentSubmission = {
  id: string;
  itemId: string;
  accountId: string;
  assignmentTitle: string;
  trackId: string;
  learnerName: string;
  learnerEmail: string;
  response: string;
  resourceUrl: string | null;
  status: "submitted" | "reviewed" | "needs_revision";
  feedback: string | null;
  submittedAt: string;
};

type LearnerAssignment = {
  accountId: string;
  fullName: string;
  email: string;
  trackTitle: string;
  enrollmentStatus: string;
  tutorName: string | null;
  tutorEmail: string | null;
  tutorNotes: string;
  assignedAt: string | null;
};

const emptyForm: ItemForm = {
  trackId: tracks[0].id,
  type: "resource",
  title: "",
  description: "",
  resourceUrl: "",
  dueDate: "",
  status: "draft",
};

function asForm(item: LearningItem): ItemForm {
  return {
    trackId: item.trackId,
    type: item.type,
    title: item.title,
    description: item.description,
    resourceUrl: item.resourceUrl ?? "",
    dueDate: item.dueDate?.slice(0, 10) ?? "",
    status: item.status,
  };
}

function trackName(trackId: string) {
  return tracks.find((track) => track.id === trackId)?.title ?? "Unknown track";
}

export default function LearningManager() {
  const [items, setItems] = useState<LearningItem[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [learners, setLearners] = useState<LearnerAssignment[]>([]);
  const [form, setForm] = useState<ItemForm>(emptyForm);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<"content" | "submissions" | "tutors">("content");
  const [feedback, setFeedback] = useState("");
  const [reviewOutcome, setReviewOutcome] = useState<"reviewed" | "needs_revision">("reviewed");
  const [selectedLearnerId, setSelectedLearnerId] = useState<string | null>(null);
  const [tutorName, setTutorName] = useState("");
  const [tutorEmail, setTutorEmail] = useState("");
  const [tutorNotes, setTutorNotes] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [isSavingTutor, setIsSavingTutor] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const [learnerError, setLearnerError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    async function loadItems() {
      try {
        const response = await fetch("/api/portal/learning-items", { cache: "no-store" });
        const result = await response.json() as { items?: LearningItem[]; error?: string };
        if (!active) return;
        if (!response.ok) throw new Error(result.error ?? "Unable to load learning content.");
        setItems(result.items ?? []);
      } catch (error) {
        if (active) setErrorMessage(error instanceof Error ? error.message : "Unable to load learning content.");
      } finally {
        if (active) setIsLoading(false);
      }

      try {
        const response = await fetch("/api/portal/learning-submissions", { cache: "no-store" });
        const result = await response.json() as { submissions?: AssignmentSubmission[]; error?: string };
        if (!active) return;
        if (!response.ok) throw new Error(result.error ?? "Unable to load assignment submissions.");
        const rows = result.submissions ?? [];
        setSubmissions(rows);
        setSelectedSubmissionId(rows[0]?.id ?? null);
        setFeedback(rows[0]?.feedback ?? "");
        setReviewOutcome(rows[0]?.status === "needs_revision" ? "needs_revision" : "reviewed");
      } catch (error) {
        if (active) setSubmissionError(error instanceof Error ? error.message : "Unable to load assignment submissions.");
      }

      try {
        const response = await fetch("/api/portal/learning-assignments", { cache: "no-store" });
        const result = await response.json() as { learners?: LearnerAssignment[]; error?: string };
        if (!active) return;
        if (!response.ok) throw new Error(result.error ?? "Unable to load learners.");
        const rows = result.learners ?? [];
        setLearners(rows);
        setSelectedLearnerId(rows[0]?.accountId ?? null);
        setTutorName(rows[0]?.tutorName ?? "");
        setTutorEmail(rows[0]?.tutorEmail ?? "");
        setTutorNotes(rows[0]?.tutorNotes ?? "");
      } catch (error) {
        if (active) setLearnerError(error instanceof Error ? error.message : "Unable to load learners.");
      }
    }
    void loadItems();
    return () => { active = false; };
  }, []);

  function startNewItem() {
    setForm(emptyForm);
    setSelectedId(null);
    setIsCreating(true);
    setErrorMessage("");
    setNotice("");
  }

  function selectItem(item: LearningItem) {
    setForm(asForm(item));
    setSelectedId(item.id);
    setIsCreating(false);
    setErrorMessage("");
    setNotice("");
  }

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setNotice("");

    try {
      const response = await fetch(isCreating ? "/api/portal/learning-items" : `/api/portal/learning-items/${selectedId}`, {
        method: isCreating ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json() as { item?: LearningItem; error?: string };
      if (!response.ok || !result.item) throw new Error(result.error ?? "Unable to save this item.");
      setItems((current) => [result.item!, ...current.filter(({ id }) => id !== result.item!.id)]);
      setSelectedId(result.item.id);
      setForm(asForm(result.item));
      setIsCreating(false);
      setNotice("Learning content saved.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save this item.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteItem() {
    if (!selectedId || !window.confirm("Delete this learning item? This cannot be undone.")) return;
    setErrorMessage("");
    setNotice("");
    try {
      const response = await fetch(`/api/portal/learning-items/${selectedId}`, { method: "DELETE" });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to delete this item.");
      setItems((current) => current.filter(({ id }) => id !== selectedId));
      setSelectedId(null);
      setForm(emptyForm);
      setIsCreating(false);
      setNotice("Learning content deleted.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete this item.");
    }
  }

  function selectSubmission(submission: AssignmentSubmission) {
    setSelectedSubmissionId(submission.id);
    setFeedback(submission.feedback ?? "");
    setReviewOutcome(submission.status === "needs_revision" ? "needs_revision" : "reviewed");
    setSubmissionError("");
  }

  async function saveReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSubmissionId) return;
    setIsSavingReview(true);
    setSubmissionError("");
    try {
      const response = await fetch(`/api/portal/learning-submissions/${selectedSubmissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback, status: reviewOutcome }),
      });
      const result = await response.json() as { submission?: Pick<AssignmentSubmission, "id" | "status" | "feedback">; error?: string };
      if (!response.ok || !result.submission) throw new Error(result.error ?? "Unable to save feedback.");
      setSubmissions((current) => current.map((submission) => submission.id === selectedSubmissionId
        ? { ...submission, status: result.submission!.status, feedback: result.submission!.feedback }
        : submission));
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "Unable to save feedback.");
    } finally {
      setIsSavingReview(false);
    }
  }

  function selectLearner(learner: LearnerAssignment) {
    setSelectedLearnerId(learner.accountId);
    setTutorName(learner.tutorName ?? "");
    setTutorEmail(learner.tutorEmail ?? "");
    setTutorNotes(learner.tutorNotes ?? "");
    setLearnerError("");
  }

  async function saveTutorAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedLearnerId) return;
    setIsSavingTutor(true);
    setLearnerError("");
    try {
      const response = await fetch(`/api/portal/learning-assignments/${selectedLearnerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorName, tutorEmail, notes: tutorNotes }),
      });
      const result = await response.json() as { assignment?: { tutorName: string; tutorEmail: string | null; tutorNotes: string; assignedAt: string }; error?: string };
      if (!response.ok || !result.assignment) throw new Error(result.error ?? "Unable to save the tutor assignment.");
      setLearners((current) => current.map((learner) => learner.accountId === selectedLearnerId
        ? { ...learner, ...result.assignment }
        : learner));
    } catch (error) {
      setLearnerError(error instanceof Error ? error.message : "Unable to save the tutor assignment.");
    } finally {
      setIsSavingTutor(false);
    }
  }

  const selectedItem = items.find(({ id }) => id === selectedId);
  const selectedSubmission = submissions.find(({ id }) => id === selectedSubmissionId);
  const selectedLearner = learners.find(({ accountId }) => accountId === selectedLearnerId);

  return (
    <div className="min-h-[calc(100vh-73px)]">
      <nav aria-label="Learning management" className="flex gap-1 border-b border-black/10 bg-white px-5 sm:px-8">
        <button type="button" onClick={() => setActivePanel("content")} aria-pressed={activePanel === "content"} className={`border-b-2 px-3 py-3 text-sm font-medium ${activePanel === "content" ? "border-[#00A9A5] text-[#007d79]" : "border-transparent text-black/50 hover:text-black"}`}>
          Course content
        </button>
        <button type="button" onClick={() => setActivePanel("submissions")} aria-pressed={activePanel === "submissions"} className={`border-b-2 px-3 py-3 text-sm font-medium ${activePanel === "submissions" ? "border-[#00A9A5] text-[#007d79]" : "border-transparent text-black/50 hover:text-black"}`}>
          Submissions <span className="ml-1 text-xs text-black/45">{submissions.filter(({ status }) => status === "submitted").length}</span>
        </button>
        <button type="button" onClick={() => setActivePanel("tutors")} aria-pressed={activePanel === "tutors"} className={`border-b-2 px-3 py-3 text-sm font-medium ${activePanel === "tutors" ? "border-[#00A9A5] text-[#007d79]" : "border-transparent text-black/50 hover:text-black"}`}>
          Tutors <span className="ml-1 text-xs text-black/45">{learners.length}</span>
        </button>
      </nav>

      {activePanel === "content" ? (
      <div className="grid min-h-[calc(100vh-125px)] lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.5fr)]">
      <section className="border-b border-black/10 bg-white lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 border-b border-black/10 p-4 sm:p-5">
          <div>
            <h2 className="font-semibold">Course content</h2>
            <p className="mt-1 text-xs text-black/45">{items.length} total items</p>
          </div>
          <button type="button" onClick={startNewItem} className="bg-[#111111] px-3 py-2 text-sm font-semibold text-white hover:bg-[#333333]">
            Add item
          </button>
        </div>
        {errorMessage && <p role="alert" className="m-4 text-sm text-red-700">{errorMessage}</p>}
        {isLoading ? <p className="p-5 text-sm text-black/50">Loading course content...</p> : items.length === 0 ? (
          <p className="p-5 text-sm text-black/50">No resources or assignments have been added.</p>
        ) : (
          <ul className="divide-y divide-black/10">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => selectItem(item)}
                  aria-current={selectedId === item.id ? "true" : undefined}
                  className={`w-full border-l-2 px-4 py-4 text-left transition-colors sm:px-5 ${selectedId === item.id ? "border-[#00A9A5] bg-[#00A9A5]/5" : "border-transparent hover:bg-black/[0.025]"}`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="truncate font-semibold">{item.title}</span>
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.1em] text-black/45">{item.status}</span>
                  </span>
                  <span className="mt-1 block text-sm text-black/55">{trackName(item.trackId)}</span>
                  <span className="mt-1 block text-xs capitalize text-black/40">{item.type}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-live="polite" className="p-5 sm:p-8">
        {isCreating || selectedItem ? (
          <form onSubmit={saveItem} className="mx-auto max-w-3xl space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/10 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#008e8a]">{isCreating ? "New course item" : "Edit course item"}</p>
                <h2 className="mt-2 text-2xl font-semibold">{isCreating ? "Add learning content" : form.title}</h2>
              </div>
              {!isCreating && <button type="button" onClick={deleteItem} className="border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50">Delete</button>}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Track
                <select required value={form.trackId} onChange={(event) => setForm({ ...form, trackId: event.target.value })} className="mt-2 w-full border border-black/15 bg-white px-3 py-3 outline-none focus:border-[#00A9A5]">
                  {tracks.map((track) => <option key={track.id} value={track.id}>{track.title}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Type
                <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as ItemForm["type"] })} className="mt-2 w-full border border-black/15 bg-white px-3 py-3 outline-none focus:border-[#00A9A5]">
                  <option value="resource">Resource</option>
                  <option value="assignment">Assignment</option>
                </select>
              </label>
            </div>

            <label className="block text-sm font-medium">
              Title
              <input required maxLength={180} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-[#00A9A5]" />
            </label>
            <label className="block text-sm font-medium">
              Instructions or description
              <textarea required maxLength={5000} rows={5} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-2 w-full resize-y border border-black/15 px-3 py-3 outline-none focus:border-[#00A9A5]" />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Resource link <span className="font-normal text-black/45">(optional)</span>
                <input type="url" value={form.resourceUrl ?? ""} onChange={(event) => setForm({ ...form, resourceUrl: event.target.value })} placeholder="https://..." className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-[#00A9A5]" />
              </label>
              {form.type === "assignment" && (
                <label className="block text-sm font-medium">
                  Due date <span className="font-normal text-black/45">(optional)</span>
                  <input type="date" value={form.dueDate ?? ""} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-[#00A9A5]" />
                </label>
              )}
            </div>
            <label className="block text-sm font-medium">
              Visibility
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ItemForm["status"] })} className="mt-2 w-full border border-black/15 bg-white px-3 py-3 outline-none focus:border-[#00A9A5] sm:max-w-xs">
                <option value="draft">Draft</option>
                <option value="published">Published to enrolled learners</option>
              </select>
            </label>
            {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
            {notice && <p role="status" className="text-sm text-[#007d79]">{notice}</p>}
            <button type="submit" disabled={isSaving} className="min-h-11 bg-[#111111] px-5 py-3 text-sm font-semibold text-white hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-50">
              {isSaving ? "Saving..." : isCreating ? "Create item" : "Save changes"}
            </button>
          </form>
        ) : (
          <div className="flex min-h-64 items-center justify-center text-center text-sm text-black/45">
            Select a course item or add a new resource or assignment.
          </div>
        )}
      </section>
      </div>
      ) : activePanel === "submissions" ? (
        <div className="grid min-h-[calc(100vh-125px)] lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.5fr)]">
          <section className="border-b border-black/10 bg-white lg:border-b-0 lg:border-r">
            <div className="border-b border-black/10 p-4 sm:p-5">
              <h2 className="font-semibold">Assignment submissions</h2>
              <p className="mt-1 text-xs text-black/45">{submissions.length} total</p>
            </div>
            {submissionError && <p role="alert" className="m-4 text-sm text-red-700">{submissionError}</p>}
            {submissions.length ? (
              <ul className="divide-y divide-black/10">
                {submissions.map((submission) => (
                  <li key={submission.id}>
                    <button type="button" onClick={() => selectSubmission(submission)} aria-current={selectedSubmissionId === submission.id ? "true" : undefined} className={`w-full border-l-2 px-4 py-4 text-left transition-colors sm:px-5 ${selectedSubmissionId === submission.id ? "border-[#00A9A5] bg-[#00A9A5]/5" : "border-transparent hover:bg-black/[0.025]"}`}>
                      <span className="flex items-start justify-between gap-3">
                        <span className="font-semibold">{submission.learnerName}</span>
                        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.1em] text-black/45">{submission.status.replaceAll("_", " ")}</span>
                      </span>
                      <span className="mt-1 block text-sm text-black/60">{submission.assignmentTitle}</span>
                      <span className="mt-1 block truncate text-xs text-black/45">{submission.learnerEmail} · {trackName(submission.trackId)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : !submissionError ? (
              <p className="p-5 text-sm text-black/50">No assignment submissions yet.</p>
            ) : null}
          </section>

          <section aria-live="polite" className="p-5 sm:p-8">
            {selectedSubmission ? (
              <article className="mx-auto max-w-3xl">
                <div className="border-b border-black/10 pb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#008e8a]">{trackName(selectedSubmission.trackId)}</p>
                  <h2 className="mt-2 text-2xl font-semibold">{selectedSubmission.assignmentTitle}</h2>
                  <p className="mt-2 text-sm text-black/55">{selectedSubmission.learnerName} · {selectedSubmission.learnerEmail}</p>
                  <time className="mt-1 block text-xs text-black/45" dateTime={selectedSubmission.submittedAt}>{new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(selectedSubmission.submittedAt))}</time>
                </div>
                <div className="space-y-4 py-6">
                  {selectedSubmission.response && <p className="whitespace-pre-wrap text-sm leading-6">{selectedSubmission.response}</p>}
                  {selectedSubmission.resourceUrl && <a href={selectedSubmission.resourceUrl} target="_blank" rel="noreferrer" className="inline-flex text-sm font-semibold text-[#007d79] underline underline-offset-4">Open submitted work</a>}
                </div>
                <form onSubmit={saveReview} className="space-y-4 border-t border-black/10 pt-6">
                  <label className="block text-sm font-medium">
                    Tutor feedback
                    <textarea required maxLength={5000} rows={5} value={feedback} onChange={(event) => setFeedback(event.target.value)} className="mt-2 w-full resize-y border border-black/15 bg-white px-3 py-3 outline-none focus:border-[#00A9A5]" placeholder="Give specific, constructive feedback." />
                  </label>
                  <label className="block text-sm font-medium">
                    Review outcome
                    <select value={reviewOutcome} onChange={(event) => setReviewOutcome(event.target.value as typeof reviewOutcome)} className="mt-2 w-full border border-black/15 bg-white px-3 py-3 outline-none focus:border-[#00A9A5] sm:max-w-xs">
                      <option value="reviewed">Reviewed</option>
                      <option value="needs_revision">Needs revision</option>
                    </select>
                  </label>
                  {submissionError && <p role="alert" className="text-sm text-red-700">{submissionError}</p>}
                  <button type="submit" disabled={isSavingReview} className="min-h-11 bg-[#111111] px-5 py-3 text-sm font-semibold text-white hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-50">
                    {isSavingReview ? "Saving..." : "Save review"}
                  </button>
                </form>
              </article>
            ) : (
              <div className="flex min-h-64 items-center justify-center text-center text-sm text-black/45">Select a submission to review.</div>
            )}
          </section>
        </div>
      ) : (
        <div className="grid min-h-[calc(100vh-125px)] lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.5fr)]">
          <section className="border-b border-black/10 bg-white lg:border-b-0 lg:border-r">
            <div className="border-b border-black/10 p-4 sm:p-5">
              <h2 className="font-semibold">Active learners</h2>
              <p className="mt-1 text-xs text-black/45">{learners.length} accounts</p>
            </div>
            {learnerError && <p role="alert" className="m-4 text-sm text-red-700">{learnerError}</p>}
            {learners.length ? (
              <ul className="divide-y divide-black/10">
                {learners.map((learner) => (
                  <li key={learner.accountId}>
                    <button type="button" onClick={() => selectLearner(learner)} aria-current={selectedLearnerId === learner.accountId ? "true" : undefined} className={`w-full border-l-2 px-4 py-4 text-left transition-colors sm:px-5 ${selectedLearnerId === learner.accountId ? "border-[#00A9A5] bg-[#00A9A5]/5" : "border-transparent hover:bg-black/[0.025]"}`}>
                      <span className="flex items-center justify-between gap-3">
                        <span className="truncate font-semibold">{learner.fullName}</span>
                        <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-[0.1em] ${learner.tutorName ? "text-[#007d79]" : "text-black/40"}`}>{learner.tutorName ? "Assigned" : "Unassigned"}</span>
                      </span>
                      <span className="mt-1 block truncate text-xs text-black/45">{learner.email}</span>
                      <span className="mt-1 block text-sm text-black/55">{learner.trackTitle}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : !learnerError ? (
              <p className="p-5 text-sm text-black/50">No active learner accounts yet.</p>
            ) : null}
          </section>
          <section aria-live="polite" className="p-5 sm:p-8">
            {selectedLearner ? (
              <form onSubmit={saveTutorAssignment} className="mx-auto max-w-3xl space-y-5">
                <div className="border-b border-black/10 pb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#008e8a]">{selectedLearner.trackTitle}</p>
                  <h2 className="mt-2 text-2xl font-semibold">{selectedLearner.fullName}</h2>
                  <p className="mt-1 text-sm text-black/55">{selectedLearner.email}</p>
                </div>
                <label className="block text-sm font-medium">
                  Tutor name
                  <input required maxLength={160} value={tutorName} onChange={(event) => setTutorName(event.target.value)} className="mt-2 w-full border border-black/15 bg-white px-3 py-3 outline-none focus:border-[#00A9A5]" />
                </label>
                <label className="block text-sm font-medium">
                  Tutor email <span className="font-normal text-black/45">(optional)</span>
                  <input type="email" maxLength={254} value={tutorEmail} onChange={(event) => setTutorEmail(event.target.value)} className="mt-2 w-full border border-black/15 bg-white px-3 py-3 outline-none focus:border-[#00A9A5]" />
                </label>
                <label className="block text-sm font-medium">
                  Private coordination notes
                  <textarea maxLength={2000} rows={4} value={tutorNotes} onChange={(event) => setTutorNotes(event.target.value)} className="mt-2 w-full resize-y border border-black/15 bg-white px-3 py-3 outline-none focus:border-[#00A9A5]" />
                </label>
                {learnerError && <p role="alert" className="text-sm text-red-700">{learnerError}</p>}
                <button type="submit" disabled={isSavingTutor} className="min-h-11 bg-[#111111] px-5 py-3 text-sm font-semibold text-white hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-50">
                  {isSavingTutor ? "Saving..." : "Save tutor assignment"}
                </button>
              </form>
            ) : (
              <div className="flex min-h-64 items-center justify-center text-center text-sm text-black/45">Select a learner to assign a tutor.</div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}