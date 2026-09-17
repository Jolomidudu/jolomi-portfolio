"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  ["HOME", "/"],
  ["SERVICES", "/services"],
  ["LEARN", "/learn"],
  ["JOURNAL", "/blog"],
] as const;

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <header className={`sticky top-0 z-50 flex min-h-20 shrink-0 items-center justify-between bg-[#f5f5f0] px-6 py-5 transition-colors md:px-12 lg:px-16 ${menuOpen ? "bg-[#12211f] text-[#f5f5f0]" : "text-[#111111]"}`}>
        <Link href="/" className="text-xl font-bold tracking-tight">J<span className="text-[#00A9A5]">.</span>D</Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex" aria-label="Main navigation">
          {links.map(([label, href]) => <Link key={href} href={href} className="transition-opacity hover:opacity-50">{label}</Link>)}
        </nav>

        <div className="hidden md:block"><Link href="/services#booking" className="rounded-full border border-current px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[#111111] hover:text-white">Start a project</Link></div>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/notifications" aria-label="Notifications" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#374151] bg-[#374151] text-white transition-colors hover:bg-[#1f2937]"><svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" strokeLinecap="round" strokeLinejoin="round" /></svg></Link>
          <Link href="/search" aria-label="Search" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#374151] bg-[#374151] text-white transition-colors hover:bg-[#1f2937]"><svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" strokeLinecap="round" /></svg></Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Link href="/notifications" aria-label="Notifications" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#374151] bg-[#374151] text-white"><svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" strokeLinecap="round" strokeLinejoin="round" /></svg></Link>
          <Link href="/search" aria-label="Search" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#374151] bg-[#374151] text-white"><svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" strokeLinecap="round" /></svg></Link>
          <button type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="site-mobile-navigation" onClick={() => setMenuOpen(!menuOpen)} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#374151] bg-[#374151] text-white">
            {menuOpen ? "×" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div id="site-mobile-navigation" className="fixed inset-0 z-[60] flex min-h-screen flex-col bg-[#12211f] px-6 pb-8 pt-28 text-[#f5f5f0] md:hidden">
            <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="absolute right-6 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/35 text-2xl font-light text-[#f5f5f0]">×</button>
            <div className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#78d8ca]"><span className="h-2 w-2 rounded-full bg-[#78d8ca]" /> Menu / Available for work</div>
            <nav className="flex flex-1 flex-col" aria-label="Mobile navigation">
              {links.map(([label, href], index) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="group flex items-center justify-between border-b border-white/15 py-4 first:border-t hover:text-[#78d8ca]"><span className="flex items-center gap-4"><span className="text-xs text-white/35">0{index + 1}</span><span className="text-3xl font-semibold tracking-[-0.04em]">{label}</span></span><span className="text-xl text-white/35">↗</span></Link>)}
            </nav>
            <div className="mt-10 flex items-end justify-between border-t border-white/15 pt-5 text-xs uppercase tracking-[0.15em] text-white/45"><span>Lagos / Nigeria</span><Link href="/services#booking" onClick={() => setMenuOpen(false)} className="text-[#78d8ca]">Start a project ↗</Link></div>
          </div>
        )}
      </header>

      {pathname !== "/" && <Link href="/" className="fixed bottom-6 left-6 z-40 rounded-full border border-black/20 bg-[#f5f5f0]/90 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-black backdrop-blur-md transition-transform hover:-translate-x-1">← Back home</Link>}
      {showScrollTop && <button type="button" aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#12211f] text-xl text-[#78d8ca] shadow-lg transition-all hover:-translate-y-1 hover:bg-[#00A9A5] hover:text-white">↑</button>}

      {children}
    </div>
  );
}
