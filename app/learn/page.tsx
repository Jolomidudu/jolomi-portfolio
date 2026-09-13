import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Learn with Jolomi | Jolomi Dudu",
  description: "Practical one-to-one tutoring for websites, graphics design and mobile app development.",
};

const tracks = [
  ["01", "Build websites", "HTML, CSS, JavaScript, React and deployment through a real project."],
  ["02", "Design graphics", "The principles, tools and repeatable workflow behind useful visual design."],
  ["03", "Create mobile apps", "Plan, design and ship a cross-platform app with Flutter."],
];

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-[#dce9e3] text-[#111111]">
      <nav className="flex items-center justify-between px-6 py-6 md:px-12 lg:px-16"><Link href="/" className="text-xl font-bold tracking-tight">JOLOMI<span className="text-[#00A9A5]">.</span>DUDU</Link><div className="flex gap-6 text-sm font-medium"><Link href="/services">SERVICES</Link><Link href="/blog">JOURNAL</Link></div></nav>
      <section className="px-6 pb-24 pt-20 md:px-12 md:pb-32 md:pt-28 lg:px-16"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#078f8a]">Mentorship & tutoring</p><div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end"><h1 className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-8xl">Learn by making something real.</h1><p className="max-w-md text-lg leading-8 text-black/60">Private, practical sessions for beginners and early-career creatives who want direction, feedback and a project they can show.</p></div></section>
      <section className="bg-[#111111] px-6 py-20 text-[#f5f5f0] md:px-12 md:py-28 lg:px-16"><div className="divide-y divide-white/15 border-y border-white/15">{tracks.map(([number, title, description]) => <article key={number} className="grid gap-6 py-8 md:grid-cols-[80px_1fr] md:py-10"><span className="text-sm text-white/35">{number}</span><div><h2 className="text-3xl font-semibold md:text-5xl">{title}</h2><p className="mt-4 max-w-2xl leading-7 text-white/55">{description}</p></div></article>)}</div></section>
      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-16"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#078f8a]">A simple rhythm</p><h2 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl">One clear lesson. One useful outcome.</h2><p className="mt-8 max-w-xl text-lg leading-8 text-black/60">Sessions are ₦35,000 for 90 minutes. We define your goal before we meet, work through the problem together and leave you with a small action plan.</p><a href="mailto:jollofdudu@gmail.com?subject=Tutoring%20enquiry" className="mt-8 inline-flex rounded-full bg-[#111111] px-6 py-4 text-sm font-semibold text-white">Book a learning session ↗</a></div></section>
    </main>
  );
}
