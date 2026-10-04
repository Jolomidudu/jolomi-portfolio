"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProjectRequestLauncher from "./projects/project-request-launcher";
import { CurrencyToggle } from "./currency-provider";

const links = [
  ["HOME", "/"],
  ["PROJECTS", "/projects"],
  ["SERVICES", "/services"],
  ["LEARN", "/learn"],
  ["BLOG", "/blog"],
  ["CONTACT", "/contact"],
] as const;

const aboutLinks = [
  ["ABOUT", "/about"],
  ["EXPERIENCE", "/experience"],
  ["FAQS", "/faq"],
] as const;

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState<"main" | "about">("main");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <header className={`sticky top-0 z-50 flex min-h-20 shrink-0 items-center justify-between bg-[#f5f5f0] px-6 pb-5 pt-[50px] transition-colors md:px-12 md:py-5 lg:px-16 ${menuOpen ? "bg-[#12211f] text-[#f5f5f0]" : "text-[#111111]"}`}>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center overflow-hidden rounded-full border border-[#12211f]/10 bg-white shadow-sm ring-1 ring-black/5" aria-label="Home">
            <img src="/jolo.jpg" alt="Jolomi Dudu" className="h-10 w-10 object-cover" />
          </Link>
          <CurrencyToggle />
        </div>

        <nav className="hidden items-center gap-8 text-sm font-bold text-[#751a1a] md:flex" aria-label="Main navigation">
          <Link href="/" className="transition-opacity hover:opacity-50">HOME</Link>
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 transition-opacity hover:opacity-50">
              ABOUT <span aria-hidden="true" className="text-base transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <div className="absolute left-0 top-full z-[60] mt-4 min-w-48 border border-black/10 bg-[#f5f5f0] p-2 text-[#111111] shadow-xl">
              {aboutLinks.map(([label, href]) => (
                <Link key={href} href={href} className="block px-4 py-3 transition-colors hover:bg-black/5 hover:text-[#008c87]">
                  {label}
                </Link>
              ))}
            </div>
          </details>
          {links.slice(1).map(([label, href]) => (
            <Link key={href} href={href} className="transition-opacity hover:opacity-50">{label}</Link>
          ))}
        </nav>

        <ProjectRequestLauncher variant="header" />

        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-mobile-navigation"
            onClick={() => {
              setMenuOpen((open) => !open);
              setMenuView("main");
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#374151] bg-[#374151] text-white"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div id="site-mobile-navigation" className="fixed inset-0 z-[60] flex min-h-screen flex-col bg-[#12211f] px-6 pb-8 pt-28 text-[#f5f5f0] md:hidden">
            <button type="button" aria-label="Close menu" onClick={() => { setMenuOpen(false); setMenuView("main"); }} className="absolute right-6 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/35 text-2xl font-light text-[#f5f5f0]">×</button>
            <div className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#78d8ca]">
              <span className="h-2 w-2 rounded-full bg-[#78d8ca]" />
              {menuView === "main" ? "Menu / Available for Hire" : "About / Explore"}
            </div>
            <nav className="min-h-0 flex-1 flex-col overflow-y-auto" aria-label="Mobile navigation">
              {menuView === "main" ? (
                <>
                  <Link href="/" onClick={() => setMenuOpen(false)} className="group flex items-center justify-between border-y border-white/15 py-4 hover:text-[#78d8ca]">
                    <span className="flex items-center gap-4"><span className="text-xs text-white/35">01</span><span className="text-3xl font-semibold tracking-[-0.04em]">HOME</span></span>
                    <span aria-hidden="true" className="text-xl text-white/35">↗</span>
                  </Link>
                  <button type="button" onClick={() => setMenuView("about")} className="group flex items-center justify-between border-b border-white/15 py-4 text-left hover:text-[#78d8ca]">
                    <span className="flex items-center gap-4"><span className="text-xs text-white/35">02</span><span className="text-3xl font-semibold tracking-[-0.04em]">ABOUT</span></span>
                    <span aria-hidden="true" className="text-3xl leading-none text-white/35 transition-transform group-hover:translate-x-1 group-hover:text-[#78d8ca]">›</span>
                  </button>
                  {links.slice(1).map(([label, href], index) => (
                    <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="group flex items-center justify-between border-b border-white/15 py-4 hover:text-[#78d8ca]">
                      <span className="flex items-center gap-4"><span className="text-xs text-white/35">0{index + 3}</span><span className="text-3xl font-semibold tracking-[-0.04em]">{label}</span></span>
                      <span aria-hidden="true" className="text-xl text-white/35">↗</span>
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  <button type="button" onClick={() => setMenuView("main")} className="mb-5 flex items-center gap-3 self-start py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white/65 transition-colors hover:text-[#78d8ca]">
                    <span aria-hidden="true" className="text-xl">←</span> Main menu
                  </button>
                  {aboutLinks.map(([label, href], index) => (
                    <Link key={href} href={href} onClick={() => { setMenuOpen(false); setMenuView("main"); }} className="group flex items-center justify-between border-b border-white/15 py-4 first:border-t hover:text-[#78d8ca]">
                      <span className="flex items-center gap-4"><span className="text-xs text-white/35">0{index + 1}</span><span className="text-3xl font-semibold tracking-[-0.04em]">{label}</span></span>
                      <span aria-hidden="true" className="text-xl text-white/35 transition-transform group-hover:translate-x-1 group-hover:text-[#78d8ca]">↗</span>
                    </Link>
                  ))}
                </>
              )}
            </nav>
           
          </div>
        )}
      </header>

      {showScrollTop && <button type="button" aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#12211f] text-xl text-[#78d8ca] shadow-lg transition-all hover:-translate-y-1 hover:bg-[#00A9A5] hover:text-white">↑</button>}

      {children}
    </div>
  );
}
