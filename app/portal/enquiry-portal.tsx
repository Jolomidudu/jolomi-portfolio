"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import BlogManager from "./blog-manager";
import LearningManager from "./learning-manager";

type Enquiry = {
  id: string;
  service: string;
  description: string;
  startDate: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  status: string;
  createdAt: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function EnquiryPortal() {
  const [signedIn, setSignedIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [activeSection, setActiveSection] = useState<"enquiries" | "blog" | "learning">("enquiries");

  useEffect(() => {
    let active = true;

    async function loadEnquiries() {
      setIsCheckingSession(true);
      try {
        const response = await fetch("/api/portal/enquiries", { cache: "no-store" });
        const result = await response.json() as { enquiries?: Enquiry[]; error?: string };
        if (!active) return;

        if (response.status === 401) {
          setSignedIn(false);
          return;
        }
        if (!response.ok) throw new Error(result.error ?? "Unable to load enquiries.");

        const rows = result.enquiries ?? [];
        setEnquiries(rows);
        setSelectedId((currentId) => rows.some(({ id }) => id === currentId) ? currentId : rows[0]?.id ?? null);
        setSignedIn(true);
        setErrorMessage("");
      } catch (error) {
        if (active) setErrorMessage(error instanceof Error ? error.message : "Unable to load enquiries.");
      } finally {
        if (active) setIsCheckingSession(false);
      }
    }

    void loadEnquiries();
    return () => { active = false; };
  }, [refreshVersion]);

  const normalizedSearch = search.trim().toLowerCase();
  const filteredEnquiries = enquiries.filter((enquiry) =>
    `${enquiry.service} ${enquiry.firstName} ${enquiry.lastName} ${enquiry.email}`
      .toLowerCase()
      .includes(normalizedSearch),
  );
  const selectedEnquiry = enquiries.find(({ id }) => id === selectedId) ?? null;

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to sign in.");
      setPassword("");
      setRefreshVersion((version) => version + 1);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function signOut() {
    await fetch("/api/portal/logout", { method: "POST" });
    setSignedIn(false);
    setEnquiries([]);
    setSelectedId(null);
    setPassword("");
    setErrorMessage("");
    setActiveSection("enquiries");
  }

  if (isCheckingSession && !signedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f0] px-6 text-sm text-black/55">
        Checking portal session...
      </main>
    );
  }

  if (!signedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f0] px-5 py-12 text-[#111111]">
        <section className="w-full max-w-md border border-black/10 bg-white p-7 shadow-sm sm:p-9">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.15em] text-[#008e8a]">
            Jolomi Dudu
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-black/45">Private workspace</p>
          <h1 className="mt-2 text-3xl font-semibold">Admin Center</h1>
          <p className="mt-3 text-sm leading-6 text-black/55">Sign in to manage app activities</p>

          <form className="mt-7 space-y-4" onSubmit={signIn}>
            <label className="block text-sm font-medium">
              Email
              <input
                required
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-md border border-black/15 px-3 py-3 outline-none focus:border-[#00A9A5]"
              />
            </label>
            <label className="block text-sm font-medium">
              Password
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-md border border-black/15 px-3 py-3 outline-none focus:border-[#00A9A5]"
              />
            </label>
            {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-[#111111] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#333333] disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f0] text-[#111111]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 bg-white px-5 py-4 sm:px-8">
        <div>
          <Link href="/" className="text-xs font-semibold uppercase tracking-[0.15em] text-[#008e8a]">Jolomi Dudu</Link>
          <h1 className="mt-1 text-xl font-semibold">{activeSection === "enquiries" ? "Project enquiries" : activeSection === "blog" ? "Blog posts" : "Learning content"}</h1>
        </div>
        <nav aria-label="Portal sections" className="flex items-center gap-1 border-b border-black/10">
          <button
            type="button"
            onClick={() => setActiveSection("enquiries")}
            aria-pressed={activeSection === "enquiries"}
            className={`border-b-2 px-3 py-2 text-sm font-medium ${activeSection === "enquiries" ? "border-[#00A9A5] text-[#007d79]" : "border-transparent text-black/50 hover:text-black"}`}
          >
            Enquiries
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("blog")}
            aria-pressed={activeSection === "blog"}
            className={`border-b-2 px-3 py-2 text-sm font-medium ${activeSection === "blog" ? "border-[#00A9A5] text-[#007d79]" : "border-transparent text-black/50 hover:text-black"}`}
          >
            Blog
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("learning")}
            aria-pressed={activeSection === "learning"}
            className={`border-b-2 px-3 py-2 text-sm font-medium ${activeSection === "learning" ? "border-[#00A9A5] text-[#007d79]" : "border-transparent text-black/50 hover:text-black"}`}
          >
            Learning
          </button>
        </nav>
        <div className="flex items-center gap-2">
          {activeSection === "enquiries" && (
            <button
              type="button"
              onClick={() => setRefreshVersion((version) => version + 1)}
              className="rounded-md border border-black/15 px-3 py-2 text-sm font-medium transition-colors hover:bg-black/5"
            >
              Refresh
            </button>
          )}
          <button
            type="button"
            onClick={signOut}
            className="rounded-md border border-black/15 px-3 py-2 text-sm font-medium transition-colors hover:bg-black/5"
          >
            Sign out
          </button>
        </div>
      </header>

      {activeSection === "blog" ? <BlogManager /> : activeSection === "learning" ? <LearningManager /> : (
      <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.5fr)]">
        <section className="border-b border-black/10 bg-white lg:border-b-0 lg:border-r">
          <div className="border-b border-black/10 p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-semibold">Inbox</h2>
              <span className="text-xs text-black/45">{enquiries.length} total</span>
            </div>
            <input
              type="search"
              aria-label="Search enquiries"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, service"
              className="mt-4 w-full rounded-md border border-black/15 bg-[#f5f5f0] px-3 py-2.5 text-sm outline-none focus:border-[#00A9A5]"
            />
          </div>

          {errorMessage && <p role="alert" className="m-4 text-sm text-red-700">{errorMessage}</p>}
          {filteredEnquiries.length === 0 ? (
            <p className="p-5 text-sm text-black/50">
              {enquiries.length === 0 ? "No project enquiries yet." : "No enquiries match your search."}
            </p>
          ) : (
            <ul className="divide-y divide-black/10">
              {filteredEnquiries.map((enquiry) => (
                <li key={enquiry.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(enquiry.id)}
                    aria-current={selectedId === enquiry.id ? "true" : undefined}
                    className={`w-full border-l-2 px-4 py-4 text-left transition-colors sm:px-5 ${selectedId === enquiry.id ? "border-[#00A9A5] bg-[#00A9A5]/5" : "border-transparent hover:bg-black/[0.025]"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-semibold">{enquiry.firstName} {enquiry.lastName}</span>
                      <time className="shrink-0 text-xs text-black/45" dateTime={enquiry.createdAt}>{formatDate(enquiry.createdAt)}</time>
                    </div>
                    <span className="mt-1 block text-sm text-black/60">{enquiry.service}</span>
                    <span className="mt-1 block truncate text-xs text-black/45">{enquiry.email}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-live="polite" className="p-5 sm:p-8">
          {selectedEnquiry ? (
            <article className="mx-auto max-w-3xl">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#008e8a]">{selectedEnquiry.service}</p>
                  <h2 className="mt-2 text-3xl font-semibold">{selectedEnquiry.firstName} {selectedEnquiry.lastName}</h2>
                  <time className="mt-2 block text-sm text-black/50" dateTime={selectedEnquiry.createdAt}>{formatDate(selectedEnquiry.createdAt)}</time>
                </div>
                <span className="rounded-full border border-[#00A9A5]/25 bg-[#00A9A5]/10 px-3 py-1 text-xs font-semibold capitalize text-[#007d79]">
                  {selectedEnquiry.status}
                </span>
              </div>

              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-black/45">Email</dt>
                  <dd className="mt-1 break-all text-sm"><a className="underline decoration-black/20 underline-offset-4" href={`mailto:${selectedEnquiry.email}`}>{selectedEnquiry.email}</a></dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-black/45">Phone</dt>
                  <dd className="mt-1 text-sm"><a className="underline decoration-black/20 underline-offset-4" href={`tel:${selectedEnquiry.countryCode}${selectedEnquiry.phone}`}>{selectedEnquiry.countryCode} {selectedEnquiry.phone}</a></dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-black/45">Preferred start date</dt>
                  <dd className="mt-1 text-sm">{selectedEnquiry.startDate}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-black/45">Project description</dt>
                  <dd className="mt-2 whitespace-pre-wrap rounded-md border border-black/10 bg-white p-4 text-sm leading-6">{selectedEnquiry.description}</dd>
                </div>
              </dl>
            </article>
          ) : (
            <div className="flex min-h-64 items-center justify-center text-center text-sm text-black/45">
              Select an enquiry to view its details.
            </div>
          )}
        </section>
      </div>
      )}
    </main>
  );
}