import React from 'react';

interface AdSlotProps {
  variant: 'header' | 'in-content' | 'sidebar' | 'footer';
  className?: string;
}

const SLOT_CONFIG: Record<
  AdSlotProps['variant'],
  { id: string; sizeText: string; minHeight: string; label: string }
> = {
  header: {
    id: 'adsense-header-leaderboard',
    sizeText: '728 × 90 Leaderboard',
    minHeight: 'min-h-[76px] md:min-h-[90px]',
    label: 'Sponsored Partner Placement',
  },
  'in-content': {
    id: 'adsense-in-content-responsive',
    sizeText: 'Responsive Display Unit',
    minHeight: 'min-h-[110px]',
    label: 'Advertisement',
  },
  sidebar: {
    id: 'adsense-sidebar-rectangle',
    sizeText: '300 × 250 Medium Rectangle',
    minHeight: 'min-h-[250px]',
    label: 'Advertisement',
  },
  footer: {
    id: 'adsense-footer-banner',
    sizeText: '728 × 90 Footer Banner',
    minHeight: 'min-h-[90px]',
    label: 'Advertisement',
  },
};

export function AdSlot({ variant, className = '' }: AdSlotProps) {
  const cfg = SLOT_CONFIG[variant];

  return (
    <div
      data-ad-slot={cfg.id}
      aria-label="Advertisement slot"
      className={`no-print w-full rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/50 flex flex-col items-center justify-center px-4 py-3 text-center transition-colors ${cfg.minHeight} ${className}`}
    >
      <span className="text-[11px] font-medium tracking-wide text-slate-400 dark:text-slate-500">
        {cfg.label}
      </span>
      <span className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
        Google AdSense Reserved Slot · {cfg.sizeText}
      </span>
    </div>
  );
}
