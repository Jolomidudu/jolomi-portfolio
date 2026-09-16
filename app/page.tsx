
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f5f0] text-[#111111]">

      {/* =====================================================
          NAVIGATION
      ====================================================== */}
      <nav className={`sticky top-0 z-50 flex items-center justify-between px-6 py-5 backdrop-blur-md transition-colors md:px-12 lg:px-16 ${menuOpen ? "bg-[#12211f] text-[#f5f5f0]" : "bg-[#f5f5f0]/90 text-[#111111]"}`}>

        <a
          href="#"
          className="text-xl font-bold tracking-tight"
        >
          JOLOMI<span className="text-[#00A9A5]">.</span>DUDU
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

        <button
          className={`flex h-10 w-10 items-center justify-center rounded-full border md:hidden ${menuOpen ? "invisible" : "border-black text-[#111111]"}`}
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "×" : "☰"}
        </button>

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

      {showScrollTop && (
        <button
          type="button"
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#12211f] text-xl text-[#78d8ca] shadow-lg transition-all hover:-translate-y-1 hover:bg-[#00A9A5] hover:text-white"
        >
          ↑
        </button>
      )}


      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="flex min-h-[calc(100vh-90px)] flex-col justify-center px-6 pb-16 pt-16 md:px-12 lg:px-16">

        <div className="mb-8 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em]">

          <span className="h-2.5 w-2.5 rounded-full bg-[#00A9A5]" />

          <span>
            Available for making progress
          </span>

        </div>


        <div className="max-w-7xl">

          <p className="mb-4 text-lg font-medium md:text-xl">
            Hello, I&apos;m Oritsejolomi Dudu.
          </p>

          <h1 className="text-[16vw] font-bold leading-[0.8] tracking-[-0.07em] md:text-[13vw] lg:text-[11vw]">

            <span className="block">
              SOFTWARE
            </span>

            <span className="block">

              <span className="text-[#00A9A5]">
                ENGINEER
              </span>

              <span>
                .
              </span>

            </span>

          </h1>

        </div>


        <div className="mt-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">

          <div className="max-w-xl">

            <p className="text-lg leading-relaxed text-black/65 md:text-xl">
              I design, develop, Build and engineer modern web and mobile applications
              that transform ideas into useful digital experiences.
            </p>

          </div>


          <a
            href="#work"
            className="group flex w-fit items-center gap-4"
          >

            <span className="text-sm font-semibold uppercase tracking-wider">
              Explore my works
            </span>

            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-black transition-all duration-300 group-hover:bg-black group-hover:text-white">
              ↓
            </span>

          </a>

        </div>


        <div className="mt-16 grid grid-cols-2 gap-y-5 border-t border-black/15 pt-5 text-xs uppercase tracking-wider text-black/50 md:grid-cols-5">

          <span>Web Development</span>

          <span>Mobile Development</span>

          <span>Backend Engineering</span>

          <span>Data Analytics</span>

          <span>Product Design</span>

          <span>Digital Marketing</span>

          <span className="md:text-right">
            Nigeria
          </span>

        </div>

      </section>


      
     {/* =====================================================
    ABOUT
====================================================== */}
<section
  id="about"
  className="border-t border-black/10 bg-[#111111] px-6 py-24 text-[#f5f5f0] md:px-12 md:py-32 lg:px-16"
>
  <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">

    {/* Section Label */}
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
        Get To Know Me
      </p>

      <p className="mt-6 max-w-xs text-md leading-relaxed text-white/45">
        Developer, problem solver and digital product builder.
      </p>
    </div>


    {/* Main Content */}
    <div>

      {/* Photo + Introduction */}
      <div className="grid gap-10 md:grid-cols-[0.75fr_1.25fr] md:items-start">

        {/* Photo */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-white/10">

          <Image
            src="/images/jolomi2.jpg"
            alt="Jolomi Dudu"
            fill
            priority
            sizes="(max-width: 768px) 130vw, 35vw"
            className="object-cover"
          />

        </div>


        {/* Introduction */}
        <div>

          <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-5xl lg:text-6xl">

            I don&apos;t just write code.

            <span className="text-[#00A9A5]">
              {" "}I turn ideas into digital products.
            </span>

          </h2>

          <p className="mt-8 text-base leading-8 text-white/65 md:text-lg">
            I&apos;m Jolomi Dudu, a software engineer focused on
            building modern web and mobile applications. I enjoy
            taking ideas from concept to functional, polished digital
            products.
          </p>

          <p className="mt-6 text-base leading-8 text-white/65 md:text-lg">
            My work spans frontend development, mobile applications,
            backend systems, APIs, databases and data analytics. I
            combine technology and business thinking to create products
            that are useful, reliable and easy to use.
          </p>

        </div>

      </div>


      {/* Statistics */}
      <div className="mt-20 grid grid-cols-2 border-t border-white/15 pt-8 md:grid-cols-4">

        <div>
          <p className="text-4xl font-semibold tracking-tight md:text-5xl">
            10+
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

    </div>

  </div>
</section>


      {/* =====================================================
          WAYS TO WORK TOGETHER
      ====================================================== */}
      <section className="border-t border-black/10 bg-[#dce9e3] px-6 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#078f8a]">
              BEST TIME TO WORK TOGETHER
            </p>
            <h2 className="mt-5 max-w-md text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-6xl">
              Build, learn, or grow with me.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["01", "Hire a builder", "Websites, web apps, mobile apps, analytics and digital systems.", "/services"],
              ["02", "Learn practical tech", "Focused tutoring for websites, graphics design and mobile apps.", "/learn"],
              ["03", "Read the journal", "Useful notes on business, technology, lifestyle and finance.", "/blog"],
            ].map(([number, title, description, href]) => (
              <a
                key={number}
                href={href}
                className="group border-t border-black/20 pt-5 transition-transform hover:-translate-y-1"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40">{number}</span>
                <h3 className="mt-12 text-2xl font-semibold tracking-tight group-hover:text-[#078f8a]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-black/60">{description}</p>
                <span className="mt-6 block text-xl">↗</span>
              </a>
            ))}
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
  <div className="grid gap-14">

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
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
            01 / Web & Mobile
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Spa Elaris
          </h3>

          <a href="https://spaelaris.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2">-&gt;</span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-sm leading-7 text-black/55 md:text-base">
            A premium wellness and spa platform designed to showcase
            treatments, services, packages and provide a polished
            digital experience for customers.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
              "Next.js",
              "Nest.js",
              "Node.js",
              "flutter.js",
              "TypeScript",
              "PostgreSQL",
              "Railway",
              "Neon",
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
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
            02 / School Management
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Kids College School Management System
          </h3>

          <a href="https://kcbn.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2">-&gt;</span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-sm leading-7 text-black/55 md:text-base">
            A comprehensive school management system connecting
            administrators, teachers, students and parents through
            a centralized digital platform.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
               "Next.js",
              "Nest.js",
              "Node.js",
              "flutter.js",
              "TypeScript",
              "PostgreSQL",
              "Railway",
              "Neon",
              "REST API",
              "Dashboard",
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
            03 / Dating Platform
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            A dating platform connecting singles and helping them find meaningful relationships.
          </h3>

          <a href="https://lovenorth.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2">-&gt;</span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-sm leading-7 text-black/55 md:text-base">
            A comprehensive dating platform connecting singles and helping them find meaningful relationships.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
               "Next.js",
              "Nest.js",
              "Node.js",
              "React Native.js",
              "TypeScript",
              "PostgreSQL",
              "Railway",
              "Neon",
              "REST API",
              "Dashboard",
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
            04 / Web & Mobile
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Elvara
          </h3>

          <a href="https://elvarahotel.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2">-&gt;</span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-sm leading-7 text-black/55 md:text-base">
            A hotel booking platform designed to help users discover, book and manage hotel stays through a seamless digital experience.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
               "Next.js",
              "Nest.js",
              "Node.js",
              "flutter.js",
              "TypeScript",
              "PostgreSQL",
              "Railway",
              "Neon",
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
            Spinettcosmetics
          </h3>

          <a href="https://spinettcosmetics.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2">-&gt;</span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-sm leading-7 text-black/55 md:text-base">
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
            src="/images/projects/mealgo-mckp.png"
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
            Mealgo
          </h3>

          <a href="https://mealgo.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2">-&gt;</span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-sm leading-7 text-black/55 md:text-base">
            A food delivery platform that connects users with local restaurants and enables seamless ordering and tracking.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
               "Next.js",
              "Nest.js",
              "Node.js",
              "flutter.js",
              "TypeScript",
              "PostgreSQL",
              "Railway",
              "Neon",
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
            View project <span aria-hidden="true" className="ml-2">-&gt;</span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-sm leading-7 text-black/55 md:text-base">
            A logistics platform designed to help users discover, book and manage logistics services through a seamless digital experience.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
              "Next.js",
              "Nest.js",
              "Node.js",
              "flutter.js",
              "TypeScript",
              "PostgreSQL",
              "Railway",
              "Neon",
              "Dashboard",
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
        HAPPYGIFT A Crowdfunding Platform
    ====================================================== */}
    <article className="group">

      <div className="overflow-hidden rounded-[1.5rem] bg-[#111111]">

        <div className="relative aspect-[16/9]">

          <Image
            src="/images/projects/happygift-mckp.png"
            alt="HappyGift crowdfunding platform"
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

        </div>

      </div>


      <div className="mt-6 grid gap-5 md:grid-cols-[0.7fr_1.3fr]">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
            08 / Web & Mobile
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            HappyGift
          </h3>

          <a href="https://happygift.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2">-&gt;</span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-sm leading-7 text-black/55 md:text-base">
            A crowdfunding and digital community platform designed
            to help people raise funds, support causes and connect
            with communities.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
              "Next.js",
              "Nest.js",
              "Node.js",
              "flutter.js",
              "TypeScript",
              "PostgreSQL",
              "Railway",
              "Neon",
              "paystack"
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
            src="/images/projects/routeride-mckp.png"
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
            Routeride
          </h3>

          <a href="https://routerite.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2">-&gt;</span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-sm leading-7 text-black/55 md:text-base">
            A car ride sharing platform designed
            to help people find rides, connect with drivers and enjoy seamless travel experiences.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
               "Next.js",
              "Nest.js",
              "Node.js",
              "flutter.js",
              "TypeScript",
              "PostgreSQL",
              "Railway",
              "Neon",
              "paystack"
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
            src="/images/projects/skyhealth-mckp.png"
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
            SkyHealth Healthcare Platform
          </h3>

          <a href="https://skyhealth.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2">-&gt;</span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-sm leading-7 text-black/55 md:text-base">
            A healthcare platform designed to help users access medical services, connect with healthcare providers and manage their health records through a seamless digital experience.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
               "Next.js",
              "Nest.js",
              "Node.js",
              "flutter.js",
              "TypeScript",
              "PostgreSQL",
              "Railway",
              "Neon",
              "paystack"
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
            src="/images/projects/fashion-designer.png"
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
            11 / Web & Mobile
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Fashion Designer Portfolio
          </h3>

          <a href="https://grandbox.vercel.app" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center border-b border-black pb-1 text-sm font-semibold transition-colors hover:border-[#00A9A5] hover:text-[#00A9A5]">
            View project <span aria-hidden="true" className="ml-2">-&gt;</span>
          </a>
        </div>


        <div className="max-w-2xl">

          <p className="text-sm leading-7 text-black/55 md:text-base">
            A fashion designer portfolio website showcasing creative work and professional experience.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
               "Next.js",
              "Nest.js",
              "Node.js",
              "flutter.js",
              "TypeScript",
              "PostgreSQL",
              "Railway",
              "Neon",
              "paystack"
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
                  2018 — Present
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Grenstack Technology 
                </h3>

                <p className="mt-1 text-sm text-[#00A9A5]">
                  Founder / Senior Software Engineer
                </p>

                <p className="mt-5 max-w-xl text-base leading-7 text-black/55">
                  Designing and developing web and mobile applications,
                  backend systems and digital products for businesses,
                  startups and conglomerates.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "Flutter",
                    "Next.js",
                    "Node.js",
                    "TypeScript",
                    "Databases",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm text-black/40 md:text-right">
                Lagos, Nigeria
              </div>

            </div>


            {/* Experience 02 */}
            <div className="grid gap-6 border-b border-black/15 py-10 md:grid-cols-[150px_1fr_120px]">

              <div>
                <p className="text-sm text-black/40">
                 2022 - 2025
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Gentleboard Real Estate
                </h3>

                <p className="mt-1 text-sm text-[#00A9A5]">
                  Software Developer
                </p>

                <p className="mt-5 max-w-xl text-base leading-7 text-black/55">
                  Building responsive websites, mobile applications,
                  APIs and database-driven systems with a focus on
                  usability and reliable performance.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "Flutter",
                    "JavaScript",
                    "React",
                    "Node.js",
                    "REST APIs",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm text-black/40 md:text-right">
                Lagos,Nigeria
              </div>

            </div>


            {/* Experience 03 */}
            <div className="grid gap-6 border-b border-black/15 py-10 md:grid-cols-[150px_1fr_120px]">

              <div>
                <p className="text-sm text-black/40">
                  Previous
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Data Analyst
                </h3>

                <p className="mt-1 text-sm text-[#00A9A5]">
                  Data & Business Intelligence
                </p>

                <p className="mt-5 max-w-xl text-base leading-7 text-black/55">
                  Working with data to clean, analyze and visualize
                  information, helping transform raw datasets into
                  useful business insights and decisions.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "Excel",
                    "SQL",
                    "MySQL",
                    "Tableau",
                    "Data Cleaning",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm text-black/40 md:text-right">
                Nigeria
              </div>

            </div>


            {/* Experience 04 */}
            <div className="grid gap-6 py-10 md:grid-cols-[150px_1fr_120px]">

              <div>
                <p className="text-sm text-black/40">
                  Earlier
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Business Development
                </h3>

                <p className="mt-1 text-sm text-[#00A9A5]">
                  Strategy & Growth
                </p>

                <p className="mt-5 max-w-xl text-base leading-7 text-black/55">
                  Combining technology, strategy and business thinking
                  to identify opportunities, develop solutions and
                  help organizations grow.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "Strategy",
                    "Business Development",
                    "Product Thinking",
                    "Planning",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm text-black/40 md:text-right">
                Nigeria
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
        className="bg-[#f5f5f0] px-6 py-28 md:px-12 md:py-40 lg:px-16"
      >

        <div className="max-w-6xl">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
            Have a project?
          </p>

          <h2 className="mt-6 text-[15vw] font-bold leading-[0.8] tracking-[-0.07em] md:text-[11vw]">
            LET&apos;S
            <br />
            <span className="text-[#00A9A5]">
              TALK.
            </span>
          </h2>

        </div>


        <div className="mt-16 flex flex-col justify-between gap-10 border-t border-black/15 pt-8 md:flex-row md:items-end">

          <div>

            <p className="max-w-md text-lg leading-8 text-black/55">
              Have an idea, project or opportunity you&apos;d like to
              discuss? I&apos;d love to hear about it.
            </p>

          </div>


          <a
            href="mailto:jollofdudu@gmail.com"
            className="group flex items-center gap-5"
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
              J<span className="text-[#00A9A5]">.</span>DUDU
            </p>

            <p className="mt-2 text-sm text-black/40">
              Software Engineer · Web & Mobile Developer
            </p>

          </div>


          <div className="flex flex-wrap gap-6 text-sm">

            <a
              href="#"
              className="transition-opacity hover:opacity-50"
            >
              LinkedIn
            </a>

            <a
              href="#"
              className="transition-opacity hover:opacity-50"
            >
              GitHub
            </a>

            <a
              href="#"
              className="transition-opacity hover:opacity-50"
            >
              X / Twitter
            </a>

          </div>

        </div>


        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-black/10 pt-5 text-xs text-black/40 md:flex-row">

          <p>
            © {new Date().getFullYear()} Jolomi Dudu. All rights reserved.
          </p>

          <p>
            Built By Oritsejolomi
          </p>

        </div>

      </footer>

    </main>
  );
}