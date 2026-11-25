import React, { useMemo, useState } from 'react';
import { formatCompactCurrency, formatCurrency } from '../lib/calculators';

export interface ChartSeries {
  label: string;
  color: string;
  values: number[];
  dashed?: boolean;
}

interface ProjectionChartProps {
  xLabels: string[];
  series: ChartSeries[];
  title: string;
  subtitle?: string;
}

export function ProjectionChart({ xLabels, series, title, subtitle }: ProjectionChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const width = 720;
  const height = 270;
  const padLeft = 64;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 34;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const { maxVal, yTicks } = useMemo(() => {
    let max = 1;
    for (const s of series) {
      for (const v of s.values) {
        if (Number.isFinite(v) && v > max) max = v;
      }
    }
    const niceMax = max * 1.08;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => niceMax * t);
    return { maxVal: niceMax, yTicks: ticks };
  }, [series]);

  const count = xLabels.length;
  const getX = (idx: number) =>
    count <= 1 ? padLeft : padLeft + (idx / (count - 1)) * plotW;
  const getY = (val: number) =>
    padTop + plotH - Math.max(0, Math.min(1, val / maxVal)) * plotH;

  const activeIdx = hoverIdx !== null ? Math.min(count - 1, Math.max(0, hoverIdx)) : count - 1;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (count <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * width;
    const clamped = Math.max(padLeft, Math.min(width - padRight, relX));
    const ratio = (clamped - padLeft) / plotW;
    setHoverIdx(Math.round(ratio * (count - 1)));
  };

  const xTickIndices = useMemo(() => {
    if (count <= 1) return [0];
    if (count <= 6) return xLabels.map((_, i) => i);
    return [
      0,
      Math.floor((count - 1) * 0.25),
      Math.floor((count - 1) * 0.5),
      Math.floor((count - 1) * 0.75),
      count - 1,
    ];
  }, [count, xLabels]);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 print-break-inside-avoid">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {series.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span
                className="inline-block w-3 h-0.5 rounded-full"
                style={{
                  backgroundColor: s.dashed ? 'transparent' : s.color,
                  borderTop: s.dashed ? `2px dashed ${s.color}` : undefined,
                }}
                aria-hidden="true"
              />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live readout strip */}
      {count > 0 && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 dark:bg-slate-950/70 px-3.5 py-2 border border-slate-200/70 dark:border-slate-800/70 text-xs">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {xLabels[activeIdx]}
          </span>
          <div className="flex flex-wrap items-center gap-4">
            {series.map((s) => (
              <span key={s.label} className="font-mono tabular-nums text-slate-900 dark:text-slate-100">
                <span className="text-slate-500 dark:text-slate-400 font-sans mr-1.5">{s.label}:</span>
                {formatCurrency(s.values[activeIdx] ?? 0)}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          role="img"
          aria-label={title}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIdx(null)}
        >
          {/* Horizontal grid lines */}
          {yTicks.map((val, i) => {
            const y = getY(val);
            return (
              <g key={i}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth={1}
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono tabular-nums"
                >
                  {formatCompactCurrency(val)}
                </text>
              </g>
            );
          })}

          {/* Primary area fill for series 0 */}
          {series[0] && count > 1 && (
            <path
              d={`M ${getX(0)} ${getY(0)} ${series[0].values
                .map((v, i) => `L ${getX(i)} ${getY(v)}`)
                .join(' ')} L ${getX(count - 1)} ${getY(0)} Z`}
              fill={series[0].color}
              fillOpacity={0.11}
            />
          )}

          {/* Lines */}
          {series.map((s) => {
            if (count <= 1) return null;
            const d = s.values
              .map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(v)}`)
              .join(' ');
            return (
              <path
                key={s.label}
                d={d}
                fill="none"
                stroke={s.color}
                strokeWidth={s.dashed ? 1.8 : 2.4}
                strokeDasharray={s.dashed ? '5 4' : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}

          {/* Hover vertical guide & dots */}
          {count > 0 && (
            <g>
              <line
                x1={getX(activeIdx)}
                y1={padTop}
                x2={getX(activeIdx)}
                y2={padTop + plotH}
                className="stroke-slate-400/60 dark:stroke-slate-600/60"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              {series.map((s) => (
                <circle
                  key={s.label}
                  cx={getX(activeIdx)}
                  cy={getY(s.values[activeIdx] ?? 0)}
                  r={4}
                  fill={s.color}
                  className="stroke-white dark:stroke-slate-900"
                  strokeWidth={2}
                />
              ))}
            </g>
          )}

          {/* X axis labels */}
          {xTickIndices.map((idx) => (
            <text
              key={idx}
              x={getX(idx)}
              y={height - 10}
              textAnchor="middle"
              className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono"
            >
              {xLabels[idx]}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
