import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteChrome from "../site-chrome";

export const metadata: Metadata = {
  title: "About | Jolomi Dudu",
  description: "Meet Jolomi Dudu, software engineer, product builder and founder working across web, mobile and backend systems.",
};

const highlights = [
  { value: "8+", label: "years building software" },
  { value: "65+", label: "products and projects" },
  { value: "6+", label: "core disciplines" },
  { value: "6", label: "engineers led at Grenstack" },
];

const strengths = [
  {
    number: "01",
    title: "I connect product thinking with engineering.",
    description: "I look beyond the feature request to understand who needs it, what problem it solves and how it should work in the real world.",
  },
  {
    number: "02",
    title: "I can work across the stack.",
    description: "From customer-facing interfaces to APIs, backend services and data, I understand how the parts of a digital product fit together.",
  },
  {
    number: "03",
    title: "I know how to build with a team.",
    description: "As Founder and Senior Software Engineer at Grenstack, I lead a six-person engineering team through the design and delivery of digital products.",
  },
  {
    number: "04",
    title: "I bring range without losing the details.",
    description: "My work spans real estate, FMCG, fintech, banking, healthcare, hospitality and SaaS, with each product shaped around its users and context.",
  },
];

const selectedWork = [
  {
    number: "01",
    name: "Spa Elaris",
    category: "Wellness · Web and mobile",
    description: "A spa platform for exploring treatments and booking appointments, designed to make the customer journey feel considered from the first visit.",
  },
  {
    number: "02",
    name: "Kids College",
    category: "Education · Web app",
    description: "A school management platform that brings administrators, teachers, students and parents into one connected experience.",
  },
  {
    number: "03",
    name: "CareCrowd",
    category: "Community · Mobile app",
    description: "A crowdfunding and community product that helps people raise funds, support causes and connect around shared work.",
  },
];

export default function AboutPage() {
  return (
    <SiteChrome>
      <main className="bg-[#f5f5f0] text-[#111111]">
        <section className="px-6 pb-20 pt-12 md:px-12 md:pb-28 md:pt-16 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#008c87]">About / Lagos, Nigeria</p>
          <div className="mt-8 grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-16">
            <div>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                I build the systems behind useful digital products.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-black/65">
                I&apos;m Oritsejolomi Dudu, a software engineer, product builder and founder. I work across interfaces, backend systems and the decisions that turn an idea into something people can use.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/services" className="inline-flex min-h-12 items-center bg-[#163d34] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#008c87]">Explore my services <span aria-hidden="true" className="ml-3">↗</span></Link>
                <Link href="/#work" className="inline-flex min-h-12 items-center border border-black/20 px-5 py-3 text-sm font-semibold transition-colors hover:border-[#008c87] hover:text-[#008c87]">See selected work</Link>
              </div>
            </div>
            <div className="relative mx-auto aspect-[4/4.5] w-full max-w-md overflow-hidden bg-[#d7dfd3]">
              <Image src="/images/jolomi2.jpg" alt="Jolomi Dudu, software engineer" fill priority sizes="(max-width: 768px) 90vw, 40vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[#12211f]/80 to-transparent px-5 pb-5 pt-16 text-white">
                <span className="text-sm font-medium">Jolomi Dudu</span>
                <span className="text-xs uppercase tracking-[0.15em] text-white/75">Engineer / Builder</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#163d34] px-6 py-12 text-[#f8f7ef] md:px-12 md:py-16 lg:px-16">
          <div className="grid grid-cols-2 gap-y-10 border-y border-white/20 py-8 md:grid-cols-4 md:gap-8">
            {highlights.map((highlight) => (
              <div key={highlight.label}>
                <p className="text-4xl font-semibold tracking-tight text-[#d7f36a] md:text-5xl">{highlight.value}</p>
                <p className="mt-2 max-w-36 text-xs leading-5 text-white/65 sm:text-sm">{highlight.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-20 md:px-12 md:py-28 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#008c87]">What makes my approach different</p>
              <h2 className="mt-5 max-w-md text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-5xl">I think about the whole product, not just the next ticket.</h2>
            </div>
            <div className="border-t border-black/15">
              {strengths.map((strength) => (
                <article key={strength.number} className="grid gap-4 border-b border-black/15 py-6 sm:grid-cols-[48px_1fr] sm:gap-6">
                  <span className="pt-1 text-xs text-black/40">{strength.number}</span>
                  <div>
                    <h3 className="text-xl font-semibold leading-snug">{strength.title}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">{strength.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-black/10 bg-[#e8eadf] px-6 py-20 md:px-12 md:py-24 lg:px-16">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#008c87]">Selected work</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Different problems. Thoughtful products.</h2>
            </div>
            <Link href="/#work" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-[#008c87]">Browse all projects <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="grid gap-0 border-y border-black/15 md:grid-cols-3 md:divide-x md:divide-black/15">
            {selectedWork.map((project) => (
              <article key={project.number} className="py-6 md:px-6 md:first:pl-0 md:last:pr-0">
                <p className="text-xs text-black/40">{project.number} / {project.category}</p>
                <h3 className="mt-5 text-2xl font-semibold">{project.name}</h3>
                <p className="mt-3 text-sm leading-6 text-black/60">{project.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#111111] px-6 py-16 text-[#f5f5f0] md:px-12 md:py-20 lg:px-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78d8ca]">Have a product in mind?</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] md:text-5xl">Let&apos;s turn the idea into a plan.</h2>
            </div>
            <Link href="/services#booking" className="inline-flex min-h-12 items-center justify-between gap-8 bg-[#d7f36a] px-5 py-3 text-sm font-semibold text-[#163d34] transition-colors hover:bg-white">Start a conversation <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
