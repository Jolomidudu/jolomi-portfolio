"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setVisible(document.cookie.includes("jolomi-cookie-choice="));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const choose = (value: "accepted" | "rejected") => {
    document.cookie = `jolomi-cookie-choice=${value}; max-age=31536000; path=/; SameSite=Lax`;
    setVisible(true);
  };

  if (visible) return null;

  return <aside className="fixed bottom-4 left-4 right-4 z-[70] border border-black/15 bg-[#12211f] p-5 text-[#f5f5f0] shadow-2xl md:bottom-6 md:left-6 md:right-auto md:flex md:max-w-2xl md:items-center md:gap-8"><div><p className="font-semibold">A small note about cookies</p><p className="mt-2 text-sm leading-6 text-white/60">We use a preference cookie to remember your choice. Read the <Link href="/privacy" className="text-[#78d8ca] underline">privacy policy</Link>.</p></div><div className="mt-4 flex shrink-0 gap-3 md:mt-0"><button type="button" onClick={() => choose("rejected")} className="border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em]">Reject</button><button type="button" onClick={() => choose("accepted")} className="bg-[#78d8ca] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#12211f]">Accept</button></div></aside>;
}
