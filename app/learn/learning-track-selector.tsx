"use client";

import { useState } from "react";
import { formatCurrencyAmount, useCurrency } from "../currency-provider";

type LearningTrack = {
  number: string;
  shortTitle: string;
  title: string;
  short: string;
  topics: string;
  timeline: string;
  frequency: string;
  total: string;
  deposit: string;
  monthly: string;
  results: string[];
};

export default function LearningTrackSelector({ tracks }: { tracks: LearningTrack[] }) {
  const { currency, rate } = useCurrency();
  const [selectedNumber, setSelectedNumber] = useState(tracks[0]?.number);
  const selectedTrack = tracks.find(({ number }) => number === selectedNumber) ?? tracks[0];
  const parseAmount = (value: string) => Number(value.replace(/[^0-9.-]/g, ""));

  if (!selectedTrack) return null;

  return (
    <div className="mt-10">
      <div
        aria-label="Choose a learning track"
        className="flex snap-x gap-2 overflow-x-auto border-b border-white/15 pb-4"
      >
        {tracks.map((track) => (
          <button
            key={track.number}
            type="button"
            aria-pressed={selectedTrack.number === track.number}
            onClick={() => setSelectedNumber(track.number)}
            className={`flex shrink-0 snap-start items-center gap-2 rounded-md border px-4 py-3 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d7f36a] ${selectedTrack.number === track.number ? "border-[#d7f36a] bg-[#d7f36a] text-[#163d34]" : "border-white/20 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"}`}
          >
            <span className="text-[10px] opacity-60">{track.number}</span>
            {track.shortTitle}
          </button>
        ))}
      </div>

      <article aria-live="polite" className="mt-6 bg-[#ebeaea] p-6 sm:p-8 md:p-9">
        <div className="flex items-start justify-between gap-5">
          <span className="text-sm text-white/35">{selectedTrack.number}</span>
          <span className="rounded-full border border-[#111111]/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/65">
            {selectedTrack.timeline}
          </span>
        </div>
        

        <h3 className="mt-6 max-w-xl text-2xl text-[#3c3434]/85 font-semibold leading-tight sm:text-3xl md:text-4xl">
          {selectedTrack.title}
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#0a5417]">
          {selectedTrack.short}
          
        </p>

        <div className="mt-7 border-t border-[#111111]/80 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#2d2d2d]">
            What you will work on
          </p>
          <p className="mt-3 text-sm leading-6 text-[#111111]/75">{selectedTrack.topics}</p>
        </div>

        <div className="mt-7 grid gap-5 border-t border-[#111111]/80 pt-6 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111]/80">Format</p>
            <p className="mt-2 text-sm text-[#055155]">{selectedTrack.frequency}</p>
            
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111]/80">Estimated program</p>
            <p className="mt-2 text-sm text-[#214910]">{selectedTrack.timeline}</p>
          </div>
          
          <div className="sm:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111]/80">Program fee</p>
            <p className="mt-2 text-2xl font-semibold text-[#214910]">{formatCurrencyAmount(parseAmount(selectedTrack.total), currency, rate)}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111]/80">Deposit</p>
            <p className="mt-2 text-sm text-[#214910]">{formatCurrencyAmount(parseAmount(selectedTrack.deposit), currency, rate)}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111]/80">Monthly payment</p>
            <p className="mt-2 text-sm text-[#214910]">{formatCurrencyAmount(parseAmount(selectedTrack.monthly), currency, rate)}</p>
          </div>
        </div>

        <div className="mt-7 border-t border-white/10 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#251e1e]">
            Expected learning results
          </p>

          
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {selectedTrack.results.map((result) => (
              <li key={result} className="flex gap-3 text-sm leading-6 text-[#111111]/85">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#251e1e]" />
                <span>{result}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}