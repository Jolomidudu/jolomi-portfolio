import type { Metadata } from "next";
import SiteChrome from "../site-chrome";

export const metadata: Metadata = {
  title: "FAQ | Jolomi Dudu",
  description: "Answers to common questions about working with Jolomi Dudu.",
};

const questions = [
  ["What kind of work do you take on?", "I work on websites, web apps, mobile apps, product design, analytics and practical technology consulting."],
  ["How does a project begin?", "We start with a short discovery conversation, clarify the goal and agree on a written scope, timeline and payment plan."],
  ["Do you work with teams outside Nigeria?", "Yes. Projects can be handled remotely with clear communication, shared documentation and agreed check-in points."],
  ["How much does a project cost?", "Services have starting prices on the Services page. The final quote depends on scope, complexity and delivery timeline."],
  ["Can you maintain an existing product?", "Yes. I can improve, maintain or extend an existing website, app or backend system after reviewing the current setup."],
];

export default function FAQPage() {
  return (
    <SiteChrome>
      <main className="min-h-screen bg-[#f5f5f0] px-6 pb-24 pt-20 text-[#111111] md:px-12 md:pb-32 md:pt-28 lg:px-16">
        <div className="mx-auto max-w-5xl"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">FAQ</p><h1 className="mt-6 max-w-3xl text-6xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-8xl">Clear answers before we begin.</h1><div className="mt-16 divide-y divide-black/15 border-y border-black/15">{questions.map(([question, answer]) => <article key={question} className="py-8"><h2 className="text-2xl font-semibold">{question}</h2><p className="mt-4 max-w-2xl leading-7 text-black/60">{answer}</p></article>)}</div></div>
      </main>
    </SiteChrome>
  );
}
