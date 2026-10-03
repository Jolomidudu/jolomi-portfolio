import type { Metadata } from "next";
import Link from "next/link";
import SiteChrome from "../site-chrome";

export const metadata: Metadata = {
  title: "Experience | Jolomi Dudu",
  description: "A snapshot of Jolomi Dudu's work experience across product engineering, software development, and digital leadership.",
};

const experiences = [
  {
    period: "02/2022 - Present",
    role: "Founder / Senior Software Engineer",
    company: "Grenstack",
    location: "Lagos, Nigeria",
    description:
      "Lead a 6-person software engineering team in the design, development and delivery of scalable digital products and custom software solutions for businesses across real estate, fintech, e-commerce, healthcare, events and other industries.",
  },
  {
    period: "04/2025 - 03/2026",
    role: "Software Developer",
    company: "Greyfundr",
    location: "Lagos, Nigeria",
    description:
      "Designed, developed and maintained backend services powering crowdfunding campaigns, split-bill payments, user onboarding, event experiences and customer-facing workflows across multiple production applications.",
  },
  {
    period: "05/2022 - 04/2025",
    role: "Software Developer",
    company: "Gentleboard",
    location: "Lagos, Nigeria",
    description:
      "Designed and implemented scalable REST APIs powering property listings, property search, customer inquiries, shortlet bookings and internal operational workflows.",
  },
  {
    period: "02/2022 - 10/2026",
    role: "Business & App Developer",
    company: "ifitech & Associates Ltd",
    location: "Lagos, Nigeria",
    description:
      "Collaborated closely with management, design and business teams to translate real estate requirements into intuitive digital experiences and customer-focused features.",
  },
  {
    period: "07/2021 - 11/2023",
    role: "Website Application Developer",
    company: "Spinettcosmetics",
    location: "Nigeria",
    description:
      "Refactored existing applications into modular, maintainable architectures, reducing code complexity by approximately 35% and making future product and feature updates more efficient.",
  },
  {
    period: "07/2021 - 11/2023",
    role: "Social Media Manager",
    company: "Leros Comfort Foundation",
    location: "Lagos, Nigeria",
    description:
      "Managed the organization’s social media presence and digital communications, creating awareness around girl-child empowerment, human rights, education and humanitarian initiatives.",
  },
] as const;

export default function ExperiencePage() {
  return (
    <SiteChrome>
      <main className="bg-[#f5f5f0] text-[#111111]">
        <section className="px-6 pb-16 pt-12 md:px-12 md:pb-24 md:pt-16 lg:px-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
            Experience
          </p>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-6xl lg:text-7xl">
              Where I&apos;ve made an impact.
            </h1>
            <Link href="/services#booking" className="inline-flex items-center justify-center rounded-full border border-black px-5 py-3 text-sm font-semibold transition-colors hover:bg-black hover:text-white">
              Start a project
            </Link>
          </div>
        </section>

        <section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-16">
          <div className="border-t border-black/15">
            {experiences.map((item) => (
              <article key={`${item.company}-${item.period}`} className="grid gap-6 border-b border-black/15 py-10 md:grid-cols-[150px_1fr_120px]">
                <div>
                  <p className="text-sm text-black/40">{item.period}</p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">{item.company}</h2>
                  <p className="mt-1 text-sm text-[#00A9A5]">{item.role}</p>
                  <p className="mt-5 max-w-xl text-base leading-7 text-black/55">{item.description}</p>
                </div>

                <div className="text-sm text-black/40 md:text-right">{item.location}</div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
