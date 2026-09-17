import type { Metadata } from "next";
import SiteChrome from "../site-chrome";

export const metadata: Metadata = {
  title: "Privacy Policy | Jolomi Dudu",
  description: "Privacy information for the Jolomi Dudu website.",
};

export default function PrivacyPage() {
  return (
    <SiteChrome>
      <main className="min-h-screen bg-[#f5f5f0] px-6 pb-24 pt-20 text-[#111111] md:px-12 md:pb-32 md:pt-28 lg:px-16">
        <div className="mx-auto max-w-4xl"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">Privacy policy</p><h1 className="mt-6 text-6xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-8xl">Your information, handled with care.</h1><div className="mt-16 space-y-10 border-t border-black/15 pt-8 leading-8 text-black/65"><section><h2 className="text-2xl font-semibold text-[#111111]">Information you share</h2><p className="mt-3">When you contact me or book a conversation, I may receive your name, email address, project details and any other information you choose to provide.</p></section><section><h2 className="text-2xl font-semibold text-[#111111]">How it is used</h2><p className="mt-3">This information is used to respond to enquiries, prepare project proposals, deliver agreed services and communicate about active work.</p></section><section><h2 className="text-2xl font-semibold text-[#111111]">Cookies</h2><p className="mt-3">This website uses a small preference cookie to remember whether you accepted or rejected the cookie notice. You can change your browser settings to manage cookies.</p></section><section><h2 className="text-2xl font-semibold text-[#111111]">Questions</h2><p className="mt-3">For privacy questions, email <a className="text-[#00A9A5]" href="mailto:jollofdudu@gmail.com">jollofdudu@gmail.com</a>.</p></section></div></div>
      </main>
    </SiteChrome>
  );
}
