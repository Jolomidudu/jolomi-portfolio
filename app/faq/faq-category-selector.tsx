"use client";

import { useState } from "react";

type FAQCategory = {
  label: string;
  questions: string[][];
};

export default function FAQCategorySelector({
  categories,
}: {
  categories: FAQCategory[];
}) {
  const [selectedLabel, setSelectedLabel] = useState(categories[0]?.label);
  const selectedCategory =
    categories.find(({ label }) => label === selectedLabel) ?? categories[0];

  if (!selectedCategory) return null;

  return (
    <section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div
          aria-label="Choose an FAQ category"
          className="flex snap-x gap-2 overflow-x-auto border-b border-black/15 pb-4"
        >
          {categories.map((category) => (
            <button
              key={category.label}
              type="button"
              aria-pressed={selectedCategory.label === category.label}
              onClick={() => setSelectedLabel(category.label)}
              className={`shrink-0 snap-start rounded-md border px-4 py-3 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A9A5] ${selectedCategory.label === category.label ? "border-[#111111] bg-[#111111] text-white" : "border-black/15 bg-white/40 text-black/65 hover:bg-white hover:text-black"}`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
            {selectedCategory.label}
          </h2>
          <div className="mt-4 border-t border-black/15">
            {selectedCategory.questions.map(([question, answer]) => (
              <article
                key={question}
                className="border-b border-black/15 py-8 md:py-10"
              >
                <h3 className="max-w-3xl text-2xl font-semibold leading-tight tracking-[-0.02em] md:text-3xl">
                  {question}
                </h3>
                <p className="mt-4 max-w-3xl text-base leading-7 text-black/60">
                  {answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}