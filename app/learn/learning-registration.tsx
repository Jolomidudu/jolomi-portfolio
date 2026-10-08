"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import tracks from "../../backend/learning-tracks.json";
import { formatCurrencyAmount, useCurrency } from "../currency-provider";

type PaymentPlan = "deposit" | "full";
type RegistrationForm = {
  trackId: string;
  paymentPlan: PaymentPlan;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  timeZone: string;
  isAdult: boolean;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  experienceLevel: "beginner" | "intermediate" | "advanced";
  background: string;
  goals: string;
  preferredDays: string[];
  preferredTime: string;
  preferredStart: string;
  learningFormat: "online" | "in-person" | "flexible";
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const steps = ["Program", "Your details", "Your goals", "Schedule", "Review"];
const initialForm: RegistrationForm = {
  trackId: tracks[0].id,
  paymentPlan: "deposit",
  fullName: "",
  email: "",
  phone: "",
  country: "",
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Lagos",
  isAdult: true,
  guardianName: "",
  guardianEmail: "",
  guardianPhone: "",
  experienceLevel: "beginner",
  background: "",
  goals: "",
  preferredDays: [],
  preferredTime: "",
  preferredStart: "",
  learningFormat: "online",
  acceptedTerms: false,
  acceptedPrivacy: false,
};

type LearningRegistrationProps = {
  variant?: "floating" | "header";
};

export default function LearningRegistration({
  variant = "floating",
}: LearningRegistrationProps) {
  const { currency, rate } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<RegistrationForm>(initialForm);
  const [requestId, setRequestId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dialogRef = useRef<HTMLElement>(null);

  const selectedTrack = tracks.find(({ id }) => id === form.trackId) ?? tracks[0];
  const paymentAmount = form.paymentPlan === "full" ? selectedTrack.totalAmount : selectedTrack.depositAmount;
  const formattedAmount = (amount: number) => formatCurrencyAmount(amount, currency, rate);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, isSubmitting]);

  function openForm() {
    setForm({
      ...initialForm,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Lagos",
    });
    setStep(0);
    setRequestId(crypto.randomUUID());
    setErrorMessage("");
    setIsOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentForm = event.currentTarget;
    if (!currentForm.reportValidity()) return;

    if (step < steps.length - 1) {
      setStep((current) => current + 1);
      setErrorMessage("");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const registrationResponse = await fetch("/api/learning/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, requestId }),
      });
      const registrationResult = await registrationResponse.json() as {
        enrollment?: { id: string };
        error?: string;
      };
      if (!registrationResponse.ok || !registrationResult.enrollment) {
        throw new Error(registrationResult.error ?? "Unable to save your registration.");
      }

      const paymentResponse = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentType: "learning-enrollment",
          enrollmentId: String(registrationResult.enrollment.id),
        }),
      });
      const paymentResult = await paymentResponse.json() as { checkoutUrl?: string; error?: string };
      if (!paymentResponse.ok || !paymentResult.checkoutUrl) {
        throw new Error(paymentResult.error ?? "Unable to open secure checkout.");
      }

      window.location.assign(paymentResult.checkoutUrl);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to complete registration.");
      setIsSubmitting(false);
    }
  }

  function toggleDay(day: string, checked: boolean) {
    setForm((current) => ({
      ...current,
      preferredDays: checked
        ? [...current.preferredDays, day]
        : current.preferredDays.filter((selectedDay) => selectedDay !== day),
    }));
  }

  return (
    <>
      <button
        type="button"
        onClick={openForm}
        aria-haspopup="dialog"
        aria-label="Start learning registration"
        className={variant === "header"
          ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d7f36a] text-[9px] font-bold uppercase leading-[1] tracking-[-0.02em] text-[#2f2f2f] shadow-sm transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d7f36a]"
          : "fixed bottom-[200px] right-5 z-50 flex h-20 w-20 items-center justify-center rounded-full bg-[#d7f36a] text-[#2f2f2f] shadow-[0_12px_32px_rgba(0,0,0,0.16)] transition-transform duration-200 hover:scale-105 sm:right-8"}
      >
        {variant === "header" ? (
          <span className="flex flex-col items-center text-[8px] font-semibold uppercase leading-[1.02] tracking-[0.08em]">
            <span>Start</span>
            <span>Up</span>
            
          </span>
        ) : (
          <span className="flex flex-col items-center text-[10px] font-semibold uppercase leading-[1.05] tracking-[0.12em]">
            <span>Start</span>
            <span>Up</span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 sm:items-center sm:p-5">
          <button
            type="button"
            aria-label="Close registration"
            onClick={() => !isSubmitting && setIsOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default"
          />
          <section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="learning-registration-title"
            tabIndex={-1}
            className="relative max-h-[94dvh] w-full max-w-2xl overflow-y-auto rounded-t-lg bg-[#f5f5f0] text-[#111111] shadow-2xl outline-none sm:rounded-lg"
          >
            <header className="sticky top-0 z-10 border-b border-black/10 bg-[#f5f5f0]/95 px-5 pb-4 pt-5 backdrop-blur sm:px-8 sm:pt-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#008c87]">Program registration</p>
                  <h2 id="learning-registration-title" className="mt-2 text-2xl font-semibold">Level Up</h2>
                </div>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsOpen(false)}
                  aria-label="Close registration"
                  className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/15 text-2xl leading-none hover:bg-black/5 disabled:opacity-50"
                >×</button>
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-black/55">Step {step + 1} of {steps.length}: {steps[step]}</p>
                <p className="text-xs text-black/45">{Math.round(((step + 1) / steps.length) * 100)}%</p>
              </div>
              <div className="mt-2 h-1 bg-black/10">
                <div className="h-full bg-[#008c87] transition-[width]" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
              </div>
            </header>

            <form onSubmit={handleSubmit} className="px-5 pb-6 pt-5 sm:px-8 sm:pb-8">
              {step === 0 && (
                <div className="space-y-5">
                  <label className="block text-sm font-medium">
                    Learning program
                    <select
                      required
                      value={form.trackId}
                      onChange={(event) => setForm((current) => ({ ...current, trackId: event.target.value }))}
                      className="mt-2 w-full border border-black/20 bg-white px-4 py-3 outline-none focus:border-[#008c87]"
                    >
                      {tracks.map((track) => <option key={track.id} value={track.id}>{track.title}</option>)}
                    </select>
                  </label>
                  <fieldset>
                    <legend className="text-sm font-medium">Payment option</legend>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2">
                      <label className={`cursor-pointer border p-4 ${form.paymentPlan === "deposit" ? "border-[#008c87] bg-[#008c87]/5" : "border-black/15 bg-white"}`}>
                        <input type="radio" name="paymentPlan" value="deposit" checked={form.paymentPlan === "deposit"} onChange={() => setForm((current) => ({ ...current, paymentPlan: "deposit" }))} />
                        <span className="ml-2 text-sm font-semibold">Pay deposit</span>
                        <span className="mt-2 block text-lg font-semibold">{formattedAmount(selectedTrack.depositAmount)}</span>
                        <span className="mt-1 block text-xs text-black/55">Balance is arranged after registration.</span>
                      </label>
                      <label className={`cursor-pointer border p-4 ${form.paymentPlan === "full" ? "border-[#008c87] bg-[#008c87]/5" : "border-black/15 bg-white"}`}>
                        <input type="radio" name="paymentPlan" value="full" checked={form.paymentPlan === "full"} onChange={() => setForm((current) => ({ ...current, paymentPlan: "full" }))} />
                        <span className="ml-2 text-sm font-semibold">Pay in full</span>
                        <span className="mt-2 block text-lg font-semibold">{formattedAmount(selectedTrack.totalAmount)}</span>
                        <span className="mt-1 block text-xs text-black/55">One secure payment for the full program.</span>
                      </label>
                    </div>
                  </fieldset>
                  <div className="border-l-2 border-[#008c87] bg-white/70 px-4 py-3 text-sm leading-6 text-black/65">
                    {selectedTrack.duration} · {selectedTrack.shortTitle} · Checkout is securely handled by Paystack.
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium sm:col-span-2">
                    Full name
                    <input required maxLength={160} autoComplete="name" value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} className="mt-2 w-full border border-black/20 bg-white px-4 py-3 outline-none focus:border-[#008c87]" />
                  </label>
                  <label className="text-sm font-medium">
                    Email address
                    <input required type="email" maxLength={254} autoComplete="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="mt-2 w-full border border-black/20 bg-white px-4 py-3 outline-none focus:border-[#008c87]" />
                  </label>
                  <label className="text-sm font-medium">
                    Phone or WhatsApp
                    <input required type="tel" maxLength={30} autoComplete="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="mt-2 w-full border border-black/20 bg-white px-4 py-3 outline-none focus:border-[#008c87]" />
                  </label>
                  <label className="text-sm font-medium">
                    Country
                    <input required maxLength={100} autoComplete="country-name" value={form.country} onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))} className="mt-2 w-full border border-black/20 bg-white px-4 py-3 outline-none focus:border-[#008c87]" />
                  </label>
                  <label className="text-sm font-medium">
                    Time zone
                    <input required maxLength={100} value={form.timeZone} onChange={(event) => setForm((current) => ({ ...current, timeZone: event.target.value }))} className="mt-2 w-full border border-black/20 bg-white px-4 py-3 outline-none focus:border-[#008c87]" />
                  </label>
                  <label className="flex items-start gap-3 text-sm leading-6 sm:col-span-2">
                    <input type="checkbox" checked={form.isAdult} onChange={(event) => setForm((current) => ({ ...current, isAdult: event.target.checked }))} className="mt-1 h-4 w-4 accent-[#008c87]" />
                    <span>I am 18 or older. If you are registering someone under 18, leave this unchecked and provide a parent or guardian contact below.</span>
                  </label>
                  {!form.isAdult && (
                    <>
                      <label className="text-sm font-medium sm:col-span-2">
                        Parent or guardian full name
                        <input required maxLength={160} value={form.guardianName} onChange={(event) => setForm((current) => ({ ...current, guardianName: event.target.value }))} className="mt-2 w-full border border-black/20 bg-white px-4 py-3 outline-none focus:border-[#008c87]" />
                      </label>
                      <label className="text-sm font-medium">
                        Guardian email
                        <input required type="email" maxLength={254} value={form.guardianEmail} onChange={(event) => setForm((current) => ({ ...current, guardianEmail: event.target.value }))} className="mt-2 w-full border border-black/20 bg-white px-4 py-3 outline-none focus:border-[#008c87]" />
                      </label>
                      <label className="text-sm font-medium">
                        Guardian phone
                        <input required type="tel" maxLength={30} value={form.guardianPhone} onChange={(event) => setForm((current) => ({ ...current, guardianPhone: event.target.value }))} className="mt-2 w-full border border-black/20 bg-white px-4 py-3 outline-none focus:border-[#008c87]" />
                      </label>
                    </>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <fieldset>
                    <legend className="text-sm font-medium">How would you describe your current level?</legend>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {(["beginner", "intermediate", "advanced"] as const).map((level) => (
                        <label key={level} className={`cursor-pointer border px-3 py-3 text-center text-sm capitalize ${form.experienceLevel === level ? "border-[#008c87] bg-[#008c87]/5 font-semibold" : "border-black/15 bg-white"}`}>
                          <input className="sr-only" type="radio" name="experienceLevel" value={level} checked={form.experienceLevel === level} onChange={() => setForm((current) => ({ ...current, experienceLevel: level }))} />
                          {level}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label className="block text-sm font-medium">
                    What have you already studied or worked on? <span className="font-normal text-black/45">Optional</span>
                    <textarea maxLength={2000} rows={3} value={form.background} onChange={(event) => setForm((current) => ({ ...current, background: event.target.value }))} className="mt-2 w-full resize-y border border-black/20 bg-white px-4 py-3 leading-6 outline-none focus:border-[#008c87]" />
                  </label>
                  <label className="block text-sm font-medium">
                    What would you like to be able to do by the end of the program?
                    <textarea required maxLength={3000} rows={5} value={form.goals} onChange={(event) => setForm((current) => ({ ...current, goals: event.target.value }))} className="mt-2 w-full resize-y border border-black/20 bg-white px-4 py-3 leading-6 outline-none focus:border-[#008c87]" />
                  </label>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <fieldset>
                    <legend className="text-sm font-medium">Which days usually work for you?</legend>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {days.map((day) => (
                        <label key={day} className={`flex cursor-pointer items-center gap-2 border px-3 py-3 text-sm ${form.preferredDays.includes(day) ? "border-[#008c87] bg-[#008c87]/5" : "border-black/15 bg-white"}`}>
                          <input type="checkbox" checked={form.preferredDays.includes(day)} onChange={(event) => toggleDay(day, event.target.checked)} className="h-4 w-4 accent-[#008c87]" />
                          {day}
                        </label>
                      ))}
                    </div>
                    {form.preferredDays.length === 0 && <p className="mt-2 text-xs text-black/50">Choose at least one preferred day.</p>}
                  </fieldset>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-medium">
                      Preferred time
                      <select required value={form.preferredTime} onChange={(event) => setForm((current) => ({ ...current, preferredTime: event.target.value }))} className="mt-2 w-full border border-black/20 bg-white px-4 py-3 outline-none focus:border-[#008c87]">
                        <option value="">Choose a time</option>
                        <option>Morning (9am–12pm)</option>
                        <option>Afternoon (12pm–4pm)</option>
                        <option>Evening (4pm–8pm)</option>
                        <option>Flexible</option>
                      </select>
                    </label>
                    <label className="text-sm font-medium">
                      When would you like to start?
                      <select required value={form.preferredStart} onChange={(event) => setForm((current) => ({ ...current, preferredStart: event.target.value }))} className="mt-2 w-full border border-black/20 bg-white px-4 py-3 outline-none focus:border-[#008c87]">
                        <option value="">Choose a start window</option>
                        <option>As soon as possible</option>
                        <option>Within 1 month</option>
                        <option>Within 2–3 months</option>
                        <option>Not sure yet</option>
                      </select>
                    </label>
                  </div>
                  <fieldset>
                    <legend className="text-sm font-medium">Preferred learning format</legend>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {(["online", "in-person", "flexible"] as const).map((format) => (
                        <label key={format} className={`cursor-pointer border px-2 py-3 text-center text-sm capitalize ${form.learningFormat === format ? "border-[#008c87] bg-[#008c87]/5 font-semibold" : "border-black/15 bg-white"}`}>
                          <input className="sr-only" type="radio" name="learningFormat" value={format} checked={form.learningFormat === format} onChange={() => setForm((current) => ({ ...current, learningFormat: format }))} />
                          {format}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <p className="text-xs leading-5 text-black/50">Times are in {form.timeZone}. Your preferences help us arrange a suitable tutor and schedule.</p>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5">
                  <dl className="divide-y divide-black/10 border-y border-black/10">
                    <div className="flex flex-wrap justify-between gap-2 py-3 text-sm"><dt className="text-black/50">Program</dt><dd className="font-medium">{selectedTrack.title}</dd></div>
                    <div className="flex flex-wrap justify-between gap-2 py-3 text-sm"><dt className="text-black/50">Duration</dt><dd className="font-medium">{selectedTrack.duration}</dd></div>
                    <div className="flex flex-wrap justify-between gap-2 py-3 text-sm"><dt className="text-black/50">Learner</dt><dd className="font-medium">{form.fullName} · {form.email}</dd></div>
                    <div className="flex flex-wrap justify-between gap-2 py-3 text-sm"><dt className="text-black/50">Availability</dt><dd className="font-medium">{form.preferredDays.join(", ")} · {form.preferredTime}</dd></div>
                    <div className="flex flex-wrap justify-between gap-2 py-3 text-sm"><dt className="text-black/50">Format</dt><dd className="font-medium capitalize">{form.learningFormat}</dd></div>
                    <div className="flex flex-wrap justify-between gap-2 py-3 text-sm"><dt className="text-black/50">Payment</dt><dd className="font-medium">{form.paymentPlan === "full" ? "Full program fee" : "Program deposit"}</dd></div>
                    <div className="flex flex-wrap justify-between gap-2 py-4 text-sm"><dt className="font-semibold">Due securely at checkout</dt><dd className="text-lg font-semibold text-[#007d79]">{formattedAmount(paymentAmount)}</dd></div>
                  </dl>
                  <label className="flex items-start gap-3 text-sm leading-6">
                    <input required type="checkbox" checked={form.acceptedTerms} onChange={(event) => setForm((current) => ({ ...current, acceptedTerms: event.target.checked }))} className="mt-1 h-4 w-4 accent-[#008c87]" />
                    <span>I understand the selected program, payment amount, and that tutor assignment and session scheduling will be confirmed after registration.</span>
                  </label>
                  <label className="flex items-start gap-3 text-sm leading-6">
                    <input required type="checkbox" checked={form.acceptedPrivacy} onChange={(event) => setForm((current) => ({ ...current, acceptedPrivacy: event.target.checked }))} className="mt-1 h-4 w-4 accent-[#008c87]" />
                    <span>I consent to using these details to arrange my learning program. See the <a href="/privacy" target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">privacy policy</a>.</span>
                  </label>
                  <p className="text-xs leading-5 text-black/50">Your registration is saved before checkout. Enrollment is confirmed only after Paystack verifies the payment.</p>
                </div>
              )}

              {errorMessage && <p role="alert" className="mt-5 border-l-2 border-red-700 bg-red-50 px-3 py-2 text-sm text-red-800">{errorMessage}</p>}
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-black/10 pt-5">
                {step > 0 ? (
                  <button type="button" disabled={isSubmitting} onClick={() => { setStep((current) => current - 1); setErrorMessage(""); }} className="px-4 py-3 text-sm font-semibold text-black/60 hover:text-black disabled:opacity-50">Back</button>
                ) : <span />}
                <button type="submit" disabled={isSubmitting || (step === 3 && form.preferredDays.length === 0)} className="min-h-12 bg-[#163d34] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#008c87] disabled:cursor-wait disabled:opacity-50">
                  {isSubmitting ? "Preparing secure checkout..." : step === steps.length - 1 ? `Continue to Paystack · ${formattedAmount(paymentAmount)}` : "Continue"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
