import type { Metadata } from "next";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import SiteChrome from "../site-chrome";
import ContactFormModal from "./contact-form-modal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation with Jolomi Dudu about technology leadership, software engineering, consulting, digital transformation, projects, training and partnerships.",
};

const enquiryTypes = [
  "Technology leadership / ICT consulting",
  "Technology strategy & digital transformation",
  "Software / web application",
  "Mobile application",
  "Systems architecture / technical review",
  "Data & analytics",
  "Cloud / DevOps / infrastructure",
  "Technology training",
  "Mentorship",
  "Partnership / collaboration",
  "Speaking / media",
  "Other",
];

const contactOptions = [
  {
    number: "01",
    title: "Technology & IT Leadership",
    description:
      "Discuss technology strategy, ICT operations, digital transformation, technology roadmaps, team leadership or organizational technology challenges.",
  },
  {
    number: "02",
    title: "Software & Product Development",
    description:
      "Have a product, platform or application that needs to be designed, built, improved or taken into production?",
  },
  {
    number: "03",
    title: "Technology Consulting",
    description:
      "Get an experienced technical perspective on architecture, systems, infrastructure, technology decisions, risks or existing products.",
  },
  {
    number: "04",
    title: "Training & Mentorship",
    description:
      "Discuss individual mentorship, practical technology training, team workshops or corporate technology programs.",
  },
];

export default function ContactPage() {
  return (
    <SiteChrome>
      <main className="bg-[#f5f5f0] text-[#111111]">
        {/* HERO */}
        <section className="px-6 pb-20 pt-16 md:px-12 md:pb-28 md:pt-24 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#751a1a]">
              Contact / Start a conversation
            </p>

            <div className="mt-7 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <h1 className="max-w-5xl text-4xl font-semibold leading-[0.88] tracking-[-0.06em] md:text-6xl">
                  Let&apos;s talk about what you&apos;re trying to build.
                </h1>
              </div>

             
            </div>
          </div>
        </section>
        

        {/* CONTACT OPTIONS */}
        <section className="bg-[#5a5a5a] px-6 py-20 text-[#f5f5f0] md:px-12 md:py-28 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-px overflow-hidden border border-white/15 bg-white/15 md:grid-cols-2">
              {contactOptions.map((option) => (
                <article
                  key={option.number}
                  className="bg-[#5a5a5a] p-7 md:p-10"
                >
                  <span className="text-xs text-white/35">
                    {option.number}
                  </span>

                  <h2 className="mt-8 text-3xl font-semibold tracking-tight">
                    {option.title}
                  </h2>

                  <p className="mt-4 max-w-xl text-md leading-7 text-white/85">
                    {option.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* MAIN CONTACT AREA */}
        <section className="px-6 py-20 md:px-12 md:py-28 lg:px-16">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-1 lg:gap-24">
            {/* LEFT SIDE */}
            <aside>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#008c87]">
                Get in touch
              </p>

              <h2 className="mt-5 max-w-md text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-6xl">
                Tell me what&apos;s on your mind.
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-black/55">
                The more context you can provide, the easier it is to
                understand the right way to help. But keep it simple — a few
                sentences are enough to start.
              </p>

              {/* DIRECT CONTACT */}
              <div className="mt-10 border-t border-black/15">
                <div className="border-b border-black/15 py-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/35">
                    Email
                  </p>

                  <a
                    href="mailto:jollofdudu@gmail.com"
                    className="mt-2 block text-lg font-semibold transition-colors hover:text-[#008c87]"
                  >
                    jollofdudu@gmail.com
                  </a>
                </div>

                <div className="border-b border-black/15 py-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/35">
                    Schedule a call
                  </p>

                  <a
                    href="https://calendly.com/jollofdudu/let-s-discuss-your-project"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-lg font-semibold transition-colors hover:text-[#008c87]"
                  >
                    Book a conversation <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                </div>

                <div className="border-b border-black/15 py-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/35">
                    Location
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    Lagos, Nigeria
                  </p>

                  <p className="mt-1 text-sm text-black/45">
                    Available for remote and international engagements.
                  </p>
                </div>

                <div className="py-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/35">
                    Professional network
                  </p>

                  <div className="mt-3 flex flex-wrap gap-5">
                    <a
                      href="https://www.linkedin.com/in/jolomid"
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold hover:text-[#008c87]"
                    >
                      LinkedIn <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    </a>

                    <a
                      href="https://github.com/jolomidudu"
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold hover:text-[#008c87]"
                    >
                      GitHub <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {/* FORM */}
            <ContactFormModal>
              <form
                action="mailto:jollofdudu@gmail.com?subject=Website%20Enquiry"
                method="post"
                encType="text/plain"
                className="mt-10 space-y-8"
              >
                {/* NAME */}
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-xs font-semibold uppercase tracking-[0.15em]"
                    >
                      Full name *
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      className="mt-3 w-full border-b border-black/20 bg-transparent px-0 py-4 text-base outline-none transition-colors placeholder:text-black/30 focus:border-[#008c87]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-xs font-semibold uppercase tracking-[0.15em]"
                    >
                      Email address *
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      className="mt-3 w-full border-b border-black/20 bg-transparent px-0 py-4 text-base outline-none transition-colors placeholder:text-black/30 focus:border-[#008c87]"
                    />
                  </div>
                </div>

                {/* COMPANY */}
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="company"
                      className="text-xs font-semibold uppercase tracking-[0.15em]"
                    >
                      Organization / Company
                    </label>

                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Company or organization"
                      className="mt-3 w-full border-b border-black/20 bg-transparent px-0 py-4 text-base outline-none transition-colors placeholder:text-black/30 focus:border-[#008c87]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="text-xs font-semibold uppercase tracking-[0.15em]"
                    >
                      Your role
                    </label>

                    <input
                      id="role"
                      name="role"
                      type="text"
                      placeholder="Founder, CTO, Manager, etc."
                      className="mt-3 w-full border-b border-black/20 bg-transparent px-0 py-4 text-base outline-none transition-colors placeholder:text-black/30 focus:border-[#008c87]"
                    />
                  </div>
                </div>

                {/* ENQUIRY TYPE */}
                <div>
                  <label
                    htmlFor="enquiry"
                    className="text-xs font-semibold uppercase tracking-[0.15em]"
                  >
                    What can I help with? *
                  </label>

                  <div className="relative mt-3">
                    <select
                      id="enquiry"
                      name="enquiry"
                      required
                      defaultValue=""
                      className="w-full appearance-none border-b border-black/20 bg-transparent px-0 py-4 pr-8 text-base outline-none transition-colors focus:border-[#008c87]"
                    >
                      <option value="" disabled>
                        Select an enquiry type
                      </option>

                      {enquiryTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
                  </div>
                </div>

                {/* BUDGET + TIMELINE */}
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="budget"
                      className="text-xs font-semibold uppercase tracking-[0.15em]"
                    >
                      Estimated budget
                    </label>

                    <div className="relative mt-3">
                      <select
                        id="budget"
                        name="budget"
                        defaultValue=""
                        className="w-full appearance-none border-b border-black/20 bg-transparent px-0 py-4 pr-8 text-base outline-none transition-colors focus:border-[#008c87]"
                      >
                        <option value="" disabled>
                          Select a range
                        </option>
                        <option value="under-500k">Under ₦500,000</option>
                        <option value="500k-1m">₦500,000 – ₦1,000,000</option>
                        <option value="1m-3m">₦1,000,000 – ₦3,000,000</option>
                        <option value="3m-5m">₦3,000,000 – ₦5,000,000</option>
                        <option value="5m-plus">₦5,000,000+</option>
                        <option value="international">
                          International / USD / GBP / EUR
                        </option>
                        <option value="not-sure">Not sure yet</option>
                      </select>
                      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="timeline"
                      className="text-xs font-semibold uppercase tracking-[0.15em]"
                    >
                      Desired timeline
                    </label>

                    <div className="relative mt-3">
                      <select
                        id="timeline"
                        name="timeline"
                        defaultValue=""
                        className="w-full appearance-none border-b border-black/20 bg-transparent px-0 py-4 pr-8 text-base outline-none transition-colors focus:border-[#008c87]"
                      >
                        <option value="" disabled>
                          Select a timeline
                        </option>
                        <option value="urgent">As soon as possible</option>
                        <option value="1-month">Within 1 month</option>
                        <option value="1-3-months">1–3 months</option>
                        <option value="3-6-months">3–6 months</option>
                        <option value="6-plus-months">6+ months</option>
                        <option value="flexible">Flexible</option>
                      </select>
                      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
                    </div>
                  </div>
                </div>

                {/* MESSAGE */}
                <div>
                  <label
                    htmlFor="message"
                    className="text-xs font-semibold uppercase tracking-[0.15em]"
                  >
                    Tell me about it *
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={7}
                    placeholder="What are you trying to build, improve or solve?"
                    className="mt-3 w-full resize-none border-b border-black/20 bg-transparent px-0 py-4 text-base leading-7 outline-none transition-colors placeholder:text-black/30 focus:border-[#008c87]"
                  />
                </div>

                {/* HOW DID YOU HEAR */}
                <div>
                  <label
                    htmlFor="source"
                    className="text-xs font-semibold uppercase tracking-[0.15em]"
                  >
                    How did you find me?
                  </label>

                  <div className="relative mt-3">
                    <select
                      id="source"
                      name="source"
                      defaultValue=""
                      className="w-full appearance-none border-b border-black/20 bg-transparent px-0 py-4 pr-8 text-base outline-none transition-colors focus:border-[#008c87]"
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="google">Google</option>
                      <option value="github">GitHub</option>
                      <option value="referral">Referral</option>
                      <option value="portfolio">Portfolio / Website</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
                  </div>
                </div>

                {/* SUBMIT */}
                <div className="border-t border-black/15 pt-8">
                  <button
                    type="submit"
                    className="inline-flex min-h-14 items-center justify-between gap-12 bg-[#163d34] px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#008c87]"
                  >
                    Continue to email
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </button>

                  <p className="mt-4 max-w-lg text-xs leading-5 text-black/40">
                    By submitting this form, you are requesting a professional
                    conversation about your enquiry. Project scope, pricing,
                    timelines and engagement terms are agreed separately.
                  </p>
                </div>
              </form>
            </ContactFormModal>
          </div>
        </section>

        {/* EXPECTATION SECTION */}
        <section className="border-t border-black/10 bg-[#e8eadf] px-6 py-20 md:px-12 md:py-28 lg:px-16">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#008c87]">
                What happens next
              </p>

              <h2 className="mt-5 max-w-md text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-6xl">
                A clear conversation before a commitment.
              </h2>
            </div>

            <div className="border-t border-black/15">
              <article className="grid gap-4 border-b border-black/15 py-7 md:grid-cols-[50px_1fr]">
                <span className="text-xs text-black/35">01</span>

                <div>
                  <h3 className="text-2xl font-semibold">
                    Initial conversation
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
                    We discuss your goals, current situation, challenges and
                    what you are trying to achieve.
                  </p>
                </div>
              </article>

              <article className="grid gap-4 border-b border-black/15 py-7 md:grid-cols-[50px_1fr]">
                <span className="text-xs text-black/35">02</span>

                <div>
                  <h3 className="text-2xl font-semibold">
                    Scope & recommendation
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
                    Where appropriate, I define the recommended approach,
                    deliverables, timeline, responsibilities and engagement
                    structure.
                  </p>
                </div>
              </article>

              <article className="grid gap-4 border-b border-black/15 py-7 md:grid-cols-[50px_1fr]">
                <span className="text-xs text-black/35">03</span>

                <div>
                  <h3 className="text-2xl font-semibold">
                    Proposal & agreement
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
                    If the engagement is a fit, the project or consulting
                    arrangement is documented before work begins.
                  </p>
                </div>
              </article>

              <article className="grid gap-4 py-7 md:grid-cols-[50px_1fr]">
                <span className="text-xs text-black/35">04</span>

                <div>
                  <h3 className="text-2xl font-semibold">
                    Work begins
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
                    We move into the agreed delivery, consulting, leadership,
                    training or technology engagement.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-[#111111] px-6 py-20 text-[#f5f5f0] md:px-12 md:py-28 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#78d8ca]">
              Start here
            </p>

            <div className="mt-5 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.05em] md:text-7xl">
                Have a technology problem, opportunity or idea?
              </h2>

              <a
                href="mailto:jollofdudu@gmail.com"
                className="inline-flex min-h-14 shrink-0 items-center justify-between gap-3 bg-[#d7f36a] px-6 py-4 text-sm font-semibold text-[#163d34] transition-colors hover:bg-white"
              >
                <span>Email me</span>
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}