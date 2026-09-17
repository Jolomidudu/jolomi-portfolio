import type { Metadata } from "next";
import SiteChrome from "../site-chrome";

export const metadata: Metadata = {
  title: "Notifications | Jolomi Dudu",
  description: "News, updates and useful information from Jolomi Dudu.",
};

const updates = [
  ["New service packages", "Explore the updated services and pricing page for web, mobile, design and analytics work."],
  ["Now booking project conversations", "Have an idea or an existing product that needs attention? Start with a short discovery call."],
  ["New learning sessions", "Practical one-to-one sessions are available for websites, graphic design and mobile app development."],
  ["Following the work", "New journal notes and project updates will be shared here as they are published."],
];

export default function NotificationsPage() {
  return (
    <SiteChrome>
      <main className="min-h-screen bg-[#f5f5f0] px-6 pb-24 pt-20 text-[#111111] md:px-12 md:pb-32 md:pt-28 lg:px-16">
        <div className="mx-auto max-w-5xl"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">Updates</p><h1 className="mt-6 max-w-3xl text-6xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-8xl">News worth knowing.</h1><div className="mt-16 divide-y divide-black/15 border-y border-black/15">{updates.map(([title, description], index) => <article key={title} className="grid gap-5 py-8 md:grid-cols-[100px_1fr]"><span className="text-sm text-black/40">0{index + 1}</span><div><h2 className="text-2xl font-semibold">{title}</h2><p className="mt-3 max-w-2xl leading-7 text-black/60">{description}</p></div></article>)}</div></div>
      </main>
    </SiteChrome>
  );
}
