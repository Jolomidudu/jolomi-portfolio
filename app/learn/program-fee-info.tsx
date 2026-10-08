"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ProgramFeeInfo() {
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
        aria-label="Information about program fees"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[100px] right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#10233f] text-[10px] font-semibold lowercase text-white shadow-lg transition-colors hover:bg-[#1a355b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10233f]"
      >
        info
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="program-fee-title"
            className="w-full max-h-[75dvh] overflow-y-auto rounded-t-xl border border-black/10 bg-[#f5f5f0] px-6 pb-8 pt-6 shadow-2xl sm:max-w-lg sm:rounded-xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#008e8a]">
                  Program information
                </p>
                <h2 id="program-fee-title" className="mt-2 text-2xl font-semibold">
                  What program fees cover
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close program fee information"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/15 text-black/65 transition-colors hover:bg-black/5 hover:text-black"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-5 text-sm leading-7 text-black/65">
              Program fees cover mentorship, training sessions, learning materials, and cloud usage only. They do not cover devices such as laptops, tablets, phones, or other hardware. Third-party services are separate where applicable.
            </p>
          </section>
        </div>
      )}
    </>
  );
}