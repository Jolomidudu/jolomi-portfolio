import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SiteChrome from "../site-chrome";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Jolomi Dudu's experience across technology leadership, software engineering, product development, digital transformation, and technology consulting.",
};

const experiences = [
  {
    period: "02/2022 - Present",
    role: "Founder / Engineering Manager",
    company: "Grenstack",
    location: "Lagos, Nigeria",
    description:
      "Leading 10+ person engineering team responsible for the design, development, and delivery of scalable digital products and custom technology solutions across real estate, fintech, e-commerce, healthcare, events, and other industries.",
  },
  {
    period: "04/2025 - 03/2026",
    role: "Software Engineer",
    company: "Greyfundr",
    location: "Lagos, Nigeria",
    description:
      "Designed, developed, and maintained backend services supporting crowdfunding campaigns, split-bill payments, user onboarding, event experiences, and customer-facing workflows across multiple production applications.",
  },
  {
    period: "05/2022 - 04/2025",
    role: "Application Developer",
    company: "Gentleboard",
    location: "Lagos, Nigeria",
    description:
      "Designed and implemented scalable REST APIs supporting property listings, property search, customer inquiries, shortlet bookings, and internal operational workflows.",
  },
  {
    period: "02/2022 - 10/2026",
    role: "Business & App Developer",
    company: "ifitech & Associates Ltd",
    location: "Lagos, Nigeria",
    description:
      "Worked with management, design, and business teams to translate organizational and real estate requirements into intuitive digital experiences, application solutions, and customer-focused features.",
  },
  {
    period: "07/2021 - 11/2023",
    role: "Website Application Developer",
    company: "Spinettcosmetics",
    location: "Nigeria",
    description:
      "Refactored existing applications into modular and maintainable architectures, reducing code complexity by approximately 35% and improving the efficiency of future product and feature development.",
  },
  {
    period: "07/2021 - 11/2023",
    role: "Social Media Manager",
    company: "Leros Comfort Foundation",
    location: "Lagos, Nigeria",
    description:
      "Managed the organization's social media presence and digital communications, supporting awareness initiatives across education, humanitarian causes, girl-child empowerment, and human rights.",
  },
  {
    period: "03/2020 - 11/2020",
    role: "Data Analyst (NYSC)",
    company:  "Ojodu Local Government Secretariat",
    location: "Ogun State, Nigeria",
    description:
      "Analyzed and interpreted data to support decision-making and improve organizational performance.",
  },
] as const;

const leadershipAreas = [
  {
    title: "Technology Strategy",
    description:
      "Connecting technology decisions with organizational objectives, business requirements, and long-term digital priorities.",
  },
  {
    title: "Engineering Leadership",
    description:
      "Leading engineering teams, providing technical direction, and creating the structure needed to deliver reliable digital products.",
  },
  {
    title: "Digital Transformation",
    description:
      "Helping organizations turn manual processes, business challenges, and opportunities into practical technology solutions.",
  },
  {
    title: "Product & Delivery",
    description:
      "Taking ideas from requirements and planning through design, engineering, implementation, and delivery.",
  },
  {
    title: "ICT & Technology Operations",
    description:
      "Understanding the systems, platforms, infrastructure, tools, and operational capabilities organizations depend on.",
  },
  {
    title: "Technical Advisory",
    description:
      "Bringing engineering experience and business context into technology decisions, solution planning, and implementation.",
  },
] as const;

export default function ExperiencePage() {
  return (
    <SiteChrome>
      <main className="bg-[#f5f5f0] text-[#111111]">
        {/* HERO */}
        <section className="px-6 pb-16 pt-12 md:px-12 md:pb-24 md:pt-16 lg:px-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#751a1a]">
            Experience / Leadership
          </p>

          <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="max-w-4xl text-3xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-6xl lg:text-7xl">
                Where I&apos;ve led,
                <br />
                built, and delivered.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-black/75 md:text-lg">
                A career spanning technology leadership, engineering,
                product development, digital delivery, and technology
                consulting.
              </p>
            </div>

            
          </div>
        </section>

        {/* EXPERIENCE TIMELINE */}
        <section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-16">
          <div className="border-t border-black/15">
            {experiences.map((item) => (
              <article
                key={`${item.company}-${item.period}`}
                className="grid gap-6 border-b border-black/15 py-10 md:grid-cols-[150px_1fr_140px] md:gap-10 md:py-12"
              >
                {/* PERIOD */}
                <div>
                  <p className="text-sm text-black/40">{item.period}</p>
                </div>

                {/* ROLE */}
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    {item.company}
                  </h2>

                  <p className="mt-2 text-sm font-medium text-[#00A9A5]">
                    {item.role}
                  </p>

                  <p className="mt-5 max-w-2xl text-base leading-7 text-black/55">
                    {item.description}
                  </p>
                </div>

                {/* LOCATION */}
                <div className="text-sm font-medium text-[#751a1a]/90 md:text-right">
                  {item.location}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* LEADERSHIP SCOPE */}
        <section className="bg-[#123F37] px-6 py-20 text-[#f5f5f0] md:px-12 md:py-28 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:gap-24">
            {/* INTRO */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
                Leadership & Technology
              </p>

              <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[0.95] tracking-[-0.04em] md:text-5xl lg:text-6xl">
                More than building technology.
                <span className="text-[#00A9A5]">
                  {" "}
                  I help lead it.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/60">
                My experience sits at the intersection of technology,
                engineering, business, and people. I approach technology not
                only as something to build, but as a capability that needs
                direction, structure, and measurable outcomes.
              </p>
            </div>

            {/* AREAS */}
            <div className="divide-y divide-white/10 border-y border-white/10">
              {leadershipAreas.map((area, index) => (
                <div
                  key={area.title}
                  className="grid gap-4 py-7 md:grid-cols-[55px_1fr] md:gap-6"
                >
                  <span className="text-xs text-white/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                      {area.title}
                    </h3>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 md:text-base md:leading-7">
                      {area.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CAREER PERSPECTIVE */}
        <section className="px-6 py-20 md:px-12 md:py-28 lg:px-16">
          <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr] md:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
                Career Perspective
              </p>
            </div>

            <div>
              <h2 className="max-w-4xl text-3xl font-semibold leading-[1] tracking-[-0.04em] md:text-5xl">
                Engineering gave me the technical depth.
                <br />
                Leadership gives me the perspective to use it well.
              </h2>

              <p className="mt-7 max-w-3xl text-base leading-7 text-black/55 md:text-lg">
                I have worked across software engineering, application
                development, product delivery, business requirements, and
                technology leadership. That range allows me to understand
                technology from both sides: the details required to build
                reliable systems and the broader decisions required to make
                technology useful to an organization.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#111111] px-6 py-20 text-[#f5f5f0] md:px-12 md:py-28 lg:px-16">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
                Let&apos;s work together
              </p>

              <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.04em] md:text-6xl">
                Building, transforming, or scaling your technology?
              </h2>
            </div>

            <Link
              href="https://calendly.com/jollofdudu/let-s-discuss-your-project"
              className="inline-flex w-fit items-center justify-center gap-3 rounded-full bg-[#00A9A5] px-6 py-4 text-sm font-semibold text-white transition-transform hover:-translate-y-1"
            >
              <span>Start a conversation</span>
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}