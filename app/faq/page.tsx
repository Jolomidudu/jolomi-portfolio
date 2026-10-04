import type { Metadata } from "next";
import Link from "next/link";
import SiteChrome from "../site-chrome";

import FAQCategorySelector from "./faq-category-selector";

export const metadata: Metadata = {
  title: "FAQS",
  description:
    "Answers to common questions about working with Jolomi Dudu across technology leadership, software engineering, consulting, digital transformation, product development and technology training.",
};

const categories = [
  {
    label: "Working together",
    questions: [
      [
        "What kind of work do you take on?",
        "I work across technology leadership, software engineering, technology consulting and digital transformation. This includes software and web applications, mobile applications, backend systems, systems architecture, data and analytics, cloud and infrastructure, technology strategy, technical project leadership and technology training.",
      ],
      [
        "Who do you typically work with?",
        "I work with businesses, founders, startups, established organizations, technology teams and individuals who need experienced technical direction or execution. The engagement can range from building a new product to improving an existing technology function or helping an organization make better technology decisions.",
      ],
      [
        "Can you work as a technology consultant or technical advisor?",
        "Yes. Not every engagement requires software development. I can work with leadership teams to assess technology needs, review existing systems, define technology roadmaps, evaluate technical decisions, identify risks and recommend practical improvements.",
      ],
      [
        "Can you take responsibility for a technology project from beginning to end?",
        "Yes. I can work across discovery, requirements, planning, architecture, product and technical decisions, development, team coordination, testing, deployment and post-launch improvement. The exact level of involvement is defined around the organization's needs.",
      ],
    ],
  },
  {
    label: "Technology & engineering",
    questions: [
      [
        "What software and technology projects can you build?",
        "I can work on business websites, web applications, mobile applications, APIs, backend systems, dashboards, internal business platforms, customer-facing products, integrations and other custom digital systems.",
      ],
      [
        "Can you build a product from an idea?",
        "Yes. I can help take an idea from concept and requirements through product definition, user experience, technical architecture, development, testing and deployment. Where appropriate, I can also help determine what should be built first and what can wait until later.",
      ],
      [
        "Can you work on an existing application or system?",
        "Yes. I can review an existing codebase or technology environment, understand its architecture and identify opportunities for maintenance, modernization, performance improvements, security improvements, new features or a broader technical transformation.",
      ],
      [
        "Can you review our existing technology architecture?",
        "Yes. A technical or architecture review can cover application structure, APIs, databases, infrastructure, security considerations, scalability, deployment processes, technical debt and operational risks. The outcome can include findings, priorities and recommendations for improvement.",
      ],
      [
        "Can you help us choose the right technology stack?",
        "Yes. Technology choices should follow the product requirements, business objectives, team capabilities, budget, scalability requirements and operational needs. I can help evaluate options and make technology decisions based on those factors rather than simply choosing whatever technology is currently popular.",
      ],
      [
        "Can you help with cloud, DevOps and infrastructure?",
        "Yes. I can work on deployment architecture, cloud environments, CI/CD, Docker, application hosting, infrastructure configuration, monitoring, logging and production workflows. The specific approach depends on the system and its operational requirements.",
      ],
    ],
  },
  {
    label: "Technology leadership & consulting",
    questions: [
      [
        "Do you provide technology leadership services?",
        "Yes. This is an important part of my work. I can support organizations with technology strategy, ICT planning, technical decision-making, team structure, technology roadmaps, project delivery, vendor coordination, technology governance and digital transformation.",
      ],
      [
        "Can you help establish or improve an ICT department?",
        "Yes. This can include reviewing the current technology environment, defining responsibilities, identifying required roles, establishing processes, improving infrastructure and security practices, introducing documentation and developing a technology roadmap aligned with organizational objectives.",
      ],
      [
        "Can you lead a technology or engineering team?",
        "Yes. I have experience working with engineering teams and can contribute to technical direction, planning, architecture, delivery processes, mentoring, code quality, prioritization and coordination between technical and business stakeholders.",
      ],
      [
        "Can you advise senior management or business leaders on technology?",
        "Yes. I can translate technical issues into business considerations and help leadership teams understand technology options, risks, costs, opportunities and priorities so that technology decisions support broader organizational goals.",
      ],
      [
        "Can you help with digital transformation?",
        "Yes. Digital transformation can involve much more than introducing new software. I can help organizations examine their processes, systems, data, infrastructure, teams and technology capabilities and develop a practical roadmap for improving how technology supports the organization.",
      ],
    ],
  },
  {
    label: "Projects & process",
    questions: [
      [
        "How does a project begin?",
        "We begin with a discovery conversation to understand the organization, problem, objectives, users, existing technology and desired outcome. From there, I define the recommended scope, approach, deliverables, timeline and commercial terms before implementation begins.",
      ],
      [
        "Do you provide a written proposal?",
        "Yes. For appropriate projects, the engagement is documented with the relevant scope, objectives, deliverables, assumptions, timeline, responsibilities, pricing and payment terms. This gives both sides a clear understanding of what is being delivered.",
      ],
      [
        "How long does a project take?",
        "There is no single timeline because project complexity varies significantly. A small website may take considerably less time than a multi-user business platform, mobile application or enterprise technology initiative. After discovery, I provide a realistic delivery estimate based on the actual scope.",
      ],
      [
        "Can the scope change during a project?",
        "Yes, but changes are handled deliberately. If a new requirement affects the agreed scope, timeline or resources, it is reviewed and documented before additional work begins. This helps prevent unexpected costs and delivery issues.",
      ],
      [
        "Do you work alone or with a team?",
        "Both are possible. I can personally lead and deliver selected engagements, or work with a wider engineering, design or technology team depending on the size and complexity of the project.",
      ],
      [
        "How involved do I need to be during the project?",
        "The level of involvement depends on the engagement. Most projects require periodic feedback, access to relevant information and timely decisions from the client or designated stakeholders. I aim to keep the process structured so that you are involved where your input is most valuable.",
      ],
    ],
  },
  {
    label: "Pricing & payments",
    questions: [
      [
        "How much does a project cost?",
        "Project pricing depends on the scope, complexity, technology requirements, number of features, integrations, team involvement and delivery timeline. My Services page provides starting points for selected services, while a specific project is priced after understanding the actual requirements.",
      ],
      [
        "Do you charge hourly?",
        "Most larger projects are priced around the scope and expected outcome rather than simply selling hours. For consulting, advisory work, technical reviews or focused sessions, a time-based engagement may be more appropriate.",
      ],
      [
        "Do you require a deposit?",
        "Yes. Project engagements generally require an agreed initial payment before work begins. The exact payment structure depends on the size and nature of the engagement and is documented in the proposal or agreement.",
      ],
      [
        "Can projects be paid for in installments?",
        "Yes. Larger engagements can be structured around milestones or agreed payment stages. The payment schedule is established before the project begins so that expectations are clear for everyone.",
      ],
      [
        "Are third-party costs included in your project fee?",
        "Not automatically. Services such as cloud hosting, domains, paid software, APIs, email services, app-store fees, certificates, hardware, external subscriptions and other third-party services may have separate costs where applicable. These are identified during project planning.",
      ],
    ],
  },
  {
    label: "Existing products & support",
    questions: [
      [
        "Can you maintain an existing product after launch?",
        "Yes. I can provide ongoing technical support, maintenance, improvements, feature development, performance work, security reviews and infrastructure support depending on the needs of the product.",
      ],
      [
        "Can you take over a project built by another developer?",
        "Yes. The first step is usually a technical assessment. I review the codebase, architecture, infrastructure, documentation and known issues so that I can understand the current state before recommending the best path forward.",
      ],
      [
        "Can you fix a broken or poorly built application?",
        "Yes, subject to the condition of the existing system. I can investigate technical issues, identify underlying causes and recommend whether the appropriate solution is targeted fixes, refactoring, modernization or a larger rebuild.",
      ],
      [
        "Do you provide post-launch support?",
        "Yes. Support can be structured around maintenance, feature development, monitoring, technical assistance or an ongoing technology partnership. The appropriate arrangement depends on the product and the level of support required.",
      ],
    ],
  },
  {
    label: "International clients",
    questions: [
      [
        "Do you work with clients outside Nigeria?",
        "Yes. I work remotely and can collaborate with clients, teams and organizations in other countries. Projects are structured around clear communication, documentation, agreed working arrangements and defined delivery milestones.",
      ],
      [
        "Can international clients pay in foreign currency?",
        "Payment arrangements can be discussed based on the client's location, currency and the nature of the engagement. International clients can enquire for the appropriate commercial arrangement.",
      ],
      [
        "Can you work with an existing international technology team?",
        "Yes. I can join an existing team as an engineer, technical lead, consultant, architect, project contributor or technology advisor depending on the requirements.",
      ],
      [
        "How do you handle communication across different time zones?",
        "I use a combination of scheduled meetings, written documentation, project management tools and asynchronous communication. The working arrangement is agreed at the beginning of the engagement.",
      ],
    ],
  },
  {
    label: "Confidentiality & ownership",
    questions: [
      [
        "Will my business information remain confidential?",
        "Client and project information is treated professionally and confidentially. Where an engagement requires formal confidentiality obligations, an NDA or appropriate confidentiality agreement can be put in place before sensitive information is shared.",
      ],
      [
        "Who owns the software or product after the project?",
        "Ownership and intellectual property terms are agreed as part of the engagement. The proposal or contract will clearly define what is transferred to the client and what, if anything, remains the responsibility of the service provider.",
      ],
      [
        "Can you sign an NDA?",
        "Yes. If your organization requires an NDA before discussing a project or sharing confidential technical or business information, that can be arranged.",
      ],
    ],
  },
  {
    label: "Mentorship & training",
    questions: [
      [
        "Do you offer technology mentorship?",
        "Yes. I offer practical mentorship across software development, mobile app development, data analytics, cybersecurity, UI/UX, DevOps, systems engineering, robotics and technology leadership.",
      ],
      [
        "Is the training beginner-friendly?",
        "Yes. Learning programs can be adapted to your current level. The goal is not simply to teach tools but to help you understand how technology is used to solve real problems.",
      ],
      [
        "Do you offer corporate technology training?",
        "Yes. Organizations can engage me for customized technology training and workshops for teams. Topics can include software engineering, cybersecurity, data analytics, UI/UX, DevOps, cloud, project management, technology leadership and digital transformation.",
      ],
      [
        "Will I build a project during mentorship?",
        "Where appropriate, yes. Practical project work is an important part of the learning approach. The specific project depends on the learning track, your experience and the outcome you want to achieve.",
      ],
    ],
  },
  {
    label: "Starting an enquiry",
    questions: [
      [
        "What should I include when making an enquiry?",
        "Tell me what you are trying to achieve, the problem you are solving, who the users are, what you already have, your preferred timeline and any important technical or business requirements. You do not need to have everything figured out before contacting me.",
      ],
      [
        "Can I contact you if I only have an idea?",
        "Absolutely. You do not need a completed specification before starting a conversation. If you have an idea, business problem or technology challenge, I can help clarify the requirements and determine what should happen next.",
      ],
      [
        "What happens after I send an enquiry?",
        "I review the information provided and, where appropriate, we arrange an initial conversation. We then clarify the objectives, requirements and possible approach before deciding whether to proceed with a formal proposal or engagement.",
      ],
      [
        "How do I start a conversation?",
        "Use the contact or project enquiry option on this website and provide a short description of what you need. For mentorship and training, you can also use the learning enquiry option.",
      ],
    ],
  },
];

export default function FAQPage() {
  return (
    <SiteChrome>
      <main className="min-h-screen bg-[#f5f5f0] text-[#111111]">
        {/* HERO */}
        <section className="px-6 pb-20 pt-20 md:px-12 md:pb-28 md:pt-28 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
              Frequently asked questions
            </p>

            <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <h1 className="max-w-5xl text-4xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-6xl">
                Clear answers before we begin.
              </h1>

              <div className="max-w-md">
                <p className="text-lg leading-8 text-black/60">
                  Whether you need a technology leader, software engineer,
                  technical consultant, product partner or mentor, here are
                  answers to the questions people usually ask before working
                  together.
                </p>

                <Link
                  href="/contact"
                  className="mt-7 inline-flex rounded-full bg-[#111111] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#00A9A5]"
                >
                  Make an enquiry ↗
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ CONTENT */}
        <FAQCategorySelector categories={categories} />

        {/* CONSULTING CTA */}
        <section className="bg-[#163d34] px-6 py-20 text-[#f5f5f0] md:px-12 md:py-28 lg:px-16">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#78d8ca]">
                Still have a question?
              </p>

              <h2 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl">
                Let&apos;s talk about what you&apos;re trying to build.
              </h2>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/55">
                You do not need to have every technical detail figured out
                before reaching out. Start with the problem, objective or idea
                and we can determine the right next step together.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex min-h-14 shrink-0 items-center justify-between gap-8 bg-[#d7f36a] px-6 py-4 text-sm font-semibold text-[#163d34] transition-colors hover:bg-white"
            >
              Start a conversation
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}