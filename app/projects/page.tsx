import type { Metadata } from "next";
import Image from "next/image";
import SiteChrome from "../site-chrome";
import ProjectRequestLauncher from "./project-request-launcher";

export const metadata: Metadata = {
  title: "Projects | Jolomi Dudu",
  description: "A portfolio of Jolomi Dudu's projects across web apps, mobile apps, SaaS products and digital platforms.",
};

const projects = [
  {
    name: "Spa Elaris",
    category: "Web & Mobile",
    image: "/images/projects/spaelaris1-mckp.jpg",
    alt: "Spa Elaris wellness website",
    href: "https://spaelaris.vercel.app",
    description:
      "A premium wellness & spa platform for customers to book appointments and explore services, treatments and packages through a polished digital experience.",
    stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL", "Flutter", "AWS"],
  },
  {
    name: "Kids College",
    category: "Web App",
    image: "/images/projects/kidscollege-mckp.png",
    alt: "School management platform dashboard",
    href: "https://kcbn.vercel.app",
    description:
      "A comprehensive school management system connecting administrators, teachers, students and parents through a centralized digital platform.",
    stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL", "AWS"],
  },
  {
    name: "Lovenorth",
    category: "Web App",
    image: "/images/projects/lovenorth-mckp.png",
    alt: "Lovenorth dating platform",
    href: "https://lovenorth.vercel.app",
    description:
      "A comprehensive dating platform connecting singles and helping them find meaningful relationships.",
    stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL", "Railway"],
  },
  {
    name: "Elvara Hotel",
    category: "Web App",
    image: "/images/projects/elvarahotel-mckp.jpg",
    alt: "A hotel booking platform",
    href: "https://elvarahotel.vercel.app",
    description:
      "A hotel booking platform designed to help users discover, book and manage hotel stays through a seamless digital experience.",
    stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL", "AWS"],
  },
  {
    name: "Spinett Cosmetics",
    category: "Web & Mobile",
    image: "/images/projects/spinettcosmetics-mckp.png",
    alt: "A cosmetics e-commerce platform",
    href: "https://spinettcosmetics.vercel.app",
    description:
      "A cosmetics e-commerce platform that allows users to browse and purchase beauty products from various brands.",
    stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL", "REST API"],
  },
  {
    name: "Mealcourt",
    category: "Web & Mobile",
    image: "/images/projects/mealcourt.jpg",
    alt: "A food delivery platform",
    href: "https://mealcourt.vercel.app",
    description:
      "A food delivery platform that connects users with local restaurants and enables seamless ordering and tracking.",
    stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL", "Flutter", "AWS"],
  },
  {
    name: "Misan Logistics",
    category: "Web & Mobile",
    image: "/images/projects/misanlogistics-mckp.png",
    alt: "A logistics platform",
    href: "https://misanlogistics.vercel.app",
    description:
      "A logistics platform designed to help users discover, book and manage logistics services through a seamless digital experience.",
    stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL", "Flutter", "AWS", "Wallet"],
  },
  {
    name: "CareCrowd",
    category: "Mobile App",
    image: "/images/projects/carecrowd-mckp.png",
    alt: "CARECROWD crowdfunding platform",
    href: "https://carecrowd.vercel.app",
    description:
      "A crowdfunding and digital community platform designed to help people raise funds, support causes and connect with communities.",
    stacks: ["Flutter", "AWS"],
  },
  {
    name: "Routyride",
    category: "Web & Mobile",
    image: "/images/projects/routyride.jpg",
    alt: "Car ride sharing platform",
    href: "https://routyride.vercel.app",
    description:
      "A car ride hailing platform designed to help people find rides, connect with drivers and enjoy seamless travel experiences.",
    stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL", "Flutter", "AWS"],
  },
  {
    name: "SkyHealth",
    category: "Web & Mobile",
    image: "/images/projects/skyhealth-mckp.jpg",
    alt: "SkyHealth healthcare platform",
    href: "https://skyhealth.vercel.app",
    description:
      "A healthcare platform designed to help users access medical services, connect with healthcare providers and manage their health records through a seamless digital experience.",
    stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL", "Flutter", "AWS"],
  },
  {
    name: "Grandbox",
    category: "Mobile App",
    image: "/images/projects/Grandbox.png",
    alt: "Fashion designer portfolio",
    href: "https://grandbox.vercel.app",
    description:
      "Granbox portfolio website showcasing creative work and professional experience.",
    stacks: ["Flutter", "AWS"],
  },
] as const;

export default function ProjectsPage() {
  return (
    <SiteChrome>
      <main className="bg-[#f5f5f0] text-[#111111]">
        <section className="px-6 pb-12 pt-12 md:px-12 md:pb-20 md:pt-16 lg:px-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
            My Projects
          </p>
        </section>

        <section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-16">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {projects.map((project) => (
              <article key={project.name} className="group overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="overflow-hidden">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                </div>

                <div className="space-y-4 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-black/45">
                      {project.category}
                    </p>
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${project.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-[#f5f5f0] text-base text-[#111111] transition-colors hover:bg-[#111111] hover:text-white"
                    >
                      ↗
                    </a>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">{project.name}</h2>
                    <p className="mt-3 text-sm leading-6 text-black/60">{project.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.stacks.map((stack) => (
                      <span key={`${project.name}-${stack}`} className="rounded-full border border-black/10 bg-[#f5f5f0] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-black/65">
                        {stack}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <ProjectRequestLauncher />
      </main>
    </SiteChrome>
  );
}
