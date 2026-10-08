import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import SiteChrome from "../site-chrome";
import LearningTrackSelector from "./learning-track-selector";

export const metadata: Metadata = {
  title: "Technology Mentorship & Training",
  description:
    "Practical technology mentorship and professional training across software development, mobile apps, data analytics, cybersecurity, UI/UX, DevOps, systems engineering, robotics and technology leadership.",
};

const tracks = [
  {
    number: "01",
    shortTitle: "Web App",
    title: "Website Development",
    short:
      "Learn to design, build and deploy modern software applications through real projects.",
    topics:
      "HTML, CSS, JavaScript, TypeScript, React, Next.js, APIs, databases, authentication, Git and deployment.",
    timeline: "8–16 weeks",
    frequency: "2 sessions per week",
    total: "₦600,000",
    deposit: "₦180,000",
    monthly: "₦150,000 / month",
    results: [
      "Build responsive production-ready web applications",
      "Understand frontend, backend and API architecture",
      "Work with databases, authentication and external services",
      "Use Git and professional development workflows",
      "Deploy applications and understand production environments",
      "Complete a real portfolio project",
    ],
  },
  {
    number: "02",
    shortTitle: "Mobile App",
    title: "Mobile App Development",
    short:
      "Go from an idea to a working mobile application using practical development workflows.",
    topics:
      "Flutter, Dart, UI implementation, APIs, authentication, state management, databases, notifications and app deployment.",
    timeline: "10–16 weeks",
    frequency: "2 sessions per week",
    total: "₦750,000",
    deposit: "₦225,000",
    monthly: "₦190,000 / month",
    results: [
      "Plan and structure a mobile application",
      "Build Android and iOS applications with Flutter",
      "Connect mobile apps to APIs and databases",
      "Implement authentication and application state",
      "Debug and improve application performance",
      "Prepare applications for production and publishing",
    ],
  },
  {
    number: "03",
    shortTitle: "Analytics",
    title: "Data Analytics & Business Intelligence",
    short:
      "Turn raw data into useful insights, dashboards and decisions that businesses can act on.",
    topics:
      "Excel, SQL, Python, data cleaning, exploratory analysis, visualization, Power BI and business reporting.",
    timeline: "8–12 weeks",
    frequency: "2 sessions per week",
    total: "₦400,000",
    deposit: "₦120,000",
    monthly: "₦135,000 / month",
    results: [
      "Clean and prepare real-world datasets",
      "Query databases using SQL",
      "Analyse data using Excel and Python",
      "Create useful dashboards and visualizations",
      "Interpret business metrics and trends",
      "Present data-backed recommendations",
      "Complete a practical analytics portfolio project",
    ],
  },
  {
    number: "04",
    shortTitle: "Cyber",
    title: "Cybersecurity & Security Engineering",
    short:
      "Understand how modern systems are protected and learn practical defensive security techniques.",
    topics:
      "Networking, Linux, security principles, threat modelling, vulnerability assessment, IAM, secure development, monitoring and incident response.",
    timeline: "10–16 weeks",
    frequency: "2 sessions per week",
    total: "₦650,000",
    deposit: "₦195,000",
    monthly: "₦165,000 / month",
    results: [
      "Understand core cybersecurity concepts",
      "Work confidently with networking and Linux fundamentals",
      "Identify common application and infrastructure risks",
      "Apply secure development principles",
      "Understand identity and access management",
      "Create basic security monitoring and response workflows",
      "Perform ethical security exercises in authorized environments",
    ],
  },
  {
    number: "05",
    shortTitle: "UI/UX",
    title: "UI/UX & Product Design",
    short:
      "Learn how to turn user problems and product ideas into clear, usable digital experiences.",
    topics:
      "User research, information architecture, user flows, wireframes, Figma, prototyping, responsive design and design systems.",
    timeline: "6–10 weeks",
    frequency: "2 sessions per week",
    total: "₦350,000",
    deposit: "₦105,000",
    monthly: "₦120,000 / month",
    results: [
      "Understand how to approach real user problems",
      "Create user journeys and product flows",
      "Design wireframes and high-fidelity interfaces",
      "Work confidently with Figma",
      "Build reusable design systems",
      "Create interactive prototypes",
      "Prepare developer-ready product designs",
      "Complete a practical product design case study",
    ],
  },
  {
    number: "06",
    shortTitle: "DevOps",
    title: "DevOps, Cloud & Infrastructure",
    short:
      "Learn how modern software is deployed, monitored and maintained in production.",
    topics:
      "Linux, Git, CI/CD, Docker, cloud infrastructure, environments, deployment pipelines, monitoring, logging and infrastructure security.",
    timeline: "10–16 weeks",
    frequency: "2 sessions per week",
    total: "₦700,000",
    deposit: "₦210,000",
    monthly: "₦175,000 / month",
    results: [
      "Understand modern infrastructure concepts",
      "Work confidently with Linux environments",
      "Containerize applications with Docker",
      "Build automated deployment pipelines",
      "Deploy applications to cloud platforms",
      "Understand environments, secrets and configuration",
      "Implement monitoring and logging workflows",
      "Deploy a real application using a production workflow",
    ],
  },
  {
    number: "07",
    shortTitle: "Systems",
    title: "Systems Engineering & Architecture",
    short:
      "Learn to think beyond individual applications and design reliable technology systems.",
    topics:
      "Requirements, system architecture, APIs, databases, infrastructure, scalability, reliability, security and technology decisions.",
    timeline: "8–12 weeks",
    frequency: "2 sessions per week",
    total: "₦550,000",
    deposit: "₦165,000",
    monthly: "₦185,000 / month",
    results: [
      "Understand systems thinking and technical requirements",
      "Design software and system architectures",
      "Make informed technology-stack decisions",
      "Design APIs and data models",
      "Understand scalability and reliability",
      "Identify security and infrastructure considerations",
      "Document architecture and technical decisions",
      "Design the architecture for a real business system",
    ],
  },
  {
    number: "08",
    shortTitle: "Robotics",
    title: "Robotics, IoT & Embedded Systems",
    short:
      "Explore how software, electronics and physical systems work together to create intelligent devices.",
    topics:
      "Arduino, ESP32, sensors, actuators, embedded programming, electronics, IoT, automation and device communication.",
    timeline: "10–16 weeks",
    frequency: "2 sessions per week",
    total: "₦650,000",
    deposit: "₦195,000",
    monthly: "₦165,000 / month",
    results: [
      "Understand basic electronics and embedded systems",
      "Program microcontrollers and development boards",
      "Work with sensors and actuators",
      "Build connected IoT devices",
      "Understand device-to-device communication",
      "Create basic automation systems",
      "Connect physical devices to software",
      "Build a working robotics or IoT prototype",
    ],
  },
  {
    number: "09",
    shortTitle: "Leadership",
    title: "Technology Leadership & IT Management",
    short:
      "Develop the thinking required to lead technology teams, ICT functions and digital transformation initiatives.",
    topics:
      "IT strategy, technology roadmaps, ICT operations, governance, budgets, teams, vendors, project management, cybersecurity governance and digital transformation.",
    timeline: "6–10 weeks",
    frequency: "1–2 sessions per week",
    total: "₦450,000",
    deposit: "₦135,000",
    monthly: "₦150,000 / month",
    results: [
      "Develop technology strategies aligned with business goals",
      "Structure and manage technology teams",
      "Create technology roadmaps and priorities",
      "Understand ICT operations and governance",
      "Manage technology projects and vendors",
      "Plan technology budgets and resources",
      "Identify technology risks and controls",
      "Think through digital transformation initiatives",
      "Develop an executive-level technology plan",
    ],
  },
];

const outcomes = [
  {
    number: "01",
    title: "Knowledge",
    description:
      "Understand the concepts behind the tools instead of simply copying tutorials.",
  },
  {
    number: "02",
    title: "Practical Experience",
    description:
      "Work through realistic problems and scenarios similar to what you encounter professionally.",
  },
  {
    number: "03",
    title: "Portfolio",
    description:
      "Build projects and case studies that demonstrate what you can actually do.",
  },
  {
    number: "04",
    title: "Professional Workflow",
    description:
      "Learn how professionals plan, build, document, test, deploy and review their work.",
  },
  {
    number: "05",
    title: "Confidence",
    description:
      "Move from following instructions to understanding how to solve problems independently.",
  },
  {
    number: "06",
    title: "Direction",
    description:
      "Understand what to learn next and how to turn your skills into a career or professional opportunity.",
  },
];

const journey = [
  [
    "01",
    "Discover",
    "Define your current level, goals and the outcome you want to achieve.",
  ],
  [
    "02",
    "Learn",
    "Understand the concepts, tools and professional practices required.",
  ],
  [
    "03",
    "Build",
    "Apply what you learn to a practical project or real-world problem.",
  ],
  [
    "04",
    "Review",
    "Analyse the work, identify mistakes and improve your approach.",
  ],
  [
    "05",
    "Deploy",
    "Where applicable, take the project into a usable or production environment.",
  ],
  [
    "06",
    "Next Step",
    "Leave with a clear plan for continued learning, work or career progression.",
  ],
];

const audiences = [
  [
    "Aspiring professionals",
    "Build practical skills and projects that can help you move into technology.",
  ],
  [
    "Developers & designers",
    "Strengthen your existing skills, solve difficult problems and improve your workflow.",
  ],
  [
    "Career switchers",
    "Create a structured path into a new technology discipline without getting lost in endless tutorials.",
  ],
  [
    "Founders",
    "Understand technology well enough to make better product and technical decisions.",
  ],
  [
    "Technology professionals",
    "Develop deeper expertise across architecture, infrastructure, security or data.",
  ],
  [
    "Organizations",
    "Train teams through practical workshops designed around your technology goals.",
  ],
];



export default function LearnPage() {
  return (
    <SiteChrome learningRegistration projectRequestLauncher={false}>
      <main className="min-h-screen bg-[#dce9e3] text-[#111111]">
        {/* HERO */}
        

        

        {/* LEARNING TRACKS */}
        <section
          id="tracks"
          className="bg-[#3e3b3b] px-6 pb-24 text-[#f5f5f0] md:px-12 md:pb-32 lg:px-16"
        >
          <div className="mb-12 border-t border-white/15 pt-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#78d8ca]">
              Learning tracks
            </p>

            <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <h2 className="max-w-4xl text-3xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-5xl">
                Choose what you want to build your capability in.
              </h2>

              {/* <p className="max-w-sm text-md leading-6 text-[#5fe825]">
                Every track can be adapted to your current level, goals and
                project. Beginner, intermediate and professional learning
                paths are available.
              </p> */}
            </div>
          </div>

          <LearningTrackSelector tracks={tracks} />

          {/* PROGRAM FEE NOTE */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="max-w-4xl text-xs leading-6 text-white/40">
              Program fees cover mentorship and training sessions. Hardware,
              software subscriptions, certification examination fees,
              cloud usage and other third-party services are separate where
              applicable.
            </p>
          </div>
        </section>

        {/* OUTCOMES */}
        <section className="bg-[#e8eee9] px-6 py-24 md:px-12 md:py-32 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#078f8a]">
                What you leave with
              </p>

              <h2 className="mt-5 max-w-md text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-6xl">
                You don&apos;t just finish lessons.
              </h2>
            </div>

            <div className="border-t border-black/15">
              <p className="max-w-2xl py-7 text-lg leading-8 text-black/60">
                The goal is to leave every learning engagement with something
                useful: a stronger understanding, practical experience, a
                project, a clearer direction or a professional workflow you
                can continue using.
              </p>

              <div className="grid border-t border-black/15 sm:grid-cols-2">
                {outcomes.map((outcome) => (
                  <article
                    key={outcome.number}
                    className="border-b border-black/15 py-7 sm:px-5 sm:first:pl-0"
                  >
                    <span className="text-xs text-black/35">
                      {outcome.number}
                    </span>

                    <h3 className="mt-4 text-2xl font-semibold">
                      {outcome.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-black/55">
                      {outcome.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LEARNING JOURNEY */}
        <section className="bg-[#f5f5f0] px-6 py-24 md:px-12 md:py-32 lg:px-16">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#078f8a]">
              The learning journey
            </p>

            <h2 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl">
              From understanding the problem to building the solution.
            </h2>
          </div>

          <div className="grid border-y border-black/15 md:grid-cols-3">
            {journey.map(([number, title, description]) => (
              <article
                key={number}
                className="border-b border-black/15 py-7 md:border-r md:px-7 md:last:border-r-0 lg:py-9"
              >
                <span className="text-xs text-black/35">{number}</span>

                <h3 className="mt-6 text-2xl font-semibold">{title}</h3>

                <p className="mt-3 max-w-sm text-sm leading-6 text-black/55">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* WHO THIS IS FOR */}
        <section className="bg-[#163d34] px-6 py-24 text-[#f5f5f0] md:px-12 md:py-32 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#78d8ca]">
                Who this is for
              </p>

              <h2 className="mt-5 max-w-md text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-6xl">
                Different goals. One practical approach.
              </h2>
            </div>

            <div className="grid  border-t border-white/15 sm:grid-cols-2">
              {audiences.map(([title, description]) => (
                <article
                  key={title}
                  className="border-b border-white/15 py-7 sm:px-6 sm:first:pl-0"
                >
                  <h3 className="text-xl font-semibold">{title}</h3>

                  <p className="mt-3 text-sm leading-6 text-white/55">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CORPORATE TRAINING */}
        <section className="bg-[#d7f36a] px-6 py-20 md:px-12 md:py-24 lg:px-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#163d34]">
                Corporate technology training
              </p>

              <h2 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl">
                Train your team to work better with technology.
              </h2>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-black/60">
                I also work with organizations that want practical technology
                training for their teams. Sessions can be designed around
                software engineering, cybersecurity, data analytics, UI/UX,
                DevOps, cloud, project management, technology leadership and
                digital transformation.
              </p>
            </div>

            <Link
              href="mailto:jollofdudu@gmail.com?subject=Corporate%20Technology%20Training"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#111111] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#163d34]"
            >
              <span>Discuss team training</span>
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 border-t border-black/15 pt-7">
            <p className="max-w-3xl text-sm leading-6 text-black/55">
              Corporate training is customized according to team size,
              objectives, duration, delivery format and the technology
              discipline involved.
            </p>
          </div>
        </section>

        {/* ENGAGEMENT OPTIONS */}
        <section className="bg-[#f5f5f0] px-6 py-24 md:px-12 md:py-32 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#078f8a]">
                Engagement options
              </p>

              <h2 className="mt-5 max-w-md text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-6xl">
                Choose the level of support you need.
              </h2>
            </div>

            <div className="border-t border-black/15">
              <article className="border-b border-black/15 py-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#078f8a]">
                      01 / Private session
                    </p>

                    <h3 className="mt-3 text-3xl font-semibold">
                      Focused one-to-one mentorship
                    </h3>
                  </div>

                  <p className="text-xl font-semibold">From ₦40,000</p>
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-black/55">
                  A focused 90-minute session around a specific problem,
                  concept, project or career goal.
                </p>
              </article>

              <article className="border-b border-black/15 py-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#078f8a]">
                      02 / Mentorship program
                    </p>

                    <h3 className="mt-3 text-3xl font-semibold">
                      Structured multi-week learning
                    </h3>
                  </div>

                  <p className="text-xl font-semibold">₦300,000+</p>
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-black/55">
                  A structured learning path with multiple sessions, practical
                  exercises, project work, reviews and a defined outcome.
                </p>
              </article>

              <article className="border-b border-black/15 py-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#078f8a]">
                      03 / Project mentorship
                    </p>

                    <h3 className="mt-3 text-3xl font-semibold">
                      Build something real
                    </h3>
                  </div>

                  <p className="text-xl font-semibold">₦500,000+</p>
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-black/55">
                  Work through a real project from planning and architecture
                  through implementation, review and deployment.
                </p>
              </article>

              <article className="py-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#078f8a]">
                      04 / Corporate training
                    </p>

                    <h3 className="mt-3 text-3xl font-semibold">
                      Training for technology teams
                    </h3>
                  </div>

                  <p className="text-xl font-semibold">Custom</p>
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-black/55">
                  Customized workshops and training programs based on team size,
                  objectives, duration and technology requirements.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-[#111111] px-6 py-20 text-[#f5f5f0] md:px-12 md:py-28 lg:px-16">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#78d8ca]">
                Ready to learn?
              </p>

              <h2 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl">
                Build the skill. Build the project. Build the confidence.
              </h2>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
                Tell me what you want to learn, where you are currently and
                what you want to achieve. We can define the right learning
                path together.
              </p>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}