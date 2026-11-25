import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQItem } from '../types/finance';

interface FaqAccordionProps {
  items: FAQItem[];
  title?: string;
}

export function FaqAccordion({ items, title = 'Frequently Asked Questions' }: FaqAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h2>
      <div className="mt-5 divide-y divide-slate-200 dark:divide-slate-800">
        {items.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={item.question} className="py-4 first:pt-2 last:pb-0">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="flex w-full items-center justify-between gap-4 text-left py-1 text-sm md:text-base font-medium text-slate-900 dark:text-slate-100 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-emerald-600' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl">
                  {item.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
