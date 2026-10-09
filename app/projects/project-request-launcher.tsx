"use client";

import { useEffect, useState, type FormEvent } from "react";
import { BadgeCheck, CalendarDays, FileText, Paperclip, Upload, X } from "lucide-react";
import { useRef } from "react";
import { projectServices } from "./project-services";
import { useCurrency } from "../currency-provider";

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
const labelClassName = "block text-md font-bold text-[#323e32]/85";
const secondaryButtonClassName =
  "rounded-md border border-black/20 px-4 py-2.5 text-xs text-[#ff0000]/75 font-semibold transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40";
const maxAttachmentCount = 3;
const maxAttachmentSize = 2 * 1024 * 1024;

const acceptedAttachmentExtensions = new Set([
  ".pdf", ".doc", ".docx", ".txt", ".rtf", ".png", ".jpg", ".jpeg", ".webp", ".gif",
]);

function localDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function upcomingDateStrings(days: number) {
  const start = new Date();
  start.setHours(12, 0, 0, 0);

  return Array.from({ length: days }, (_, offset) => {
    const date = new Date(start);
    date.setDate(start.getDate() + offset);
    return localDateString(date);
  });
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Unable to read this file."));
        return;
      }
      resolve(reader.result.slice(reader.result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read this file."));
    reader.readAsDataURL(file);
  });
}

type ProjectRequestLauncherProps = {
  variant?: "floating" | "header" | "circular";
};

export default function ProjectRequestLauncher({
  variant = "floating",
}: ProjectRequestLauncherProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [serviceListOpen, setServiceListOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [request, setRequest] = useState<ProjectRequest>(initialRequest);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentError, setAttachmentError] = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);
  const { currency } = useCurrency();
  const minimumStartDate = localDateString(new Date());
  const startDateOptions = upcomingDateStrings(45);
  const modalOpen = formOpen || confirmationOpen;
  const selectedService = projectServices.find(({ name }) => name === request.service);
  const selectedServicePrice = currency === "NGN" ? selectedService?.nigeria : selectedService?.international;

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

  function addAttachments(files: FileList | null) {
    if (!files?.length) return;

    const nextAttachments: File[] = [];
    let nextError = "";
    for (const file of Array.from(files)) {
      const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? "";
      if (!acceptedAttachmentExtensions.has(extension)) {
        nextError = `${file.name} is not a supported file type.`;
        continue;
      }
      if (file.size > maxAttachmentSize) {
        nextError = `${file.name} exceeds the 2 MB per-file limit.`;
        continue;
      }
      if (attachments.length + nextAttachments.length >= maxAttachmentCount) {
        nextError = "You can attach a maximum of 3 files.";
        break;
      }
      nextAttachments.push(file);
    }

    if (nextAttachments.length) setAttachments((current) => [...current, ...nextAttachments]);
    setAttachmentError(nextError);
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
      const encodedAttachments = await Promise.all(attachments.map(async (file) => ({
        name: file.name,
        data: await fileToBase64(file),
      })));
      const response = await fetch("/api/project-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...request, attachments: encodedAttachments }),
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
        className={variant === "header"
          ? "hidden rounded-full bg-[#343434] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1f2937] md:block"
          : variant === "circular"
            ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#cdf1b0] text-[10px] font-bold text-[#111111] shadow-sm transition-transform hover:scale-105 hover:bg-[#008e8a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A9A5]"
            : "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#d7f36a] text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#008e8a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00A9A5]"}
      >
        {variant === "header" ? "Start a project" : "START"}
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
            className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-xl border border-black/10 bg-[#f5f5f0] px-5 pb-6 pt-5 shadow-2xl sm:max-h-[90vh] sm:rounded-xl sm:px-8 sm:pb-8"
          >
            <header className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0f3515]">
                  Start A Project · Step {step} of 3
                </p>
                <h2 id="project-request-title" className="mt-2 text-2xl text-[#0f3515] font-semibold">
                  {step === 1 ? "Project Details" : step === 2 ? "Your Details" : "Review Request"}
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
                  className={`h-1 flex-1 rounded-full ${stepNumber <= step ? "bg-[#0f3515]" : "bg-black/10"}`}
                />
              ))}
            </div>

            <form className="mt-6" onSubmit={submitRequest}>
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <span id="service-label" className={labelClassName}>Service</span>
                    <button
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={serviceListOpen}
                      aria-labelledby="service-label"
                      aria-controls="project-service-options"
                      onClick={() => setServiceListOpen((isOpen) => !isOpen)}
                      className={`${fieldClassName} flex items-center justify-between gap-4 text-left`}
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-[#111111]">
                          {selectedService?.name ?? "Choose a service"}
                        </span>
                        {selectedServicePrice && (
                          <span className="mt-1 block text-xs font-normal text-[#0a5e14]/85">
                            Starting at {selectedServicePrice}
                          </span>
                          
                        )}
                      </span>
                      <span aria-hidden="true" className="shrink-0 text-base text-black/45">
                        {serviceListOpen ? "−" : "+"}
                      </span>
                    </button>

                    {serviceListOpen && (
                      <div
                        id="project-service-options"
                        role="listbox"
                        aria-labelledby="service-label"
                        className="mt-2 max-h-64 space-y-1 overflow-y-auto rounded-md border border-black/10 bg-white p-2 shadow-sm"
                      >
                        {projectServices.map((service) => (
                          <button
                            key={service.name}
                            type="button"
                            role="option"
                            aria-selected={request.service === service.name}
                            onClick={() => {
                              updateRequest("service", service.name);
                              setServiceListOpen(false);
                            }}
                            className={`w-full rounded-md px-3 py-2.5 text-left transition-colors ${request.service === service.name ? "bg-[#00A9A5]/10" : "hover:bg-[#f5f5f0]"}`}
                          >
                            <span className="block text-sm font-semibold text-[#111111]">
                              {service.name}
                            </span>
                            <span className="mt-1 block text-xs text-black/55">
                              Starting at {currency === "NGN" ? service.nigeria : service.international}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="project-attachments" className={`${labelClassName} mb-2 flex items-center gap-2`}>
                      <Paperclip aria-hidden="true" className="h-4 w-4 text-[#008e8a]" />
                      File Document/ NDA/ Images
                    </label>
                    <input
                      id="project-attachments"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.rtf,.png,.jpg,.jpeg,.webp,.gif"
                      disabled={attachments.length >= maxAttachmentCount}
                      onChange={(event) => {
                        addAttachments(event.target.files);
                        event.target.value = "";
                      }}
                      className="sr-only"
                    />
                    <label
                      htmlFor="project-attachments"
                      className={`flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-black/20 bg-white px-4 py-4 text-center transition-colors hover:border-[#008e8a] hover:bg-[#008e8a]/[0.03] ${attachments.length >= maxAttachmentCount ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <Upload aria-hidden="true" className="h-5 w-5 text-[#008e8a]" />
                      <span className="mt-2 text-sm text-[#334342] font-semibold">Choose documents or images</span>
                      <span className="mt-1 text-xs text-black/80">Up to 3 files, 2 MB each</span>
                    </label>
                    

                    {attachments.length > 0 && (
                      <ul className="mt-2 space-y-2" aria-label="Selected files">
                        {attachments.map((file, index) => (
                          <li key={`${file.name}-${file.lastModified}`} className="flex items-center gap-3 rounded-md border border-black/10 bg-white px-3 py-2">
                            <FileText aria-hidden="true" className="h-4 w-4 shrink-0 text-[#008e8a]" />
                            <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
                            <span className="shrink-0 text-xs text-black/45">{(file.size / 1024).toFixed(0)} KB</span>
                            <button
                              type="button"
                              aria-label={`Remove ${file.name}`}
                              onClick={() => setAttachments((current) => current.filter((_, fileIndex) => fileIndex !== index))}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-black/50 transition-colors hover:bg-black/5 hover:text-black"
                            >
                              <X aria-hidden="true" className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {attachmentError && <p role="alert" className="mt-2 text-xs text-red-700">{attachmentError}</p>}
                  </div>

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

                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className={labelClassName}>Preferred start date</span>
                      <button
                        type="button"
                        aria-label="Open calendar date picker"
                        onClick={() => {
                          const dateInput = dateInputRef.current;
                          if (!dateInput) return;
                          if (typeof dateInput.showPicker === "function") {
                            dateInput.showPicker();
                          } else {
                            dateInput.click();
                          }
                        }}
                        className="flex h-10 w-12 shrink-0 items-center justify-center rounded-full border border-black/15 bg-white text-[#111111] transition-colors hover:border-[#008e8a] hover:text-[#008e8a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A9A5]"
                      >
                        <CalendarDays aria-hidden="true" className="h-5 w-5" />
                      </button>
                    </div>

                    <div
                      role="group"
                      aria-label="Choose a preferred start date"
                      className="-mx-5 mt-3 flex snap-x gap-2 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8"
                    >
                      {startDateOptions.map((date) => {
                        const optionDate = new Date(`${date}T12:00:00`);
                        const isSelected = request.startDate === date;

                        return (
                          <button
                            key={date}
                            type="button"
                            aria-pressed={isSelected}
                            aria-label={optionDate.toLocaleDateString("en", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                            onClick={() => updateRequest("startDate", date)}
                            className={`flex min-w-[4.75rem] snap-start flex-col items-center justify-center gap-1 rounded-2xl border px-3 py-3 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A9A5] ${isSelected ? "border-[#008e8a] bg-[#008e8a] text-white" : "border-black/10 bg-white text-[#111111] hover:border-[#008e8a]"}`}
                          >
                            <span className="text-xs font-medium opacity-75">
                              {optionDate.toLocaleDateString("en", { weekday: "short" })}
                            </span>
                            <span className="text-2xl font-semibold leading-none">
                              {optionDate.getDate()}
                            </span>
                            <span className="text-xs opacity-75">
                              {optionDate.toLocaleDateString("en", { month: "short" })}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <input
                      ref={dateInputRef}
                      tabIndex={-1}
                      aria-label="Preferred start date"
                      type="date"
                      min={minimumStartDate}
                      value={request.startDate}
                      onChange={(event) => updateRequest("startDate", event.target.value)}
                      className="sr-only"
                    />
                  </div>
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
                    <legend className={labelClassName}>Phone Number</legend>
                    <div className="mt-2 grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-2">
                      <select
                        aria-label="Country calling code"
                        value={request.countryCode}
                        onChange={(event) => updateRequest("countryCode", event.target.value)}
                        className="min-w-0 rounded-md border border-black/15 bg-white px-3 py-3 text-[#111111] text-sm outline-none focus:border-[#00A9A5]"
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
                        className="min-w-0 rounded-md border border-black/15 text-[#111111] bg-white px-3 py-3 text-sm outline-none focus:border-[#00A9A5]"
                        placeholder="10-digit number"
                      />
                    </div>
                  </fieldset>
                </div>
              )}

              {step === 3 && (
                <dl className="space-y-4 rounded-lg border border-black/10 bg-white/70 p-4 text-sm">
                  <div>
                    <dt className="font-semibold text-[#1c4916]/80">Selected Service</dt>
                    <dd className="mt-1 text-[#111111]">{request.service}</dd>
                    {selectedServicePrice && (
                      <dd className="mt-1 text-black/55">
                        Starting at {selectedServicePrice}
                      </dd>
                      
                    )}
                  </div>
                  <div>
                    <dt className="font-semibold text-[#1c4916]/80">Project In Details</dt>
                    <dd className="mt-1 text-[#111111] whitespace-pre-wrap">{request.description}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#1c4916]/80">Preferred Start Date</dt>
                    <dd className="mt-1 text-[#111111]">{request.startDate}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#1c4916]/80">Full Name</dt>
                    <dd className="mt-1 text-[#111111]">{request.firstName} {request.lastName}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#1c4916]/80">Email and Phone Number</dt>
                    <dd className="mt-1 text-[#111111]">{request.email} · {request.countryCode} {request.phone}</dd>
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
                    className="rounded-md bg-[#0f3515] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#008e8a] disabled:cursor-wait disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending..." : "Send It"}
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
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00A9A5]/10" aria-hidden="true">
              <BadgeCheck className="h-7 w-7 text-[#008e8a]" />
            </div>
            <h2 id="project-confirmed-title" className="mt-5 text-2xl text-[#195919] font-semibold">
              Request Confirmed
            </h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-black/90">
              Your project request has shipped to my VIP inbox. I will have a look at your request within the next 6hrs, schedule a call or message across to you, after which I will generate a detailed quote/invoice, send to you and then you make use of the invoice-id for payment and project commencement.
            </p>
            
            <button
              type="button"
              onClick={() => {
                setConfirmationOpen(false);
                setStep(1);
                setRequest(initialRequest);
              }}
              className="mt-7 w-full rounded-md bg-[#195919] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#333333]"
            >
              Close
            </button>
            
          </section>
        </div>
      )}
    </>
  );
}