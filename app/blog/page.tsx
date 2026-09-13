import type { Metadata } from "next";
import SiteChrome from "../site-chrome";

export const metadata: Metadata = {
  title: "Journal | Jolomi Dudu",
  description: "Notes on business, technology, lifestyle and finance from Jolomi Dudu.",
};

const posts = [
  ["Technology", "How to choose the right first version of a digital product", "A practical way to decide what belongs in your MVP before time and budget disappear."],
  ["Business", "The difference between a website and a business asset", "A website should do more than exist. It should answer questions, build trust and create a next step."],
  ["Finance", "What to budget for when building software", "The cost conversation gets easier when design, development, maintenance and growth are separated."],
  ["Lifestyle", "Making room for deeper creative work", "A few quiet systems that make it easier to think, learn and finish meaningful projects."],
];

export default function BlogPage() {
  return (
    <SiteChrome><main className="min-h-screen bg-[#f5f5f0] text-[#111111]"><section className="px-6 pb-20 pt-20 md:px-12 md:pb-28 md:pt-28 lg:px-16"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">The journal</p><div className="mt-6 grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end"><h1 className="max-w-4xl text-6xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-8xl">Ideas for building a better life and business.</h1><p className="max-w-md text-lg leading-8 text-black/60">Short, useful essays about technology, business, lifestyle and finance. New articles will be added here as the journal grows.</p></div></section><section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-16"><div className="grid gap-x-10 gap-y-16 md:grid-cols-2">{posts.map(([category, title, description], index) => <article key={title} className="border-t border-black/15 pt-5"><div className="flex justify-between text-xs font-semibold uppercase tracking-[0.15em] text-black/40"><span>{category}</span><span>0{index + 1}</span></div><h2 className="mt-16 max-w-lg text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{title}</h2><p className="mt-4 max-w-md leading-7 text-black/60">{description}</p><a href="mailto:jollofdudu@gmail.com?subject=Journal%20update" className="mt-6 inline-block text-sm font-semibold underline decoration-[#00A9A5] underline-offset-4">Get new posts by email ↗</a></article>)}</div></section></main></SiteChrome>
  );
}
