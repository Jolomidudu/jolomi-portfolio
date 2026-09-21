
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [atPageEnd, setAtPageEnd] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setAtPageEnd(
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8,
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f5f0] pt-[110px] text-[#111111] md:pt-20">

      {/* =====================================================
          NAVIGATION
      ====================================================== */}
      <nav className={`fixed inset-x-0 top-0 z-50 flex min-h-20 shrink-0 items-center justify-between bg-[#f5f5f0] px-6 pb-5 pt-[50px] transition-colors md:px-12 md:py-5 lg:px-16 ${menuOpen ? "bg-[#12211f] text-[#f5f5f0]" : "text-[#111111]"}`}>

        <a
          href="#"
          className="text-xl font-bold tracking-tight"
        >
          J<span className="text-[#00A9A5]">.</span>D
        </a>

        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a
            href="#work"
            className="transition-opacity hover:opacity-50"
          >
            WORK
          </a>

          <a
            href="#about"
            className="transition-opacity hover:opacity-50"
          >
            ABOUT
          </a>

          <a
            href="/services"
            className="transition-opacity hover:opacity-50"
          >
            SERVICES
          </a>

          <a
            href="/learn"
            className="transition-opacity hover:opacity-50"
          >
            LEARN
          </a>

          <a
            href="/blog"
            className="transition-opacity hover:opacity-50"
          >
            JOURNAL
          </a>

          <a
  href="#experience"
  className="transition-opacity hover:opacity-50"
>
  EXPERIENCE
</a>

          <a
            href="#contact"
            className="transition-opacity hover:opacity-50"
          >
            CONTACT
          </a>
        </div>

        <a
          href="/services#booking"
          className="hidden rounded-full border border-black px-5 py-2.5 text-sm font-medium transition-all hover:bg-black hover:text-white md:block"
        >
          Start a project
        </a>

        <div className="hidden items-center gap-2 md:flex">
          <a href="/notifications" aria-label="Notifications" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#374151] bg-[#374151] text-white transition-colors hover:bg-[#1f2937]">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          <a href="/search" aria-label="Search" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#374151] bg-[#374151] text-white transition-colors hover:bg-[#1f2937]">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" strokeLinecap="round" /></svg>
          </a>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <a href="/notifications" aria-label="Notifications" className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-500 bg-gray-500 text-white">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          <a href="/search" aria-label="Search" className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-500 bg-gray-500 text-white">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" strokeLinecap="round" /></svg>
          </a>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#374151] bg-[#374151] text-white transition-colors hover:bg-[#1f2937]"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div
            id="mobile-navigation"
            className="fixed inset-0 z-[60] flex min-h-screen flex-col bg-[#12211f] px-6 pb-8 pt-28 text-[#f5f5f0] md:hidden"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="absolute right-6 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/35 text-2xl font-light text-[#f5f5f0] transition-colors hover:border-[#78d8ca] hover:text-[#78d8ca]"
            >
              ×
            </button>

            <div className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#78d8ca]">
              <span className="h-2 w-2 rounded-full bg-[#78d8ca]" />
              <span>Menu / Available for work</span>
            </div>

            <div className="flex flex-1 flex-col">
              {[
                ["WORK", "#work"],
                ["ABOUT", "#about"],
                ["SERVICES", "/services"],
                ["LEARN", "/learn"],
                ["JOURNAL", "/blog"],
                ["EXPERIENCE", "#experience"],
                ["CONTACT", "#contact"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="group flex items-center justify-between border-b border-white/15 py-4 transition-colors first:border-t hover:text-[#78d8ca]"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="flex items-center gap-4">
                    <span className="text-xs font-normal text-white/35">0{["WORK", "ABOUT", "SERVICES", "LEARN", "JOURNAL", "EXPERIENCE", "CONTACT"].indexOf(label) + 1}</span>
                    <span className="text-3xl font-semibold tracking-[-0.04em]">{label}</span>
                  </span>
                  <span className="text-xl text-white/35 transition-transform group-hover:translate-x-1 group-hover:text-[#78d8ca]">↗</span>
                </a>
              ))}
            </div>

            <div className="mt-10 flex items-end justify-between border-t border-white/15 pt-5 text-xs uppercase tracking-[0.15em] text-white/45">
              <span>Lagos / Nigeria</span>
              <a href="/services#booking" onClick={() => setMenuOpen(false)} className="text-[#78d8ca]">Start a project ↗</a>
            </div>
          </div>
        )}

      </nav>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2 md:bottom-6">
        <span className="-translate-y-[30px] rotate-90 text-[10px] font-bold uppercase tracking-[0.12em] text-[#12211f] md:-translate-y-[15px]">
          SCROLL
        </span>
        <button
          type="button"
          aria-label={atPageEnd ? "Scroll up" : "Scroll down"}
          onClick={() =>
            window.scrollTo({
              top: atPageEnd ? 0 : document.documentElement.scrollHeight,
              behavior: "smooth",
            })
          }
          className="-translate-y-[10px] flex h-10 w-10 animate-bounce items-center justify-center rounded-full bg-[#374151] text-base text-white shadow-lg transition-colors hover:bg-[#1f2937] md:translate-y-0 md:h-20 md:w-20 md:text-xl"
        >
          {atPageEnd ? "↑" : "↓"}
        </button>
      </div>


      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative -top-20 flex min-h-[calc(100vh-90px)] flex-col justify-center px-6 pb-16 pt-16 md:-top-5 md:px-12 lg:px-16">

        <div className="mb-8 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em]">

        </div>


        <div className="grid max-w-7xl grid-cols-[1.25fr_0.75fr] items-center gap-4 sm:gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12">

          <div>
            <p className="mb-4 text-[19px] font-medium leading-tight md:text-xl">
              Hello, I&apos;m Oritsejolomi Dudu.
            </p>

            <h1 className="text-[9vw] font-bold leading-[0.82] tracking-[-0.07em] sm:text-[10vw] md:text-[7vw] lg:text-[6.3vw]">
                
              <span className="block md:whitespace-nowrap"> <span className="text-[#5e5e55]">A</span> SOFTWARE</span>
              <span className="block">
                <span className="text-[#35530E]">ENGINEER</span>
                
                
                <span>.</span>
              </span>
            </h1>

            <div className="mt-10 max-w-md sm:mt-14">
              <div className="flex flex-col gap-3 md:flex-row">
                <a
                  href="https://calendly.com/jollofdudu/let-s-discuss-your-project"
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-w-0 flex-1 items-center justify-center rounded-[0.65rem] bg-[#12211f] px-3 py-3 text-center text-[10px] font-semibold tracking-[0.08em] text-white transition-colors hover:bg-[#00A9A5] sm:text-xs"
                >
                  CALL ME
                </a>
                <a
                  href="https://drive.google.com/uc?export=download&id=1OlSV-d0tRIhHxs8lupPQwdHQXd3lRx3T"
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-w-0 flex-1 items-center justify-center rounded-[0.65rem] border border-[#12211f] px-3 py-3 text-center text-[10px] font-bold tracking-[0.08em] text-[#12211f] transition-colors hover:bg-[#12211f] hover:text-white sm:text-sm"
                >
                  DOWNLOAD CV
                </a>
              </div>

              <a
                href="#work"
                className="group mt-5 flex w-fit items-center gap-4"
              >
                <span className="text-xs font-bold uppercase tracking-wider sm:text-sm">
                  View my recent works
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-[0.65rem] border border-gray-500 bg-gray-500 text-white transition-all duration-300 group-hover:bg-black">
                  ↓
                </span>
              </a>
            </div>
          </div>

          <div className="relative flex h-[min(82vw,37rem)] min-h-80 items-end justify-center md:h-[min(68vw,31rem)] md:min-h-64">
            <Image
              src="/images/jolomid.png"
              alt="Jolomi Dudu"
              fill
              priority
              sizes="(max-width: 768px) 35vw, 38vw"
              className="-translate-y-[50px] scale-[1.7] object-contain object-bottom md:translate-y-0 md:scale-100"
            />
          </div>

        </div>


        

      </section>


      
     {/* =====================================================
    ABOUT
====================================================== */}
<section
  id="about"
  className="border-t border-black/10 bg-[#111111] px-6 py-24 text-[#f5f5f0] md:px-12 md:py-32 lg:px-16"
>
  <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-12">

        {/* Photo */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-white/10">

          <Image
            src="/images/jolomi2.jpg"
            alt="Jolomi Dudu"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />

        </div>


      {/* Introduction */}
      <div>

          <h2 className="text-[25px] font-semibold leading-[1.25] tracking-[-0.01em] md:text-[35px]">

           I’m a Software Engineer focused on building modern, scalable, and user-centered digital solutions. I have experience developing customer-facing applications and backend systems across industries including real estate, fmcg, fintech, banking, healthcare, hospitality and  SaaS.

           

          </h2>

          <p className="mt-8 text-base leading-8 text-white/65 md:text-lg">
        </p>

          
        </div>

      </div>


      {/* Statistics */}
      <div className="mt-20 grid grid-cols-2 border-t border-white/15 pt-8 md:grid-cols-4">

        <div>
          <p className="text-4xl font-semibold tracking-tight md:text-5xl">
            8+
          </p>

          <p className="mt-2 text-xs uppercase tracking-wider text-white/40">
            Years Experience
          </p>
        </div>


        <div>
          <p className="text-4xl font-semibold tracking-tight md:text-5xl">
           65+
          </p>

          <p className="mt-2 text-xs uppercase tracking-wider text-white/40">
            Projects
          </p>
        </div>


        <div className="mt-8 md:mt-0">
          <p className="text-4xl font-semibold tracking-tight md:text-5xl">
            6+
          </p>

          <p className="mt-2 text-xs uppercase tracking-wider text-white/40">
            Core Disciplines
          </p>
        </div>


        <div className="mt-8 md:mt-0">
          <p className="text-4xl font-semibold tracking-tight md:text-5xl">
            ∞
          </p>

          <p className="mt-2 text-xs uppercase tracking-wider text-white/40">
            Ideas to Build
          </p>
    </div>


  </div>
</section>


      


      {/* =====================================================
          FEATURED WORK
      ====================================================== */}
    {/* =====================================================
    PROJECTS
====================================================== */}
<section
  id="work"
  className="bg-[#f5f5f0] px-6 py-24 md:px-12 md:py-32 lg:px-16"
>
  <div className="mb-16 grid gap-8 md:grid-cols-[1fr_0.45fr] md:items-end">

    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
        Selected Work
      </p>

      <h2 className="mt-5 text-5xl font-semibold tracking-[-0.05em] md:text-6xl lg:text-7xl">
        Projects I&apos;ve built.
      </h2>
    </div>

    <p className="max-w-sm text-sm leading-6 text-black/50 md:justify-self-end">
      A selection of digital products, platforms and applications
      I&apos;ve designed and developed across different industries.
    </p>

  </div>


  {/* Projects */}
  <div className="grid grid-cols-2 gap-6 md:gap-10 lg:gap-14">

    {/* =====================================================
        SPA ELARIS
    ====================================================== */}
    <article className="group">

      <div className="overflow-hidden rounded-[1.5rem] bg-[#ded5c7]">

        <div className="relative aspect-[16/9]">

          <Image
            src="/images/projects/spaelaris1-mckp.jpg"
            alt="Spa Elaris wellness website"
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

        </div>

      </div>


      <div className="mt-6 grid gap-5 md:grid-cols-[0.7fr_1.3fr]">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/60">
            01 / Web & Mobile
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Spa Elaris
          </h3>

          <a href="https://spaelaris.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2"></span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-md leading-7 text-black/55 md:text-base">
            A premium wellness & spa platform for customers to book appointments and explore services,
            treatments, services, packages and provide a polished
            digital experience for customers.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
              "Next.js",
              "Nest.js",
              "Node.js",
              "PostgreSQL",
               "flutter",
                "AWS",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
              >
                {tech}
              </span>
            ))}

          </div>

        </div>

      </div>

    </article>


     {/* =====================================================
        Kids College School Management
    ====================================================== */}
    <article className="group">

      <div className="overflow-hidden rounded-[1.5rem] bg-[#111111]">

        <div className="relative aspect-[16/9]">

          <Image
            src="/images/projects/kidscollege-mckp.png"
            alt="School management platform dashboard"
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

        </div>

      </div>


      <div className="mt-6 grid gap-5 md:grid-cols-[0.7fr_1.3fr]">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/60">
            02 / Web App
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Kids College
          </h3>

          <a href="https://kcbn.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2"></span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-md leading-7 text-black/55 md:text-base">
            A comprehensive school management system connecting
            administrators, teachers, students and parents through
            a centralized digital platform.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
              "Next.js",
              "Nest.js",
              "Node.js",
              "PostgreSQL",
              
                "AWS",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
              >
                {tech}
              </span>
            ))}

          </div>

        </div>

      </div>

    </article>


    
     {/* =====================================================
        Dating Platform
    ====================================================== */}
    <article className="group">

      <div className="overflow-hidden rounded-[1.5rem] bg-[#111111]">

        <div className="relative aspect-[16/9]">

          <Image
            src="/images/projects/lovenorth-mckp.png"
            alt="School management platform dashboard"
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

        </div>

      </div>


      <div className="mt-6 grid gap-5 md:grid-cols-[0.7fr_1.3fr]">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
            03 / Web App
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
           Lovenorth</h3>

          <a href="https://lovenorth.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2"></span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-md leading-7 text-black/55 md:text-base">
            A comprehensive dating platform connecting singles and helping them find meaningful relationships.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
              "Next.js",
              "Nest.js",
              "Node.js",
              "PostgreSQL",
               
                "Railway",
              
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
              >
                {tech}
              </span>
            ))}

          </div>

        </div>

      </div>

    </article>

     {/* =====================================================
        A Hotel Booking Platform
    ====================================================== */}
    <article className="group">

      <div className="overflow-hidden rounded-[1.5rem] bg-[#111111]">

        <div className="relative aspect-[16/9]">

          <Image
            src="/images/projects/elvarahotel-mckp.jpg"
            alt="A hotel booking platform"
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

        </div>

      </div>


      <div className="mt-6 grid gap-5 md:grid-cols-[0.7fr_1.3fr]">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
            04 / Web App
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Elvara Hotel
          </h3>

          <a href="https://elvarahotel.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2"></span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-md leading-7 text-black/55 md:text-base">
            A hotel booking platform designed to help users discover, book and manage hotel stays through a seamless digital experience.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
              "Next.js",
              "Nest.js",
              "Node.js",
              "PostgreSQL",
              
                "AWS",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
              >
                {tech}
              </span>
            ))}

          </div>

        </div>

      </div>

    </article>


     {/* =====================================================
        A Cosmetics E-commerce Platform
    ====================================================== */}
    <article className="group">

      <div className="overflow-hidden rounded-[1.5rem] bg-[#111111]">

        <div className="relative aspect-[16/9]">

          <Image
            src="/images/projects/spinettcosmetics-mckp.png"
            alt="A cosmetics e-commerce platform"
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

        </div>

      </div>


      <div className="mt-6 grid gap-5 md:grid-cols-[0.7fr_1.3fr]">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
            05 / Web & Mobile
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Spinett cosmetics
          </h3>

          <a href="https://spinettcosmetics.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2"></span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-md leading-7 text-black/55 md:text-base">
            A cosmetics e-commerce platform that allows users to browse and purchase beauty products from various brands.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
              "Next.js",
              "Nest.js",
              "Node.js",
              "PostgreSQL",
              "REST API",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
              >
                {tech}
              </span>
            ))}

          </div>

        </div>

      </div>

    </article>


    {/* =====================================================
        Food Delivery Platform
    ====================================================== */}
    <article className="group">

      <div className="overflow-hidden rounded-[1.5rem] bg-[#111111]">

        <div className="relative aspect-[16/9]">

          <Image
            src="/images/projects/mealcourt.jpg"
            alt="A food delivery platform"
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

        </div>

      </div>


      <div className="mt-6 grid gap-5 md:grid-cols-[0.7fr_1.3fr]">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
            06 / Web & Mobile
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Mealcourt
          </h3>

          <a href="https://mealcourt.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2"></span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-md leading-7 text-black/55 md:text-base">
            A food delivery platform that connects users with local restaurants and enables seamless ordering and tracking.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
              "Next.js",
              "Nest.js",
              "Node.js",
              "PostgreSQL",
               "flutter",
                "AWS",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
              >
                {tech}
              </span>
            ))}

          </div>

        </div>

      </div>

    </article>



    {/* =====================================================
        A Logistics Platform
    ====================================================== */}
    <article className="group">

      <div className="overflow-hidden rounded-[1.5rem] bg-[#111111]">

        <div className="relative aspect-[16/9]">

          <Image
            src="/images/projects/misanlogistics-mckp.png"
            alt="A logistics platform"
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

        </div>

      </div>


      <div className="mt-6 grid gap-5 md:grid-cols-[0.7fr_1.3fr]">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
            07 / Web & Mobile
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Misan Logistics
          </h3>

          <a href="https://misanlogistics.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2"></span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-md leading-7 text-black/55 md:text-base">
            A logistics platform designed to help users discover, book and manage logistics services through a seamless digital experience.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
             "Next.js",
              "Nest.js",
              "Node.js",
              "PostgreSQL",
               "flutter",
                "AWS",
            
              "Wallet"
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
              >
                {tech}
              </span>
            ))}

          </div>

        </div>

      </div>

    </article>

    {/* =====================================================
        CARECROWD A Crowdfunding Platform
    ====================================================== */}
    <article className="group">

      <div className="overflow-hidden rounded-[1.5rem] bg-[#111111]">

        <div className="relative aspect-[16/9]">

          <Image
            src="/images/projects/carecrowd-mckp.png"
            alt="CARECROWD crowdfunding platform"
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

        </div>

      </div>


      <div className="mt-6 grid gap-5 md:grid-cols-[0.7fr_1.3fr]">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
            08 / Mobile App
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            CareCrowd
          </h3>

          <a href="https://carecrowd.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2"></span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-md leading-7 text-black/55 md:text-base">
            A crowdfunding and digital community platform designed
            to help people raise funds, support causes and connect
            with communities.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
             
               "flutter",
                "AWS",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
              >
                {tech}
              </span>
            ))}

          </div>

        </div>

      </div>

    </article>

     {/* =====================================================
        Car Ride Sharing Platform
    ====================================================== */}
    <article className="group">

      <div className="overflow-hidden rounded-[1.5rem] bg-[#111111]">

        <div className="relative aspect-[16/9]">

          <Image
            src="/images/projects/routyride.jpg"
            alt="Car ride sharing platform"
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

        </div>

      </div>


      <div className="mt-6 grid gap-5 md:grid-cols-[0.7fr_1.3fr]">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
            09 / Web & Mobile
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Routyride
          </h3>

          <a href="https://routyride.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2"></span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-md leading-7 text-black/55 md:text-base">
            A car ride hailing platform designed
            to help people find rides, connect with drivers and enjoy seamless travel experiences.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
              "Next.js",
              "Nest.js",
              "Node.js",
              "PostgreSQL",
               "flutter",
                "AWS",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
              >
                {tech}
              </span>
            ))}

          </div>

        </div>

      </div>

    </article>


    


   


    {/* =====================================================
        HEALTHCARE PLATFORM
    ====================================================== */}
    <article className="group">

      <div className="overflow-hidden rounded-[1.5rem] bg-[#dfe7df]">

        <div className="relative aspect-[16/9]">

          <Image
            src="/images/projects/skyhealth-mckp.jpg"
            alt="SkyHealth Healthcare Platform"
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

        </div>

      </div>


      <div className="mt-6 grid gap-5 md:grid-cols-[0.7fr_1.3fr]">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
            10 / Web & Mobile
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            SkyHealth
          </h3>

          <a href="https://skyhealth.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2"></span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-md leading-7 text-black/55 md:text-base">
            A healthcare platform designed to help users access medical services, connect with healthcare providers and manage their health records through a seamless digital experience.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
               "Next.js",
              "Nest.js",
              "Node.js",
              "PostgreSQL",
               "flutter",
                "AWS",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
              >
                {tech}
              </span>
            ))}

          </div>

        </div>

      </div>

    </article>

     {/* =====================================================
       FASHION DESIGNER PORTFOLIO
    ====================================================== */}
    <article className="group">

      <div className="overflow-hidden rounded-[1.5rem] bg-[#dfe7df]">

        <div className="relative aspect-[16/9]">

          <Image
            src="/images/projects/Grandbox.png"
            alt="Fashion Designer Portfolio"
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

        </div>

      </div>


      <div className="mt-6 grid gap-5 md:grid-cols-[0.7fr_1.3fr]">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
            11 / Mobile App
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Grandbox
          </h3>

          <a href="https://grandbox.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2"></span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-md leading-7 text-black/55 md:text-base">
            Granbox portfolio website showcasing creative work and professional experience.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
               
               "flutter",
                "AWS",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
              >
                {tech}
              </span>
            ))}

          </div>

        </div>

      </div>

    </article>

  </div>

</section>


      {/* =====================================================
          SERVICES
      ====================================================== */}
      <section
        id="services"
        className="bg-[#111111] px-6 py-24 text-[#f5f5f0] md:px-12 md:py-32 lg:px-16"
      >

        <div className="mb-20">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
            Expertise
          </p>

          <h2 className="mt-5 max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl lg:text-8xl">
            What I bring
            <span className="text-[#00A9A5]">
              {" "}to the table.
            </span>
          </h2>

        </div>


        <div className="divide-y divide-white/10 border-y border-white/10">

          {/* Service 01 */}
          <div className="group grid gap-6 py-10 md:grid-cols-[100px_1fr_100px] md:items-center">

            <span className="text-sm text-white/30">
              01
            </span>

            <div>

              <h3 className="text-3xl font-semibold tracking-tight transition-colors group-hover:text-[#00A9A5] md:text-5xl">
                Web Development
              </h3>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/45">
                Modern, responsive websites and web applications
                designed around performance, usability and business goals.
              </p>

            </div>

            <span className="text-right text-3xl text-white/20 transition-all group-hover:translate-x-2 group-hover:text-[#00A9A5]">
              ↗
            </span>

          </div>


          {/* Service 02 */}
          <div className="group grid gap-6 py-10 md:grid-cols-[100px_1fr_100px] md:items-center">

            <span className="text-sm text-white/30">
              02
            </span>

            <div>

              <h3 className="text-3xl font-semibold tracking-tight transition-colors group-hover:text-[#00A9A5] md:text-5xl">
                Mobile App Development
              </h3>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/45">
                Cross-platform mobile applications with intuitive
                interfaces and scalable architectures.
              </p>

            </div>

            <span className="text-right text-3xl text-white/20 transition-all group-hover:translate-x-2 group-hover:text-[#00A9A5]">
              ↗
            </span>

          </div>


          {/* Service 03 */}
          <div className="group grid gap-6 py-10 md:grid-cols-[100px_1fr_100px] md:items-center">

            <span className="text-sm text-white/30">
              03
            </span>

            <div>

              <h3 className="text-3xl font-semibold tracking-tight transition-colors group-hover:text-[#00A9A5] md:text-5xl">
                Backend & APIs
              </h3>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/45">
                Secure backend systems, databases, APIs and integrations
                that power reliable digital products.
              </p>

            </div>

            <span className="text-right text-3xl text-white/20 transition-all group-hover:translate-x-2 group-hover:text-[#00A9A5]">
              ↗
            </span>

          </div>


          {/* Service 04 */}
          <div className="group grid gap-6 py-10 md:grid-cols-[100px_1fr_100px] md:items-center">

            <span className="text-sm text-white/30">
              04
            </span>

            <div>

              <h3 className="text-3xl font-semibold tracking-tight transition-colors group-hover:text-[#00A9A5] md:text-5xl">
                Data Analytics
              </h3>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/45">
                Data cleaning, analysis, visualization and reporting
                that turn raw information into useful insights.
              </p>

            </div>

            <span className="text-right text-3xl text-white/20 transition-all group-hover:translate-x-2 group-hover:text-[#00A9A5]">
              ↗
            </span>

          </div>

        </div>

      </section>

      {/* =====================================================
          TESTIMONIALS
      ====================================================== */}
      <section className="bg-[#12211f] px-6 py-24 text-[#f5f5f0] md:px-12 md:py-32 lg:px-16">
        <div className="flex items-end justify-between gap-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#78d8ca]">Client notes</p>
            <h2 className="mt-5 max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-6xl">Good work should make people&apos;s lives easier.</h2>
          </div>
          <span className="hidden text-sm text-white/45 md:block">Swipe to explore</span>
        </div>

        <div className="mt-14 flex snap-x gap-5 overflow-x-auto pb-5">
          {[
            ["Jolomi brought structure to a complicated product and gave the team confidence to ship.", "Mr Akinwale, Produx Investment"],
            ["The work was thoughtful, practical and clear from the first conversation to launch.", "Mr Charles, Gentleboard Real estate"],
            ["We finally had a website that sounded like us and helped customers understand what we do.", "Mrs Lucy, Spa"],
            ["Jolomi is the rare engineer who keeps both the user and the business in view.", "Feranmi, Doctor"],
            ["Fast, dependable and generous with his thinking. I would happily work with him again.", "Mr Olalere, Straitgate"],
          ].map(([quote, author]) => (
            <figure key={author} className="min-w-[82vw] snap-start border border-white/15 p-7 sm:min-w-[55vw] md:min-w-[34vw] md:p-9">
              <blockquote className="text-2xl font-medium leading-tight">&ldquo;{quote}&rdquo;</blockquote>
              <figcaption className="mt-12 text-sm text-[#78d8ca]">{author}</figcaption>
            </figure>
          ))}
        </div>
      </section>

            {/* =====================================================
          EXPERIENCE
      ====================================================== */}
      <section
        id="experience"
        className="bg-[#f5f5f0] px-6 py-24 md:px-12 md:py-32 lg:px-16"
      >
        <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">

          {/* Section Heading */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
              Experience
            </p>

            <h2 className="mt-6 max-w-md text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-6xl">
              Where I&apos;ve made an impact.
            </h2>
          </div>


          {/* Experience List */}
          <div className="border-t border-black/15">

            {/* Experience 01 */}
            <div className="grid gap-6 border-b border-black/15 py-10 md:grid-cols-[150px_1fr_120px]">

              <div>
                <p className="text-sm text-black/40">
                 02/2022 - Present
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Grenstack 
                </h3>

                <p className="mt-1 text-sm text-[#00A9A5]">
                  Founder / Senior Software Engineer
                </p>

                <p className="mt-5 max-w-xl text-base leading-7 text-black/55">
                  Lead a 6-person software engineering team in the design, development 
                  and delivery of scalable digital products and custom software 
                  olutions for businesses across real estate, fintech, e-commerce, 
                  healthcare, events and other industries. 
                </p>

                

                
              </div>

              <div className="text-sm text-black/40 md:text-right">
                Lagos, Nigeria
              </div>

            </div>


            {/* Experience 02 */}
            <div className="grid gap-6 border-b border-black/15 py-10 md:grid-cols-[150px_1fr_120px]">

              <div>
                <p className="text-sm text-black/40">
                 04/2025 - 03/2026
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Greyfundr
                </h3>

                <p className="mt-1 text-sm text-[#00A9A5]">
                  Software Developer
                </p>

               

                <p className="mt-5 max-w-xl text-base leading-7 text-black/55">
                  Designed, developed and maintained backend services powering crowdfunding campaigns, split-bill payments, user onboarding, event experiences and customer-facing workflows across multiple production applications.  
                </p>

                
              </div>

              <div className="text-sm text-black/40 md:text-right">
                Lagos, Nigeria
              </div>

            </div>


            {/* Experience 03 */}
            <div className="grid gap-6 border-b border-black/15 py-10 md:grid-cols-[150px_1fr_120px]">

              <div>
                <p className="text-sm text-black/40">
                  05/2022 - 04/2025
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Gentleboard
                </h3>

                <p className="mt-1 text-sm text-[#00A9A5]">
                  Software Developer
                </p>

                <p className="mt-5 max-w-xl text-base leading-7 text-black/55">
                  Designed and implemented scalable REST APIs powering property listings, property search, customer inquiries, shortlet bookings and internal operational workflows.
                </p>

                
              </div>

              <div className="text-sm text-black/40 md:text-right">
                Lagos,Nigeria
              </div>

            </div>


            {/* Experience 04 */}
            <div className="grid gap-6 py-10 md:grid-cols-[150px_1fr_120px]">

              <div>
                <p className="text-sm text-black/40">
                  02/2022 - 10/2026
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Business & App Developer
                </h3>

                <p className="mt-1 text-sm text-[#00A9A5]">
                  ifitech & Associates Ltd
                </p>

                <p className="mt-5 max-w-xl text-base leading-7 text-black/55">
                  Collaborated closely with management, design and business teams to translate real estate requirements into intuitive digital experiences and customer-focused features. 
                </p>

               
              </div>

              <div className="text-sm text-black/40 md:text-right">
                Lagos, Nigeria
              </div>

            </div>

             {/* Experience 05 */}
            <div className="grid gap-6 py-10 md:grid-cols-[150px_1fr_120px]">

              <div>
                <p className="text-sm text-black/40">
                  07/2021 - 11/2023
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Website Application Developer
                </h3>

                <p className="mt-1 text-sm text-[#00A9A5]">
                  Spinettcosmetics
                </p>

                <p className="mt-5 max-w-xl text-base leading-7 text-black/55">
                  Refactored existing applications into modular, maintainable architectures, reducing code complexity by approximately 35% and making future product and feature updates more efficient. 
                </p>

                
              </div>

              <div className="text-sm text-black/40 md:text-right">
                Nigeria
              </div>

            </div>

             {/* Experience 05 */}
            <div className="grid gap-6 py-10 md:grid-cols-[150px_1fr_120px]">

              <div>
                <p className="text-sm text-black/40">
                  07/2021 - 11/2023
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                 Social Media Manager
                </h3>

                <p className="mt-1 text-sm text-[#00A9A5]">
                  Leros Comfort Foundation
                </p>

                <p className="mt-5 max-w-xl text-base leading-7 text-black/55">
                  Managed the organization’s social media presence and digital communications, creating awareness around girl-child empowerment, human rights, education and humanitarian initiatives. 
                </p>

                
              </div>

              <div className="text-sm text-black/40 md:text-right">
                Lagos, Nigeria
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          CONTACT
      ====================================================== */}
      <section
        id="contact"
        className="bg-[#f5f5f0] px-6 py-16 md:px-12 md:py-24 lg:px-16"
      >

        <div className="max-w-6xl">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
            GET IN TOUCH
          </p>

          <h2 className="mt-6 text-[25px] font-bold leading-[1.2] tracking-[-0.01em] md:text-[35px]">
            I love to hear from you.
            <span className="hidden text-[#00A9A5] md:inline">
              <br />
              Whether you have a question or want to collaborate, shoot me a message.
            </span>
          </h2>

        </div>


        <div className="mt-8 border-t border-black/15 pt-2">
          <a
            href="mailto:jollofdudu@gmail.com"
            className="group inline-flex items-center gap-5"
          >
            <span className="text-lg font-semibold">
              jollofdudu@gmail.com
            </span>

            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-black transition-all group-hover:bg-black group-hover:text-white">
              ↗
            </span>
          </a>
        </div>

      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="border-t border-black/10 bg-[#f5f5f0] px-6 py-8 md:px-12 lg:px-16">

        <div className="flex flex-col justify-between gap-8 md:flex-row">

          <div>

            <p className="text-xl font-bold">
              J<span className="text-[#00A9A5]">.</span>D
            </p>

            <p className="mt-2 text-sm text-black/40">
              Software Engineer · Web & Mobile Developer
            </p>

          </div>


          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a
              href="https://www.linkedin.com/in/jolomid"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 bg-white text-black transition-opacity hover:opacity-50"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M6.94 8.5A1.56 1.56 0 1 1 6.94 5.4a1.56 1.56 0 0 1 0 3.1ZM5.5 9.78h2.9V18H5.5V9.78Zm5.1 0h2.77v1.13h.04c.39-.74 1.34-1.52 2.76-1.52 2.95 0 3.5 1.94 3.5 4.46V18h-2.9v-16.8h-2.9v7.53c0 1.3-.02 2.97-1.8 2.97-1.81 0-2.09-1.41-2.09-2.86V9.78h-2.9Z" />
              </svg>
            </a>

            <a
              href="https://github.com/jolomidudu"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 bg-white text-black transition-opacity hover:opacity-50"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M12 2A10 10 0 0 0 8.84 21.5c.5.1.68-.22.68-.48v-1.7c-2.77.6-3.35-1.16-3.35-1.16-.46-1.15-1.11-1.46-1.11-1.46-.9-.63.07-.62.07-.62 1 .07 1.52 1.04 1.52 1.04.89 1.54 2.35 1.1 2.92.84.09-.66.35-1.1.63-1.35-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.02A9.5 9.5 0 0 1 12 6.84a9.5 9.5 0 0 1 2.5.33c1.9-1.3 2.74-1.02 2.74-1.02.55 1.4.2 2.45.1 2.7.64.7 1.03 1.59 1.03 2.68 0 3.84-2.35 4.7-4.58 4.94.36.31.68.92.68 1.85v2.75c0 .26.18.59.69.48A10 10 0 0 0 12 2Z" />
              </svg>
            </a>

            <a
              href="https://www.instagram.com/jollof_tech"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 bg-white text-black transition-opacity hover:opacity-50"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm5-3.25a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 17 6.25Z" />
              </svg>
            </a>

            <a href="/faq" className="transition-opacity hover:opacity-50">FAQ</a>
            <a href="/privacy" className="transition-opacity hover:opacity-50">Privacy</a>
          </div>

        </div>


        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-black/10 pt-5 text-xs text-black/40 md:flex-row">

          <p>
            © {new Date().getFullYear()} Jolomi Dudu. All rights reserved.
          </p>

         

        </div>

      </footer>

    </main>
  );
}