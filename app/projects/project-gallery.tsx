"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { caseStudies } from "./case-studies";

type Project = {
  name: string;
  category: string;
  image: string;
  alt: string;
  href: string;
  description: string;
  stacks: readonly string[];
};

const categories = [
  { id: "all", label: "ALL PROJECTS" },
  { id: "web-app", label: "WEB APP" },
  { id: "mobile", label: "MOBILE" },
  { id: "uiux", label: "UIUX" },
  { id: "analytics", label: "ANALYTICS" },
  { id: "bdm", label: "BDM" },
  { id: "digital-marketing", label: "DIGI-MARKETING" },
  { id: "cybersecurity", label: "CYBERSECURITY" },
  { id: "cloud", label: "CLOUD" },
] as const;

type CategoryId = (typeof categories)[number]["id"];

function matchesCategory(project: Project, category: CategoryId) {
  switch (category) {
    case "all":
      return true;
    case "web-app":
      return project.category === "Web App" || project.category === "Web & Mobile";
    case "mobile":
      return project.category === "Mobile App" || project.category === "Web & Mobile";
    case "cloud":
      return project.stacks.includes("AWS");
    default:
      return false;
  }
}

export default function ProjectGallery({ projects }: { projects: readonly Project[] }) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const categoryLabel = categories.find(({ id }) => id === activeCategory)?.label ?? "projects";
  const filteredProjects = projects.filter((project) => matchesCategory(project, activeCategory));
  const filteredCaseStudies = caseStudies.filter((caseStudy) =>
    activeCategory === "all" || caseStudy.category === activeCategory,
  );

  return (
    <section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-16">
      <nav aria-label="Filter projects by category" className="-mx-6 mb-6 overflow-x-auto px-6 pb-2 sm:mx-0 sm:px-0">
        <div className="flex w-max gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              aria-pressed={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`shrink-0 rounded-md border px-4 py-2.5 text-xs font-semibold transition-colors sm:text-sm ${activeCategory === category.id ? "border-[#343434] bg-[#343434] text-white" : "border-black/15 bg-transparent text-[#343434] hover:bg-black/5"}`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {filteredProjects.map((project) => (
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
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
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

        {filteredCaseStudies.map((caseStudy) => (
          <article key={caseStudy.id} className="flex flex-col rounded-lg border border-white/10 bg-[#343434] p-5 text-[#f5f5f0] shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#78d8ca]">
                {caseStudy.discipline}
              </p>
              <span className="shrink-0 rounded-full border border-white/20 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.1em] text-white/60">
                Illustrative
              </span>
            </div>
            <h2 className="mt-5 text-lg font-semibold leading-tight sm:text-xl">{caseStudy.title}</h2>

            <div className="mt-5 space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">Problem</h3>
                <p className="mt-1.5 text-sm leading-6 text-white/75">{caseStudy.problem}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">Solution</h3>
                <p className="mt-1.5 text-sm leading-6 text-white/75">{caseStudy.solution}</p>
              </div>
            </div>

            {caseStudy.cloudServices && (
              <section className="mt-5 border-t border-white/10 pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                  Cloud services, use &amp; solution
                </h3>
                <ul className="mt-3 space-y-3">
                  {caseStudy.cloudServices.map((cloudService) => (
                    <li key={cloudService.name} className="border-t border-white/10 pt-3 first:border-0 first:pt-0">
                      <h4 className="text-sm font-semibold text-white">{cloudService.name}</h4>
                      <p className="mt-1 text-xs leading-5 text-white/65">
                        <span className="font-semibold text-white/80">Used for: </span>
                        {cloudService.usedFor}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-white/65">
                        <span className="font-semibold text-white/80">Solution: </span>
                        {cloudService.solution}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-auto pt-5">
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">Outputs</h3>
              <ul className="mt-2 space-y-1.5">
                {caseStudy.outputs.map((output) => (
                  <li key={output} className="flex gap-2 text-xs leading-5 text-white/65">
                    <span aria-hidden="true" className="text-[#78d8ca]">/</span>
                    {output}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}

        {filteredProjects.length === 0 && filteredCaseStudies.length === 0 && (
          <div className="col-span-full border-y border-black/10 py-10">
            <h2 className="text-xl font-semibold">No {categoryLabel} case studies yet</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-black/55">
              This category does not have any portfolio entries yet. Add project details or problem-and-solution case studies to show them here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}