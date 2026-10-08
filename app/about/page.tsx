import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SiteChrome from "../site-chrome";

export const metadata: Metadata = {
  title: "Who i am",
  description:
    "Meet Jolomi Dudu, a technology leader, software engineer and technology consultant working across technology strategy, ICT leadership, software engineering and digital transformation.",
};

const highlights = [
  { value: "10+", label: "Years in technology" },
  { value: "145+", label: "Products & projects" },
  { value: "6+", label: "Technology disciplines" },
  { value: "40+", label: "Professionals impacted" },
];

const strengths = [
  {
    number: "01",
    title: "I connect technology with organizational goals.",
    description:
      "I look beyond individual systems and features to understand the people, processes and objectives technology needs to support.",
  },
  {
    number: "02",
    title: "I work across strategy and execution.",
    description:
      "From technology roadmaps and architecture to software delivery and implementation, I understand how strategic decisions translate into real systems.",
  },
  {
    number: "03",
    title: "I lead people, teams and technology initiatives.",
    description:
      "I believe strong technology outcomes come from the right people, clear direction and disciplined execution. I work with teams to turn complex objectives into practical results.",
  },
  {
    number: "04",
    title: "I bring technical depth to leadership decisions.",
    description:
      "My engineering background allows me to engage deeply with architecture, software, infrastructure and technology decisions while keeping the broader organizational picture in view.",
  },
];

const education = [
  // {
  //   period: "1996 - 2002",
  //   title: "Primary School",
  //   institution: "Corona School Gbagada, \Lagos, Nigeria",
  //   description:
  //     "A primary school in the hearts of gbagada lagos state",
  // },
  // {
  //   period: "2002 - 2005",
  //   title: "Primary School Leaving Certificate",
  //   institution: "(SIS) Salvation International School, \Lagos, Nigeria",
  //   description:
  //     "A primary school in ikeja GRA Lagos state",
  // },
  // {
  //   period: "2005 - 2006",
  //   title: "JSC (Junior Secondary School)",
  //   institution: "RISS (Redeemers international Secondary School) , \Asaba, Delta State, Nigeria",
  //   description:
  //     "A secondary school in isara remo ogun state where graduated as a social science student with honours",
  // },
  // {
  //   period: "2006 - 2008",
  //   title: "JSCE/SSC (Junior Secondary Certificate Examination)",
  //   institution: "Graceville College, \Asaba, Delta State, Nigeria",
  //   description:
  //     "A secondary school in isara remo ogun state where graduated as a social science student with honours",
  // },
  // {
  //   period: "2008 - 2010",
  //   title: "SSCE (Senior Secondary Certificate Examination)",
  //   institution: "Straitgate College, \Ogun State, Nigeria",
  //   description:
  //     "A secondary school in isara remo ogun state where graduated as a social science student with honours",
  // },
  {
    period: "2012 - 2015",
    title: "Bachelor's Degree in Information Technology",
    institution: "Monash University, \johannesburg, South Africa",
    description:
      "Academic foundation in information technology, covering software development, database management, computer systems, networking, information systems, and technology-driven problem solving.",
  },
  {
    period: "2015 - 2018",
    title: "Bachelor's Degree in Economics",
    institution: "Benson Idahosa University, Benin City, Nigeria",
    description:
      "Academic foundation in economics, covering economic theory, financial analysis, business principles, quantitative methods, research, and data-driven decision-making.",
  },

  // {
  //   period: "2020 - 2022",
  //   title: "Master's Degree in Business Administration (MBA)",
  //   institution: "Middlesex University, London, United Kingdom",
  //   description:
  //     "Advanced business education covering strategic management, leadership, finance, marketing, operations, entrepreneurship, and data-driven decision-making, with a focus on solving complex business challenges.",
  // },
];

const certifications = [
  {
    year: "2022",
    title: "Comptia Security+",
    issuer: "Comptia",
  },
  {
    year: "2016",
    title: "Google Digital Marketing Certificate",
    issuer: "Google",
  },
  {
    year: "2024",
    title: "Data Analytics Certificate",
    issuer: "Udemy",
  },
];

const awards = [
  {
    year: "2022",
    title: "Google Student Ambassador",
    organization: "Google",
  },
  {
    year: "2017",
    title: "Technology Leadership Award",
    organization: "Cross Road",
  },
];

const selectedWork = [
  {
    number: "01",
    name: "Festyvibe",
    category: "Event · Digital platform",
    description:
      "A digital platform for organizing and managing events, designed to make the customer journey feel considered from the first visit.",
  },
  {
    number: "02",
    name: "Kids College",
    category: "Education · Management platform",
    description:
      "A school management platform that brings administrators, teachers, students and parents into one connected experience.",
  },
  {
    number: "03",
    name: "BudgetAll",
    category: "Finance · Mobile platform",
    description:
      "A mobile platform for managing personal finances and budgeting, designed to make financial planning accessible and engaging.",
  },
];

export default function AboutPage() {
  return (
    <SiteChrome headerMode="about">
      <main className="bg-[#f5f5f0] text-[#111111]">
        {/* HERO */}
        <section>
          
          <div
            className="relative px-6 pt-[122px] text-white md:px-12 md:pt-24 lg:px-16"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(13, 25, 25, 0.82), rgba(13, 25, 25, 0.34)), url('/office.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "top center",
            }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em]">
              GET TO KNOW ME
            </p>
            <br></br>
            <br></br>

            <hr className="border-white/70"></hr>
          </div>

          <div className="px-6 pb-20 pt-8 md:px-12 md:pb-28 md:pt-8 lg:px-16">
            <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-16">
            <div>
              <h1 className="max-w-4xl text-2xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-4xl lg:text-4xl">
                <span className="font-semibold text-[#4f4f4f]">Hello & Welcome,</span>
                
                <br></br>
                <br></br> 

                <span className="font-semibold text-[#362727]">I'm Oritsejolomi Dudu (Itsekiri by tribe, From Warri, Delta State, Nigeria) </span>

                <br></br>
                <br></br>
                
                
                
                <span className="font-semibold text-[#4f4f4f]">I lead technology, build digital systems, and turn ideas into reality</span>
                
              </h1>

              

              {/* <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-[#6c1e1e]/85">
                I&apos;m Oritsejolomi Dudu, a technology leader, software
                engineer and technology consultant. I work across technology
                strategy, ICT leadership, software engineering and digital
                transformation — helping organizations build better systems,
                teams and technology capabilities.
              </p> */}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="inline-flex min-h-12 items-center bg-[#163d34] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#008c87]"
                >
                  VIEW SERVICES
                  <ArrowUpRight aria-hidden="true" className="ml-3 h-4 w-4" />
                </Link>

                <Link
                  href="/projects"
                  className="inline-flex min-h-12 items-center border border-black/20 px-5 py-3 text-sm font-semibold transition-colors hover:border-[#008c87] hover:text-[#008c87]"
                >
                  VIEW CATALOG
                  <ArrowUpRight aria-hidden="true" className="ml-3 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative mx-auto aspect-[4/4.5] w-full max-w-md overflow-hidden bg-[#d7dfd3]">
              <Image
                src="/images/about.jpg"
                alt="Jolomi Dudu, technology leader and software engineer"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 40vw"
                className="object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[#12211f]/80 to-transparent px-5 pb-5 pt-16 text-white">
                <span className="text-sm font-medium">Jolomi Dudu</span>

                <span className="text-xs uppercase tracking-[0.15em] text-white/75">
                  TECHNOLOGY LEADER / ENGINEER
                </span>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section className="bg-[#163d34] px-6 py-12 text-[#f8f7ef] md:px-12 md:py-16 lg:px-16">
          <div className="grid grid-cols-2 gap-y-10 border-y border-white/20 py-8 md:grid-cols-4 md:gap-8">
            {highlights.map((highlight) => (
              <div key={highlight.label}>
                <p className="text-4xl font-semibold tracking-tight text-[#d7f36a] md:text-5xl">
                  {highlight.value}
                </p>

                <p className="mt-2 max-w-36 text-xs leading-5 text-white/65 sm:text-sm">
                  {highlight.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW I LEAD TECHNOLOGY */}
        <section className="px-6 py-20 md:px-12 md:py-28 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#008c87]">
                How I Lead Technology
              </p>

              <h2 className="mt-5 max-w-md text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-5xl">
                I think beyond the technology itself.
              </h2>
            </div>

            <div className="border-t border-black/15">
              {strengths.map((strength) => (
                <article
                  key={strength.number}
                  className="grid gap-4 border-b border-black/15 py-6 sm:grid-cols-[48px_1fr] sm:gap-6"
                >
                  <span className="pt-1 text-xs text-black/40">
                    {strength.number}
                  </span>

                  <div>
                    <h3 className="text-xl font-semibold leading-snug">
                      {strength.title}
                    </h3>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
                      {strength.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* EDUCATION & CREDENTIALS */}
        <section className="border-t border-black/10 bg-[#e8eadf] px-6 py-20 md:px-12 md:py-28 lg:px-16">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#008c87]">
              Education & Credentials
            </p>

            <h2 className="mt-4 max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-5xl lg:text-6xl">
              The foundation behind
              <span className="text-[#008c87]"> the work.</span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-black/55">
              Academic training, professional certifications and recognition
              that support my work across technology, engineering,
              leadership and consulting.
            </p>
          </div>

          <div className="grid gap-0 border-y border-black/15 lg:grid-cols-3 lg:divide-x lg:divide-black/15">
            {/* EDUCATION */}
            <div className="py-8 lg:pr-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#008c87]">
                Education
              </p>

              <div className="mt-8 space-y-8">
                {education.map((item) => (
                  <article key={`${item.title}-${item.institution}`}>
                    <p className="text-xs text-black/40">{item.period}</p>

                    <h3 className="mt-3 text-1xl font-semibold leading-tight">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm font-medium text-[#008c87]">
                      {item.institution}
                    </p>

                    <p className="mt-4 text-sm leading-6 text-black/55">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            {/* CERTIFICATIONS */}
            <div className="border-t border-black/15 py-8 lg:border-t-0 lg:px-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#008c87]">
                Certifications
              </p>

              <div className="mt-8 divide-y divide-black/10">
                {certifications.map((certification) => (
                  <article
                    key={`${certification.title}-${certification.issuer}`}
                    className="py-5 first:pt-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-semibold leading-snug">
                        {certification.title}
                      </h3>

                      <span className="shrink-0 text-xs text-black/40">
                        {certification.year}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-black/55">
                      {certification.issuer}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            {/* AWARDS */}
            <div className="border-t border-black/15 py-8 lg:border-t-0 lg:pl-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#008c87]">
                Awards & Recognition
              </p>

              <div className="mt-8 divide-y divide-black/10">
                {awards.map((award) => (
                  <article
                    key={`${award.title}-${award.organization}`}
                    className="py-5 first:pt-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-semibold leading-snug">
                        {award.title}
                      </h3>

                      <span className="shrink-0 text-xs text-black/40">
                        {award.year}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-black/55">
                      {award.organization}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SELECTED WORK */}
        <section className="border-t border-black/10 bg-[#f5f5f0] px-6 py-20 md:px-12 md:py-24 lg:px-16">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#008c87]">
                Selected Work
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                Different challenges. Technology that delivers.
              </h2>
            </div>

            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-semibold hover:text-[#008c87]"
            >
              <span>MY PROJECT CATALOG</span>
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-0 border-y border-black/15 md:grid-cols-3 md:divide-x md:divide-black/15">
            {selectedWork.map((project) => (
              <article
                key={project.number}
                className="py-6 md:px-6 md:first:pl-0 md:last:pr-0"
              >
                <p className="text-sm text-black/40">
                  {project.number} / {project.category}
                </p>

                <h3 className="mt-5 text-2xl text-[brown] font-semibold">
                  {project.name}
                </h3>

                <p className="mt-3 text-md leading-6 text-green/90">
                  {project.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#111111] px-6 py-16 text-[#f5f5f0] md:px-12 md:py-20 lg:px-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78d8ca]">
                Building, transforming or scaling your technology?
              </p>

              <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] md:text-5xl">
                Let&apos;s start a conversation.
              </h2>
            </div>

            <Link
              href="https://calendly.com/jollofdudu/let-s-discuss-your-project"
              className="inline-flex min-h-12 items-center justify-between gap-3 bg-[#d7f36a] px-5 py-3 text-sm font-semibold text-[#163d34] transition-colors hover:bg-white"
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