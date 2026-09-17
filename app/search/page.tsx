"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SiteChrome from "../site-chrome";

const searchablePages = [
  { title: "Services & pricing", description: "Explore web, mobile, design, analytics and consultancy packages.", href: "/services" },
  { title: "Contact Jolomi", description: "Send a message, ask a question or start a project conversation.", href: "/#contact" },
  { title: "Learn with Jolomi", description: "Practical tutoring for websites, graphic design and mobile apps.", href: "/learn" },
  { title: "Journal", description: "Read notes and ideas about technology, products and digital work.", href: "/blog" },
  { title: "Work", description: "Browse selected projects and digital products.", href: "/#work" },
  { title: "Experience", description: "See where Jolomi has made an impact.", href: "/#experience" },
  { title: "Frequently asked questions", description: "Find quick answers about services, payments and working together.", href: "/faq" },
  { title: "Privacy policy", description: "Read how this website handles personal information.", href: "/privacy" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return searchablePages;
    return searchablePages.filter((page) =>
      `${page.title} ${page.description}`.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  return (
    <SiteChrome>
      <main className="min-h-screen bg-[#f5f5f0] px-6 pb-24 pt-20 text-[#111111] md:px-12 md:pb-32 md:pt-28 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">Search</p>
          <h1 className="mt-6 max-w-3xl text-6xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-8xl">Find your way around.</h1>
          <label className="mt-12 flex items-center gap-4 border-b-2 border-[#111111] pb-4">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 shrink-0 fill-none stroke-current stroke-2"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" strokeLinecap="round" /></svg>
            <span className="sr-only">Search the website</span>
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search services, contact, learning..." className="w-full bg-transparent text-xl outline-none placeholder:text-black/35 md:text-2xl" />
          </label>

          <div className="mt-12 divide-y divide-black/15 border-y border-black/15">
            {results.length > 0 ? results.map((page) => (
              <Link key={page.href} href={page.href} className="group flex items-start justify-between gap-6 py-7 transition-colors hover:text-[#00A9A5]">
                <div><h2 className="text-2xl font-semibold">{page.title}</h2><p className="mt-2 max-w-2xl text-black/55">{page.description}</p></div>
                <span className="text-2xl transition-transform group-hover:translate-x-1">↗</span>
              </Link>
            )) : <p className="py-10 text-black/55">No matching pages yet. Try another search.</p>}
          </div>
        </div>
      </main>
    </SiteChrome>
  );
}
