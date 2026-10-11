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

type EnrollmentPayment = {
  reference: string;
  amount: number | string;
  paymentPlan: string;
  status: "pending" | "succeeded" | "failed";
  createdAt: string;
  paidAt: string | null;
};

type EnrollmentRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  trackId: string;
  trackTitle: string;
  paymentPlan: string;
  status: "pending_payment" | "awaiting_balance" | "enrolled";
  preferredStart: string;
  registeredAt: string;
  accountStatus: string | null;
  payments: EnrollmentPayment[];
  totalAmount: number | null;
  paidAmount: number;
  balanceDue: number | null;
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

function formatNaira(amount: number | null) {
  if (amount === null) return "Unknown";
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function LearningManager() {
  const [items, setItems] = useState<LearningItem[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [learners, setLearners] = useState<LearnerAssignment[]>([]);
  const [registrations, setRegistrations] = useState<EnrollmentRecord[]>([]);
  const [form, setForm] = useState<ItemForm>(emptyForm);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<"content" | "submissions" | "tutors" | "enrollments">("content");
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
  const [registrationError, setRegistrationError] = useState("");
  const [registrationNotice, setRegistrationNotice] = useState("");
  const [registrationSearch, setRegistrationSearch] = useState("");
  const [registrationFilter, setRegistrationFilter] = useState("all");
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true);
  const [selectedRegistrationIds, setSelectedRegistrationIds] = useState<string[]>([]);
  const [isDeletingRegistrations, setIsDeletingRegistrations] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
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

      try {
        const response = await fetch("/api/portal/learning-enrollments", { cache: "no-store" });
        const result = await response.json() as { registrations?: EnrollmentRecord[]; error?: string };
        if (!active) return;
        if (!response.ok) throw new Error(result.error ?? "Unable to load registrations and payments.");
        setRegistrations(result.registrations ?? []);
      } catch (error) {
        if (active) setRegistrationError(error instanceof Error ? error.message : "Unable to load registrations and payments.");
      } finally {
        if (active) setIsLoadingRegistrations(false);
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

  async function deleteSelectedRegistrations() {
    if (deleteConfirmationText !== "DELETE" || selectedRegistrationIds.length === 0 || isDeletingRegistrations) return;
    setIsDeletingRegistrations(true);
    setRegistrationError("");
    setRegistrationNotice("");
    try {
      const response = await fetch("/api/portal/learning-enrollments/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedRegistrationIds }),
      });
      const result = await response.json() as { deletedIds?: string[]; error?: string };
      if (!response.ok || !result.deletedIds) throw new Error(result.error ?? "Unable to delete the selected registrations.");
      const deletedIds = new Set(result.deletedIds);
      setRegistrations((current) => current.filter(({ id }) => !deletedIds.has(id)));
      setSelectedRegistrationIds([]);
      setRegistrationNotice(`${deletedIds.size} unpaid registration${deletedIds.size === 1 ? "" : "s"} and its payment attempts deleted.`);
      setIsDeleteConfirmationOpen(false);
      setDeleteConfirmationText("");
    } catch (error) {
      setRegistrationError(error instanceof Error ? error.message : "Unable to delete the selected registrations.");
    } finally {
      setIsDeletingRegistrations(false);
    }
  }

  const selectedItem = items.find(({ id }) => id === selectedId);
  const selectedSubmission = submissions.find(({ id }) => id === selectedSubmissionId);
  const selectedLearner = learners.find(({ accountId }) => accountId === selectedLearnerId);
  const normalizedRegistrationSearch = registrationSearch.trim().toLowerCase();
  const filteredRegistrations = registrations.filter((registration) => {
    const matchesSearch = `${registration.fullName} ${registration.email} ${registration.phone} ${registration.trackTitle} ${registration.payments.map(({ reference }) => reference).join(" ")}`
      .toLowerCase()
      .includes(normalizedRegistrationSearch);
    return matchesSearch && (registrationFilter === "all" || registration.status === registrationFilter);
  });
  const canDeleteRegistration = (registration: EnrollmentRecord) => registration.status === "pending_payment"
    && registration.accountStatus === null
    && !registration.payments.some(({ status }) => status === "succeeded")
    && !registration.payments.some((payment) => {
      if (payment.status !== "pending") return false;
      const createdAt = new Date(payment.createdAt).getTime();
      return !Number.isFinite(createdAt) || Date.now() - createdAt < 24 * 60 * 60 * 1000;
    });
  const deletableFilteredIds = filteredRegistrations.filter(canDeleteRegistration).map(({ id }) => id);
  const selectedDeletableIds = selectedRegistrationIds.filter((id) => {
    const registration = registrations.find(({ id: registrationId }) => registrationId === id);
    return registration ? canDeleteRegistration(registration) : false;
  });
  const selectedDeletableRegistrations = registrations.filter(({ id }) => selectedDeletableIds.includes(id));

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
        <button type="button" onClick={() => setActivePanel("enrollments")} aria-pressed={activePanel === "enrollments"} className={`border-b-2 px-3 py-3 text-sm font-medium ${activePanel === "enrollments" ? "border-[#00A9A5] text-[#007d79]" : "border-transparent text-black/50 hover:text-black"}`}>
          Enrollments <span className="ml-1 text-xs text-black/45">{registrations.length}</span>
        </button>
      </nav>

      {activePanel === "enrollments" ? (
        <section className="p-5 sm:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#008e8a]">Enrollment overview</p>
                <h2 className="mt-2 text-2xl font-semibold">Registrations and payments</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {selectedDeletableIds.length > 0 && (
                  <button type="button" onClick={() => { setDeleteConfirmationText(""); setIsDeleteConfirmationOpen(true); }} className="min-h-10 border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50">
                    Delete selected ({selectedDeletableIds.length})
                  </button>
                )}
                <button type="button" onClick={() => { setIsLoadingRegistrations(true); setRegistrationError(""); void fetch("/api/portal/learning-enrollments", { cache: "no-store" }).then(async (response) => { const result = await response.json() as { registrations?: EnrollmentRecord[]; error?: string }; if (!response.ok) throw new Error(result.error ?? "Unable to refresh registrations."); setRegistrations(result.registrations ?? []); setSelectedRegistrationIds([]); }).catch((error) => setRegistrationError(error instanceof Error ? error.message : "Unable to refresh registrations.")).finally(() => setIsLoadingRegistrations(false)); }} className="min-h-10 border border-black/15 px-3 py-2 text-sm font-medium transition-colors hover:bg-black/5">
                  Refresh
                </button>
              </div>
            </div>

            <dl className="grid gap-4 border-b border-black/10 py-5 sm:grid-cols-2 lg:grid-cols-4">
              <div><dt className="text-xs font-semibold uppercase tracking-[0.1em] text-black/45">All registrations</dt><dd className="mt-1 text-2xl font-semibold">{registrations.length}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-[0.1em] text-black/45">Awaiting payment</dt><dd className="mt-1 text-2xl font-semibold">{registrations.filter(({ status }) => status === "pending_payment").length}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-[0.1em] text-black/45">Deposit / balance due</dt><dd className="mt-1 text-2xl font-semibold">{registrations.filter(({ status }) => status === "awaiting_balance").length}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-[0.1em] text-black/45">Enrolled</dt><dd className="mt-1 text-2xl font-semibold">{registrations.filter(({ status }) => status === "enrolled").length}</dd></div>
            </dl>

            <div className="flex flex-col gap-3 border-b border-black/10 py-4 sm:flex-row">
              <label className="flex-1 text-sm font-medium">
                Search registrations
                <input type="search" value={registrationSearch} onChange={(event) => setRegistrationSearch(event.target.value)} placeholder="Name, email, phone, program, payment reference" className="mt-1 w-full border border-black/15 bg-white px-3 py-2.5 outline-none focus:border-[#00A9A5]" />
              </label>
              <label className="text-sm font-medium sm:w-56">
                Enrollment status
                <select value={registrationFilter} onChange={(event) => setRegistrationFilter(event.target.value)} className="mt-1 w-full border border-black/15 bg-white px-3 py-2.5 outline-none focus:border-[#00A9A5]">
                  <option value="all">All statuses</option>
                  <option value="pending_payment">Awaiting payment</option>
                  <option value="awaiting_balance">Deposit paid / balance due</option>
                  <option value="enrolled">Enrolled</option>
                </select>
              </label>
            </div>

            {deletableFilteredIds.length > 0 && (
              <label className="flex w-fit items-center gap-2 py-3 text-sm font-medium text-black/60">
                <input
                  type="checkbox"
                  checked={deletableFilteredIds.every((id) => selectedRegistrationIds.includes(id))}
                  onChange={(event) => setSelectedRegistrationIds((current) => event.target.checked
                    ? [...new Set([...current, ...deletableFilteredIds])]
                    : current.filter((id) => !deletableFilteredIds.includes(id)))}
                  className="h-4 w-4 accent-[#a12626]"
                />
                Select all eligible in this view ({deletableFilteredIds.length})
              </label>
            )}

            {registrationError && <p role="alert" className="mt-4 text-sm text-red-700">{registrationError}</p>}
            {registrationNotice && <p role="status" className="mt-4 text-sm text-[#007d79]">{registrationNotice}</p>}
            {isLoadingRegistrations ? <p className="py-8 text-sm text-black/50">Loading registrations...</p> : filteredRegistrations.length ? (
              <ul className="divide-y divide-black/10">
                {filteredRegistrations.map((registration) => (
                  <li key={registration.id} className="py-6">
                    <article className="grid gap-5 xl:grid-cols-[minmax(220px,1.1fr)_minmax(180px,0.9fr)_minmax(200px,0.9fr)_minmax(250px,1.2fr)]">
                      <div>
                        {canDeleteRegistration(registration) && (
                          <label className="mb-3 flex w-fit items-center gap-2 text-xs font-medium text-black/55">
                            <input
                              type="checkbox"
                              checked={selectedRegistrationIds.includes(registration.id)}
                              onChange={(event) => setSelectedRegistrationIds((current) => event.target.checked
                                ? [...new Set([...current, registration.id])]
                                : current.filter((id) => id !== registration.id))}
                              className="h-4 w-4 accent-[#a12626]"
                            />
                            Select unpaid registration
                          </label>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{registration.fullName}</h3>
                          <span className="border border-black/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]">{formatStatus(registration.status)}</span>
                        </div>
                        <a href={`mailto:${registration.email}`} className="mt-2 block break-all text-sm text-[#007d79] underline underline-offset-2">{registration.email}</a>
                        <a href={`tel:${registration.phone}`} className="mt-1 block text-sm text-black/60">{registration.phone}</a>
                        <p className="mt-2 text-xs text-black/45">Registered {new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(registration.registeredAt))}</p>
                      </div>

                      <dl className="space-y-3 text-sm">
                        <div><dt className="text-xs font-semibold uppercase tracking-[0.08em] text-black/45">Program</dt><dd className="mt-1">{registration.trackTitle}</dd></div>
                        <div><dt className="text-xs font-semibold uppercase tracking-[0.08em] text-black/45">Payment option</dt><dd className="mt-1">{formatStatus(registration.paymentPlan)}</dd></div>
                        <div><dt className="text-xs font-semibold uppercase tracking-[0.08em] text-black/45">Preferred start</dt><dd className="mt-1">{registration.preferredStart || "Not provided"}</dd></div>
                      </dl>

                      <dl className="space-y-3 text-sm">
                        <div><dt className="text-xs font-semibold uppercase tracking-[0.08em] text-black/45">Program fee</dt><dd className="mt-1">{formatNaira(registration.totalAmount)}</dd></div>
                        <div><dt className="text-xs font-semibold uppercase tracking-[0.08em] text-black/45">Paid</dt><dd className="mt-1 font-semibold">{formatNaira(registration.paidAmount)}</dd></div>
                        <div><dt className="text-xs font-semibold uppercase tracking-[0.08em] text-black/45">Balance due</dt><dd className="mt-1">{formatNaira(registration.balanceDue)}</dd></div>
                        <div><dt className="text-xs font-semibold uppercase tracking-[0.08em] text-black/45">Learner account</dt><dd className="mt-1">{registration.accountStatus === "active" ? registration.status === "enrolled" ? "Active access" : "Created; access paused" : "Not created"}</dd></div>
                      </dl>

                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-black/45">Payment attempts ({registration.payments.length})</h4>
                        {registration.payments.length ? (
                          <ul className="mt-2 space-y-3">
                            {registration.payments.map((payment) => (
                              <li key={payment.reference} className="border-l-2 border-[#00A9A5]/40 pl-3 text-sm">
                                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                                  <span className="font-medium">{formatNaira(Number(payment.amount))}</span>
                                  <span className="text-xs font-semibold uppercase text-black/55">{formatStatus(payment.status)} · {formatStatus(payment.paymentPlan)}</span>
                                </div>
                                <p className="mt-1 break-all font-mono text-[11px] text-black/45">{payment.reference}</p>
                                <p className="mt-1 text-xs text-black/45">{payment.paidAt ? `Paid ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(payment.paidAt))}` : `Started ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(payment.createdAt))}`}</p>
                              </li>
                            ))}
                          </ul>
                        ) : <p className="mt-2 text-sm text-black/50">No payment attempt yet.</p>}
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            ) : !registrationError ? (
              <p className="py-8 text-sm text-black/50">{registrations.length ? "No registrations match these filters." : "No registrations yet."}</p>
            ) : null}

            {isDeleteConfirmationOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-5" role="presentation">
                <section role="dialog" aria-modal="true" aria-labelledby="delete-registration-title" className="w-full max-w-lg border border-black/10 bg-white p-6 shadow-2xl sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red-700">Permanent deletion</p>
                  <h3 id="delete-registration-title" className="mt-2 text-2xl font-semibold">Delete {selectedDeletableIds.length} selected registration{selectedDeletableIds.length === 1 ? "" : "s"}?</h3>
                  <p className="mt-3 text-sm leading-6 text-black/65">This removes the registration and its payment attempts from Railway. Only unpaid registrations without learner accounts and without a pending checkout from the last 24 hours can be deleted. Paid or enrolled learners, including Local Tester, are protected.</p>
                  <ul className="mt-4 max-h-36 divide-y divide-black/10 overflow-y-auto border-y border-black/10 text-sm">
                    {selectedDeletableRegistrations.map((registration) => (
                      <li key={registration.id} className="py-2">
                        <span className="block font-semibold">{registration.fullName}</span>
                        <span className="block break-all text-xs text-black/55">{registration.email}</span>
                      </li>
                    ))}
                  </ul>
                  <label className="mt-5 block text-sm font-medium">
                    Type DELETE to confirm
                    <input autoComplete="off" value={deleteConfirmationText} onChange={(event) => setDeleteConfirmationText(event.target.value)} className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-red-600" />
                  </label>
                  <div className="mt-6 flex flex-wrap justify-end gap-3">
                    <button type="button" disabled={isDeletingRegistrations} onClick={() => setIsDeleteConfirmationOpen(false)} className="min-h-10 border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-black/5 disabled:opacity-50">Cancel</button>
                    <button type="button" disabled={deleteConfirmationText !== "DELETE" || selectedDeletableIds.length === 0 || isDeletingRegistrations} onClick={() => void deleteSelectedRegistrations()} className="min-h-10 bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50">
                      {isDeletingRegistrations ? "Deleting..." : "Delete registrations"}
                    </button>
                  </div>
                </section>
              </div>
            )}
          </div>
        </section>
      ) : activePanel === "content" ? (
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