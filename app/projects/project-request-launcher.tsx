"use client";

import { useEffect, useState, type FormEvent } from "react";

const services = [
  "Branding",
  "Logo",
  "Web App",
  "Mobile App",
  "Product Design",
  "Data Analytics",
  "IT Coaching",
  "Gadget Repair",
  "Strategic Planning",
  "Project Management",
] as const;

const countryCodes = [
  ["Nigeria", "+234"],
  ["Ghana", "+233"],
  ["Kenya", "+254"],
  ["South Africa", "+27"],
  ["United Kingdom", "+44"],
  ["United States / Canada", "+1"],
  ["Australia", "+61"],
  ["India", "+91"],
] as const;

type ProjectRequest = {
  service: string;
  description: string;
  startDate: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
};

const initialRequest: ProjectRequest = {
  service: "",
  description: "",
  startDate: "",
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "+234",
  phone: "",
};

const fieldClassName =
  "mt-2 w-full rounded-md border border-black/15 bg-white px-3 py-3 text-sm outline-none transition-colors focus:border-[#00A9A5]";
const labelClassName = "block text-sm font-medium text-black/75";
const secondaryButtonClassName =
  "rounded-md border border-black/20 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40";

function localDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ProjectRequestLauncher() {
  const [formOpen, setFormOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [request, setRequest] = useState<ProjectRequest>(initialRequest);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const minimumStartDate = localDateString(new Date());
  const modalOpen = formOpen || confirmationOpen;

  useEffect(() => {
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        setFormOpen(false);
        setConfirmationOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isSubmitting, modalOpen]);

  function updateRequest<K extends keyof ProjectRequest>(
    field: K,
    value: ProjectRequest[K],
  ) {
    setRequest((current) => ({ ...current, [field]: value }));
  }

  function closeForm() {
    if (isSubmitting) return;
    setFormOpen(false);
    setStep(1);
    setErrorMessage("");
  }

  function goToNextStep() {
    setErrorMessage("");

    if (step === 1 && (!request.service || !request.description.trim() || !request.startDate)) {
      setErrorMessage("Choose a service, describe your project, and select a start date.");
      return;
    }

    if (step === 2) {
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email.trim());
      if (!request.firstName.trim() || !request.lastName.trim() || !validEmail || !/^\d{10}$/.test(request.phone)) {
        setErrorMessage("Enter your name, a valid email, and a 10-digit phone number.");
        return;
      }
    }

    setStep((currentStep) => Math.min(currentStep + 1, 3));
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step !== 3 || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/project-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setErrorMessage(result.error ?? "Unable to send your request. Please try again.");
        return;
      }

      setFormOpen(false);
      setConfirmationOpen(true);
    } catch {
      setErrorMessage("Unable to send your request. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Start a project"
        title="Start a project"
        onClick={() => setFormOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#343434] text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#008e8a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00A9A5]"
      >
        Start
      </button>

      {formOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-request-title"
            className="w-full max-w-2xl overflow-y-auto rounded-t-xl border border-black/10 bg-[#f5f5f0] px-5 pb-6 pt-5 shadow-2xl sm:max-h-[90vh] sm:rounded-xl sm:px-8 sm:pb-8"
          >
            <header className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#008e8a]">
                  Project enquiry · Step {step} of 3
                </p>
                <h2 id="project-request-title" className="mt-2 text-2xl font-semibold">
                  {step === 1 ? "Project details" : step === 2 ? "Your details" : "Review request"}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close project form"
                disabled={isSubmitting}
                onClick={closeForm}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/15 text-xl text-black/70 transition-colors hover:bg-black/5 disabled:opacity-40"
              >
                ×
              </button>
            </header>

            <div className="mt-5 flex gap-2" aria-hidden="true">
              {[1, 2, 3].map((stepNumber) => (
                <span
                  key={stepNumber}
                  className={`h-1 flex-1 rounded-full ${stepNumber <= step ? "bg-[#00A9A5]" : "bg-black/10"}`}
                />
              ))}
            </div>

            <form className="mt-6" onSubmit={submitRequest}>
              {step === 1 && (
                <div className="space-y-4">
                  <label className={labelClassName}>
                    Service
                    <select
                      required
                      value={request.service}
                      onChange={(event) => updateRequest("service", event.target.value)}
                      className={fieldClassName}
                    >
                      <option value="" disabled>Select a service</option>
                      {services.map((service) => <option key={service}>{service}</option>)}
                    </select>
                  </label>

                  <label className={labelClassName}>
                    Project description
                    <textarea
                      required
                      rows={4}
                      maxLength={5000}
                      value={request.description}
                      onChange={(event) => updateRequest("description", event.target.value)}
                      className={`${fieldClassName} resize-y`}
                      placeholder="What are you looking to build or solve?"
                    />
                  </label>

                  <label className={labelClassName}>
                    Preferred start date
                    <input
                      required
                      type="date"
                      min={minimumStartDate}
                      value={request.startDate}
                      onChange={(event) => updateRequest("startDate", event.target.value)}
                      className={fieldClassName}
                    />
                  </label>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={labelClassName}>
                      First name
                      <input
                        required
                        autoComplete="given-name"
                        value={request.firstName}
                        onChange={(event) => updateRequest("firstName", event.target.value)}
                        className={fieldClassName}
                      />
                    </label>
                    <label className={labelClassName}>
                      Last name
                      <input
                        required
                        autoComplete="family-name"
                        value={request.lastName}
                        onChange={(event) => updateRequest("lastName", event.target.value)}
                        className={fieldClassName}
                      />
                    </label>
                  </div>

                  <label className={labelClassName}>
                    Email
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      value={request.email}
                      onChange={(event) => updateRequest("email", event.target.value)}
                      className={fieldClassName}
                    />
                  </label>

                  <fieldset>
                    <legend className={labelClassName}>Phone number</legend>
                    <div className="mt-2 grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-2">
                      <select
                        aria-label="Country calling code"
                        value={request.countryCode}
                        onChange={(event) => updateRequest("countryCode", event.target.value)}
                        className="min-w-0 rounded-md border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-[#00A9A5]"
                      >
                        {countryCodes.map(([country, code]) => (
                          <option key={`${country}-${code}`} value={code}>{country} ({code})</option>
                        ))}
                      </select>
                      <input
                        required
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        minLength={10}
                        aria-label="10-digit phone number"
                        value={request.phone}
                        onChange={(event) => updateRequest("phone", event.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="min-w-0 rounded-md border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-[#00A9A5]"
                        placeholder="10-digit number"
                      />
                    </div>
                  </fieldset>
                </div>
              )}

              {step === 3 && (
                <dl className="space-y-4 rounded-lg border border-black/10 bg-white/70 p-4 text-sm">
                  <div>
                    <dt className="font-semibold text-black/50">Service</dt>
                    <dd className="mt-1">{request.service}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-black/50">Project description</dt>
                    <dd className="mt-1 whitespace-pre-wrap">{request.description}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-black/50">Preferred start date</dt>
                    <dd className="mt-1">{request.startDate}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-black/50">Name</dt>
                    <dd className="mt-1">{request.firstName} {request.lastName}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-black/50">Email and phone</dt>
                    <dd className="mt-1">{request.email} · {request.countryCode} {request.phone}</dd>
                  </div>
                </dl>
              )}

              {errorMessage && (
                <p role="alert" className="mt-4 text-sm text-red-700">{errorMessage}</p>
              )}

              <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-5">
                <div className="flex gap-2">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => { setErrorMessage(""); setStep((currentStep) => currentStep - 1); }}
                      className={secondaryButtonClassName}
                    >
                      Previous
                    </button>
                  )}
                  <button type="button" onClick={closeForm} className={secondaryButtonClassName}>
                    Cancel
                  </button>
                </div>

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="rounded-md bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#333333]"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-[#00A9A5] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#008e8a] disabled:cursor-wait disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending..." : "Start"}
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
      )}

      {confirmationOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 sm:p-5">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-confirmed-title"
            className="w-full max-w-lg rounded-t-xl border border-black/10 bg-[#f5f5f0] px-6 pb-8 pt-7 shadow-2xl sm:rounded-xl sm:p-9"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00A9A5]/10 text-2xl font-semibold text-[#008e8a]" aria-hidden="true">
              ✓
            </div>
            <h2 id="project-confirmed-title" className="mt-5 text-2xl font-semibold">
              Project Confirmed
            </h2>
            <p className="mt-2 text-sm leading-6 text-black/60">
              Your project details have been sent. You can expect a call soon.
            </p>
            <button
              type="button"
              onClick={() => {
                setConfirmationOpen(false);
                setStep(1);
                setRequest(initialRequest);
              }}
              className="mt-7 w-full rounded-md bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#333333]"
            >
              Close
            </button>
          </section>
        </div>
      )}
    </>
  );
}