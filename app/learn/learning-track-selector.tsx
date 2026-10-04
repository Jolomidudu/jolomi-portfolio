"use client";

import { useState } from "react";

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
  const [selectedNumber, setSelectedNumber] = useState(tracks[0]?.number);
  const selectedTrack = tracks.find(({ number }) => number === selectedNumber) ?? tracks[0];

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

      <article aria-live="polite" className="mt-6 bg-[#333232] p-6 sm:p-8 md:p-9">
        <div className="flex items-start justify-between gap-5">
          <span className="text-sm text-white/35">{selectedTrack.number}</span>
          <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/65">
            {selectedTrack.timeline}
          </span>
        </div>

        <h3 className="mt-6 max-w-xl text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
          {selectedTrack.title}
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
          {selectedTrack.short}
        </p>

        <div className="mt-7 border-t border-white/10 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#78d8ca]">
            What you will work on
          </p>
          <p className="mt-3 text-sm leading-6 text-white/75">{selectedTrack.topics}</p>
        </div>

        <div className="mt-7 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">Format</p>
            <p className="mt-2 text-sm text-[#95c1c4]">{selectedTrack.frequency}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">Estimated program</p>
            <p className="mt-2 text-sm text-[#5fe825]">{selectedTrack.timeline}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/65">Program fee</p>
            <p className="mt-2 text-2xl font-semibold text-[#d7f36a]">{selectedTrack.total}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">Deposit</p>
            <p className="mt-2 text-sm text-[#5fe825]">{selectedTrack.deposit}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">Monthly payment</p>
            <p className="mt-2 text-sm text-[#d7f36a]">{selectedTrack.monthly}</p>
          </div>
        </div>

        <div className="mt-7 border-t border-white/10 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#78d8ca]">
            Expected learning results
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {selectedTrack.results.map((result) => (
              <li key={result} className="flex gap-3 text-sm leading-6 text-white/85">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#78d8ca]" />
                <span>{result}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}