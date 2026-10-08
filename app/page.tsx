
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUp, ArrowUpRight, ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import ProjectRequestLauncher from "./projects/project-request-launcher";
const homepageProjects = [
  {
    name: "Festyvibe",
    image: "/images/projects/festyvibe.jpg",
    alt: "Festyvibe event platform",
    href: "https://festyvibe.vercel.app",
  },
  {
    name: "BudgetAll",
    image: "/images/projects/budgetall.jpg",
    alt: "BudgetAll financial platform",
    href: "https://budgetall.vercel.app",
  },
  {
    name: "Lovenorth",
    image: "/images/projects/lovenorth-mckp.png",
    alt: "Lovenorth dating platform",
    href: "https://lovenorth.vercel.app",
  },
  {
    name: "Kids College",
    image: "/images/projects/kidscollege.jpg",
    alt: "School Management Platform",
    href: "https://kcbn.vercel.app",
  },
] as const;

const heroTitles = [
  "A\nTECHNOLOGY LEADER.",
  "A\nSOFTWARE ENGINEER.",
  "A\nTECHNOLOGY CONSULTANT.",
  "A\nDIGITAL TRANSFORMATION LEADER.",
] as const;

const aboutLinks = [
  ["ABOUT", "/about"],
  ["EXPERIENCE", "/experience"],
  ["FAQS", "/faq"],
] as const;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState<"main" | "about">("main");
  const [atPageEnd, setAtPageEnd] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [activeTitle, setActiveTitle] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setAtPageEnd(
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8,
      );
      setHeaderScrolled(window.scrollY > 120);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const titleInterval = window.setInterval(() => {
      setActiveTitle((currentTitle) => (currentTitle + 1) % heroTitles.length);
    }, 4500);

    return () => window.clearInterval(titleInterval);
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f5f0] text-[#111111]">

      {/* =====================================================
          NAVIGATION
      ====================================================== */}
      <nav className={`fixed inset-x-0 top-0 z-50 flex min-h-20 shrink-0 items-center justify-between px-6 pb-5 pt-[50px] transition-all duration-300 md:px-12 md:py-5 lg:px-16 ${menuOpen ? "bg-[#12211f] text-[#f5f5f0]" : headerScrolled ? "bg-[#f5f5f0] text-[#111111]" : "bg-transparent text-white"}`}>

        <a
          href="#"
          className="flex items-center overflow-hidden rounded-full border border-[#12211f]/10 bg-white shadow-sm ring-1 ring-black/5"
          aria-label="Home"
        >
          <img
            src="/jolo.jpg"
            alt="Jolomi Dudu"
            className="h-10 w-10 object-cover"
          />
        </a>

        <div className={`hidden items-center gap-8 text-sm font-medium transition-colors md:flex ${headerScrolled ? "text-[#111111]" : "text-white"}`}>
          
          <a
            href="/"
            className="transition-opacity hover:opacity-50"
          >
            HOME
          </a>

          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 transition-opacity hover:opacity-50">
              <span>ABOUT</span>
              <ChevronDown aria-hidden="true" className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="absolute left-0 top-full z-[60] mt-4 min-w-48 border border-black/10 bg-[#f5f5f0] p-2 text-[#111111] shadow-xl">
              {aboutLinks.map(([label, href]) => (
                <a key={href} href={href} className="block px-4 py-3 transition-colors hover:bg-black/5 hover:text-[#008c87]">
                  {label}
                </a>
              ))}
            </div>
          </details>

          <a
            href="/services"
            className="transition-opacity hover:opacity-50"
          >
            SERVICES
          </a>

          <a
            href="/projects"
            className="transition-opacity hover:opacity-50"
          >
            PROJECTS
          </a>

          <a
            href="/learn"
            className="transition-opacity hover:opacity-50"
          >
            SKILLCRAFT
          </a>

          <Link
            href="/blog"
            className="transition-opacity hover:opacity-50"
          >
            BLOG
          </Link>

          <a
            href="/contact"
            className="transition-opacity hover:opacity-50"
          >
            CONTACT
          </a>
        </div>

        <ProjectRequestLauncher variant="header" />

       

        <div className="flex items-center gap-1 md:hidden">
          <button
            className={`flex h-9 w-9 items-center justify-center rounded-full border text-white transition-colors ${menuOpen ? "border-white/40 bg-[#12211f] hover:bg-[#1f2937]" : headerScrolled ? "border-[#374151] bg-[#374151] hover:bg-[#1f2937]" : "border-white/50 bg-white/10 hover:bg-white/20"}`}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => {
              setMenuOpen(!menuOpen);
              setMenuView("main");
            }}
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
              <span>{menuView === "main" ? "Menu / Open to Collaboration" : "About / Explore"}</span>
            </div>

            <nav className="flex flex-1 flex-col" aria-label="Mobile navigation">
              {menuView === "main" ? (
                <>
                  {[
                    ["HOME", "/"],
                    
                  ].map(([label, href], index) => (
                    <a
                      key={href}
                      href={href}
                      className="group flex items-center justify-between border-b border-white/15 py-4 transition-colors first:border-t hover:text-[#78d8ca]"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="flex items-center gap-4">
                        <span className="text-xs font-normal text-white/35">0{index + 1}</span>
                        <span className="text-[1.3125rem] font-semibold tracking-[-0.04em]">{label}</span>
                      </span>
                      <ArrowUpRight aria-hidden="true" className="h-5 w-5 text-white/35 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#78d8ca]" />
                    </a>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => setMenuView("about")}
                    className="group flex items-center justify-between border-b border-white/15 py-4 text-left transition-colors hover:text-[#78d8ca]"
                  >
                    <span className="flex items-center gap-4">
                      <span className="text-xs font-normal text-white/35">02</span>
                      <span className="text-[1.3125rem] font-semibold tracking-[-0.04em]">ABOUT</span>
                    </span>
                    <ChevronRight aria-hidden="true" className="h-6 w-6 text-white/35 transition-transform group-hover:translate-x-1 group-hover:text-[#78d8ca]" />
                  </button>
                  {[
                    
                    ["SERVICES", "/services"],
                    ["PROJECTS", "/projects"],
                    ["SKILLCRAFT", "/learn"],
                    ["MY BLOG", "/blog"],
                    ["CONTACT", "/contact"],
                  ].map(([label, href], index) => (
                    <a
                      key={href}
                      href={href}
                      className="group flex items-center justify-between border-b border-white/15 py-4 transition-colors hover:text-[#78d8ca]"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="flex items-center gap-4">
                        <span className="text-xs font-normal text-white/35">0{index + 3}</span>
                        <span className="text-[1.3125rem] font-semibold tracking-[-0.04em]">{label}</span>
                      </span>
                      <ArrowUpRight aria-hidden="true" className="h-5 w-5 text-white/35 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#78d8ca]" />
                    </a>
                  ))}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setMenuView("main")}
                    className="mb-5 flex items-center gap-3 self-start py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white/65 transition-colors hover:text-[#78d8ca]"
                  >
                    <ArrowLeft aria-hidden="true" className="h-5 w-5" /> Main menu
                  </button>
                  {aboutLinks.map(([label, href], index) => (
                    <a
                      key={href}
                      href={href}
                      onClick={() => { setMenuOpen(false); setMenuView("main"); }}
                      className="group flex items-center justify-between border-b border-white/15 py-4 transition-colors first:border-t hover:text-[#78d8ca]"
                    >
                      <span className="flex items-center gap-4">
                        <span className="text-xs font-normal text-white/35">0{index + 1}</span>
                        <span className="text-[1.3125rem] font-semibold tracking-[-0.04em]">{label}</span>
                      </span>
                      <ArrowUpRight aria-hidden="true" className="h-5 w-5 text-white/35 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#78d8ca]" />
                    </a>
                  ))}
                </>
              )}
            </nav>
          </div>
        )}

      </nav>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2 md:bottom-6">
        <span className="-translate-y-[30px] rotate-90 text-[10px] font-bold uppercase tracking-[0.12em] text-[#5d5a5a] md:-translate-y-[15px]">
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
          {atPageEnd ? <ArrowUp aria-hidden="true" className="h-5 w-5" /> : <ArrowDown aria-hidden="true" className="h-5 w-5" />}
        </button>
      </div>


      {/* =====================================================
          HERO
      ====================================================== */}
      <section
        className="relative flex min-h-[100svh] flex-col justify-center px-6 pb-16 pt-28 text-white md:px-12 md:pt-32 lg:px-16"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(17, 17, 17, 0.62), rgba(17, 17, 17, 0.38)), url('/suit.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100svh",
        }}
      >

        <div className="mb-8 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em]">

        </div>


        <div className="grid max-w-7xl grid-cols-1 items-center gap-4 sm:gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12">

          <div>
            <p className="mb-4 text-[19px] font-medium leading-tight md:text-xl">
              <span className="block">Hello, I am</span>
              <span className="block">Oritsejolomi Dudu</span>
            </p>

            <h1 aria-live="off" className="min-h-[2.46em] text-[9vw] font-bold leading-[0.82] tracking-[-0.07em] sm:text-[10vw] md:text-[4.9vw] lg:text-[4.41vw]">
              <span key={activeTitle} className="hero-title-enter block whitespace-pre-line break-words">
                {heroTitles[activeTitle]}
              </span>
            </h1>

            <div className="mt-5 flex items-center gap-2" aria-label="Choose a hero title">
              {heroTitles.map((title, index) => (
                <button
                  key={title}
                  type="button"
                  aria-label={`Show title ${index + 1}: ${title}`}
                  aria-current={activeTitle === index ? "true" : undefined}
                  onClick={() => setActiveTitle(index)}
                  className="flex h-6 w-8 items-center justify-center"
                >
                  <span className={`h-0.5 w-6 rounded-full transition-colors ${activeTitle === index ? "bg-white" : "bg-white/40 hover:bg-white/75"}`} />
                </button>
              ))}
            </div>

            <div className="mt-10 max-w-md sm:mt-14">
              <div className="mb-4 flex items-center gap-3 md:hidden">
                <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full border border-white/30 bg-white/80 text-center shadow-sm backdrop-blur-sm">
                  <span className="text-[0.68rem] font-black leading-none text-[#12211f]">10YRS+</span>
                  <span className="mt-1 text-[0.42rem] font-medium uppercase tracking-[0.12em] text-[#12211f]/70">Experience</span>
                </div>
                <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full border border-white/30 bg-white/80 text-center shadow-sm backdrop-blur-sm">
                  <span className="text-[0.74rem] font-black leading-none text-[#12211f]">145+</span>
                  <span className="mt-1 text-[0.42rem] font-medium uppercase tracking-[0.12em] text-[#12211f]/70">Projects</span>
                </div>
              </div>

              <div className="flex flex-row gap-2">
                
                <a
                  href="https://calendly.com/jollofdudu/let-s-discuss-your-project"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Call me"
                  title="Call me"
                  className="flex min-w-0 w-[33.75%] shrink-0 items-center justify-center gap-2 rounded-[0.65rem] border border-white/30 bg-white/70 px-2 py-3 text-center text-[#111111] backdrop-blur-sm transition-all hover:bg-white/80 hover:text-[#3a3a3a]"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.25rem] w-[1.25rem] fill-none stroke-current stroke-[1.8] md:h-[1.5rem] md:w-[1.5rem]">
                    <path d="M7.2 3.8h2.5l1.2 4.1-1.8 1.5a14.1 14.1 0 0 0 5.5 5.5l1.5-1.8 4.1 1.2v2.5a2 2 0 0 1-2.2 2A15.9 15.9 0 0 1 5.2 6a2 2 0 0 1 2-2.2Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[0.875rem] font-semibold md:text-[1.05rem]">Me</span>
                </a>
                <a
                  href="https://drive.google.com/uc?export=download&id=1OlSV-d0tRIhHxs8lupPQwdHQXd3lRx3T"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Download CV"
                  title="Download CV"
                  className="flex min-w-0 w-[33.75%] shrink-0 items-center justify-center gap-2 rounded-[0.65rem] border border-white/30 bg-white/70 px-2 py-3 text-center text-[#111111] backdrop-blur-sm transition-all hover:bg-white/80 hover:text-[#3a3a3a]"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.125rem] w-[1.125rem] shrink-0 fill-none stroke-current stroke-[1.8] md:h-[1.4rem] md:w-[1.4rem]">
                    <path d="M12 3v11m0 0 4-4m-4 4-4-4M5 16v4h14v-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[0.875rem] font-bold md:text-[1.05rem]">CV</span>
                </a>
              </div>

              <a
                href="#projects"
                aria-label="View projects"
                className="group -translate-x-[10px] mt-[25px] flex w-fit items-center pl-[7px] md:mt-[30px]"
              >
                <span className="flex items-center justify-between gap-3 rounded-[6px] border border-white/30 bg-white/70 px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] shadow-sm backdrop-blur-sm transition-all hover:bg-white/80 hover:text-[#3a3a3a] sm:text-sm">
                  <span className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[1.8]"><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="2.5" /></svg>
                    Projects
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/60 text-[10px] text-[#111111] transition-all duration-300 group-hover:bg-white/80 group-hover:text-[#3a3a3a]">
                    <ArrowDown aria-hidden="true" className="h-4 w-4" />
                  </span>
                </span>
              </a>
            </div>
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
  id="projects"
  className="bg-[#f5f5f0] px-6 py-24 md:px-12 md:py-32 lg:px-16"
>
  <div className="mb-16 grid gap-8 md:grid-cols-[1fr_0.45fr] md:items-end">

    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#751a1a]">
        Delivered
      </p>

      <h3 className="mt-5 text-[1.8rem] font-semibold tracking-[-0.05em] md:text-[2.25rem] lg:text-[2.7rem]">
        Featured Projects
      </h3>
    </div>

    <p className="max-w-sm text-sm leading-6 text-black/50 md:justify-self-end">
      A selection of digital products, platforms and applications
      I&apos;ve designed and developed across different industries.
    </p>

  </div>


<div className="grid grid-cols-2 gap-6 md:grid-cols-4">
    {homepageProjects.map((project) => (
      <article key={project.name} className="group overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
        <div className="overflow-hidden">
          <div className="relative aspect-[16/10]">
            <Image
              src={project.image}
              alt={project.alt}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#751a1a]/90">
              Featured
            </p>
            <h3 className="mt-2 text-1xl font-semibold tracking-tight text-[#111111]">
              {project.name}
            </h3>
          </div>

          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`View ${project.name}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-[#f5f5f0] text-lg text-[#111111] transition-colors hover:bg-[#111111] hover:text-white"
          >
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </article>
    ))}
  </div>

  <div className="mt-10 flex justify-center">
    
    <a
      href="/projects"
      className="inline-flex items-center justify-center rounded-full border border-black bg-[#343434] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#ffffff] transition-colors hover:bg-[#111111] hover:text-white"
    >
      VIEW FULL CATALOG
    </a>
  </div>
</section>


      {/* =====================================================
          EXPERTISE
      ====================================================== */}
      
      <section
  id="services"
  className="bg-[#343434] px-6 py-24 text-[#f5f5f0] md:px-12 md:py-32 lg:px-16"
>
  <div className="mb-20">
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
      Expertise
    </p>

    <h2 className="mt-5 max-w-5xl text-2xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-6xl lg:text-5xl">
      Technology,
      <span className="text-[#00A9A5]">
        {" "}engineered and led.
      </span>
    </h2>

    <p className="mt-8 max-w-3xl text-lg leading-8 text-white/85 md:text-xl">
      From leading technology teams and shaping ICT strategy to engineering
      scalable software and digital platforms, I work across both the
      technical and organizational layers of modern technology.
    </p>
  </div>

  <div className="divide-y divide-white/10 border-y border-white/10">

    {/* Expertise 01 */}
    <div className="group grid gap-6 py-10 md:grid-cols-[100px_1fr_100px] md:items-center">
      <span className="text-sm text-white/30">
        01
      </span>

      <div>
        <h3 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-[#00A9A5] md:text-5xl">
          Technology Leadership & ICT Management
        </h3>

        <p className="mt-4 max-w-3xl text-base leading-7 text-white/45">
          Leading technology functions, teams and initiatives across IT
          operations, software, infrastructure, governance and digital
          transformation.
        </p>
      </div>

      
    </div>

    {/* Expertise 02 */}
    <div className="group grid gap-6 py-10 md:grid-cols-[100px_1fr_100px] md:items-center">
      <span className="text-sm text-white/30">
        02
      </span>

      <div>
        <h3 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-[#00A9A5] md:text-5xl">
          Technology Strategy & Digital Transformation
        </h3>

        <p className="mt-4 max-w-3xl text-base leading-7 text-white/45">
          Aligning technology strategy, innovation and digital initiatives
          with organizational objectives, operational needs and long-term
          business growth.
        </p>
      </div>

      
    </div>

    {/* Expertise 03 */}
    <div className="group grid gap-6 py-10 md:grid-cols-[100px_1fr_100px] md:items-center">
      <span className="text-sm text-white/30">
        03
      </span>

      <div>
        <h3 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-[#00A9A5] md:text-5xl">
          Software Engineering & Architecture
        </h3>

        <p className="mt-4 max-w-3xl text-base leading-7 text-white/45">
          Designing and engineering scalable software systems, digital
          products and technology platforms from architecture through
          implementation and deployment.
        </p>
      </div>

      
    </div>

    {/* Expertise 04 */}
    <div className="group grid gap-6 py-10 md:grid-cols-[100px_1fr_100px] md:items-center">
      <span className="text-sm text-white/30">
        04
      </span>

      <div>
        <h3 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-[#00A9A5] md:text-5xl">
          IT Infrastructure, Cloud & Security
        </h3>

        <p className="mt-4 max-w-3xl text-base leading-7 text-white/45">
          Overseeing the technology foundations, infrastructure and security
          practices that keep organizations connected, secure, resilient
          and operational.
        </p>
      </div>

      
    </div>

    {/* Expertise 05 */}
    <div className="group grid gap-6 py-10 md:grid-cols-[100px_1fr_100px] md:items-center">
      <span className="text-sm text-white/30">
        05
      </span>

      <div>
        <h3 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-[#00A9A5] md:text-5xl">
          Technical Leadership & Delivery
        </h3>

        <p className="mt-4 max-w-3xl text-base leading-7 text-white/45">
          Leading cross-functional teams and technology initiatives from
          strategy and planning through implementation, delivery and
          continuous improvement.
        </p>
      </div>

     
    </div>

    {/* Expertise 06 */}
    <div className="group grid gap-6 py-10 md:grid-cols-[100px_1fr_100px] md:items-center">
      <span className="text-sm text-white/30">
        06
      </span>

      <div>
        <h3 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-[#00A9A5] md:text-5xl">
          Technology Consulting & Advisory
        </h3>

        <p className="mt-4 max-w-3xl text-base leading-7 text-white/45">
          Helping organizations evaluate technology, solve complex problems
          and make informed decisions around systems, architecture,
          platforms and digital initiatives.
        </p>
      </div>

     
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
            <h2 className="mt-5 max-w-xl text-2xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-6xl">Good work should make people&apos;s lives easier.</h2>
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
              <blockquote className="text-1xl font-medium leading-tight">&ldquo;{quote}&rdquo;</blockquote>
              <figcaption className="mt-12 text-sm text-[#78d8ca]">{author}</figcaption>
            </figure>
          ))}
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

          <p className="text-md font-bold uppercase tracking-[0.2em] text-[#751a1a]">
            GET IN TOUCH
          </p>

          <h2 className="mt-6 text-[25px] font-bold leading-[1.2] tracking-[-0.01em] md:text-[35px]">
            I really love to hear from you. 
            <br />
            <span className="text-[#751a1a]">
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

    

            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#343434] text-white transition-all group-hover:bg-black group-hover:text-white">
              <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
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

            <p className="mt-2 text-sm text-red/80">
              Technology Consultant
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


        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-black/10 pt-5 text-xs text-green/80 md:flex-row">

          <p>
            © {new Date().getFullYear()} Jolomi Dudu. All rights reserved.
          </p>

         

        </div>

      </footer>

    </main>
  );
}