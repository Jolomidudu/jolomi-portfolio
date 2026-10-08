import type { Metadata } from "next";
import SiteChrome from "../site-chrome";
import ProjectGallery from "./project-gallery";

export const metadata: Metadata = {
  title: "Projects",
  description: "A portfolio of Jolomi Dudu's projects across web apps, mobile apps, SaaS products and digital platforms.",
};

const projects = [
  {
    name: "Festyvibe",
    category: "Web & Mobile",
    image: "/images/projects/festyvibe.jpg",
    alt: "Festyvibe Event Website",
    href: "https://festyvibe.vercel.app",
    description:
      "A premium event platform for customers to explore events, book tickets and discover experiences through a polished digital experience.",
    stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL", "Flutter"],
  },
  {
    name: "BudgetAll",
    category: "Web & Mobile",
    image: "/images/projects/budgetall.jpg",
    alt: "BudgetAll Financial Platform",
    href: "https://budgetall.vercel.app",
    description:
      "A financial budgeting platform designed to help users manage their finances, track expenses and achieve financial goals through a seamless digital experience.",
    stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL", "Flutter"],
  },
  {
    name: "Signvault",
    category: "Web & Mobile",
    image: "/images/projects/signvault.png",
    alt: "Signvault Digital Signage Platform",
    href: "https://signvaulty.vercel.app",
    description:
      "A premium digital signage platform for customers to create and manage engaging content for their displays.",
    stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL", "Flutter"],
  },
  // {
  //   name: "Myspa",
  //   category: "Web & Mobile",
  //   image: "/images/projects/myspa.jpg",
  //   alt: "Spa Elaris wellness website",
  //   href: "https://myspa.vercel.app",
  //   description:
  //     "A premium wellness & spa platform for customers to book appointments and explore services, treatments and packages through a polished digital experience.",
  //   stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL", "Flutter"],
  // },
  {
    name: "Kids College",
    category: "Web App",
    image: "/images/projects/kidscollege.jpg",
    alt: "School management platform dashboard",
    href: "https://kcbn.vercel.app",
    description:
      "A comprehensive school management system connecting administrators, teachers, students and parents through a centralized digital platform.",
    stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL"],
  },
  {
    name: "Lovenorth",
    category: "Web App",
    image: "/images/projects/loven.jpg",
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
    stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL"],
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
    stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL", "Flutter"],
  },
  {
    name: "Misan Logistics",
    category: "Web & Mobile",
    image: "/images/projects/misanlogistics-mckp.png",
    alt: "A logistics platform",
    href: "https://misanlogistics.vercel.app",
    description:
      "A logistics platform designed to help users discover, book and manage logistics services through a seamless digital experience.",
    stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL", "Flutter", "Wallet"],
  },
  {
    name: "CareCrowd",
    category: "Mobile App",
    image: "/images/projects/carecrowd-mckp.png",
    alt: "CARECROWD crowdfunding platform",
    href: "https://carecrowd.vercel.app",
    description:
      "A crowdfunding and digital community platform designed to help people raise funds, support causes and connect with communities.",
    stacks: ["Flutter"],
  },
  {
    name: "Routyride",
    category: "Web & Mobile",
    image: "/images/projects/routyride.jpg",
    alt: "Car ride sharing platform",
    href: "https://routyride.vercel.app",
    description:
      "A car ride hailing platform designed to help people find rides, connect with drivers and enjoy seamless travel experiences.",
    stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL", "Flutter"],
  },
  {
    name: "SkyHealth",
    category: "Web & Mobile",
    image: "/images/projects/skyhealth-mckp.jpg",
    alt: "SkyHealth healthcare platform",
    href: "https://skyhealth.vercel.app",
    description:
      "A healthcare platform designed to help users access medical services, connect with healthcare providers and manage their health records through a seamless digital experience.",
    stacks: ["Next.js", "Nest.js", "Node.js", "PostgreSQL", "Flutter"],
  },
  {
    name: "Grandbox",
    category: "Mobile App",
    image: "/images/projects/Grandbox.png",
    alt: "Fashion designer portfolio",
    href: "https://grandbox.vercel.app",
    description:
      "Granbox portfolio website showcasing creative work and professional experience.",
    stacks: ["Flutter"],
  },
] as const;

export default function ProjectsPage() {
  return (
    <SiteChrome headerMode="projects" projectRequestLauncher={false}>
      <main className="bg-[#f5f5f0] text-[#111111]">
        <section>
          <div
            className="px-6 pt-[122px] text-white md:px-12 md:pt-24 lg:px-16"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(13, 25, 25, 0.82), rgba(13, 25, 25, 0.34)), url('/office.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "top center",
            }}
          >
            <p className="text-lg font-bold uppercase tracking-[0.2em]">
              My CATALOG
            </p>
            <br></br>
            <hr className="border-white/70"></hr>
          </div>
          <div className="pb-12 md:pb-20" />
        </section>

        <ProjectGallery projects={projects} />
      </main>
    </SiteChrome>

    
  );
}
