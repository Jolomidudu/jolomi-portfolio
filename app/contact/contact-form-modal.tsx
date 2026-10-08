"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Mail, X } from "lucide-react";

export default function ContactFormModal({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        aria-label="Message Me"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[100px] right-6 z-40 flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-full bg-[#163d34] text-[8px] font-semibold uppercase leading-tight text-white shadow-lg transition-transform hover:-translate-y-1 hover:bg-[#008c87] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163d34]"
      >
        <Mail aria-hidden="true" className="h-4 w-4" />
        <span>Message Me</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/55 sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-xl border border-black/10 bg-[#f5f5f0] px-5 pb-7 pt-5 shadow-2xl sm:rounded-xl sm:px-8 sm:pb-9 sm:pt-7"
          >
            <header className="sticky -top-5 z-10 -mx-5 -mt-5 mb-6 flex items-start justify-between gap-4 border-b border-black/10 bg-[#f5f5f0]/95 px-5 pb-4 pt-5 backdrop-blur sm:-top-7 sm:-mx-8 sm:-mt-7 sm:px-8 sm:pt-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#008c87]">
                  Project / engagement enquiry
                </p>
                <h2 id="contact-modal-title" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Tell me about your project.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50">
                  This form is designed to give enough context for the first conversation without making the enquiry unnecessarily complicated.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close contact form"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/15 text-black/60 transition-colors hover:bg-black/5 hover:text-black"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </header>
            {children}
          </section>
        </div>
      )}
    </>
  );
}
