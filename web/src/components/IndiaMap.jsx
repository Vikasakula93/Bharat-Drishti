import React from 'react';
import { DISTRICTS, LEVEL_COLORS, LEVEL_LABEL } from '../lib/data';

// Stylised interactive India map — positioned district nodes over an outline.
export default function IndiaMap({ selected, onSelect }) {
  return (
    <div className="relative w-full">
      <svg viewBox="0 0 100 100" className="w-full aspect-square max-h-[560px] grid-bg rounded-xl">
        <path
          d="M20 26 L34 20 L46 24 L52 20 L60 22 L70 20 L82 24 L88 30 L86 40 L80 44 L74 42 L70 50 L64 56 L60 64 L54 72 L46 82 L40 86 L36 80 L34 70 L28 60 L22 52 L16 46 L14 38 L18 30 Z"
          fill="hsl(199 89% 55% / 0.05)"
          stroke="hsl(199 89% 55% / 0.35)"
          strokeWidth="0.4"
        />
        {DISTRICTS.map((d) => {
          const active = selected?.name === d.name;
          return (
            <g key={d.id} onClick={() => onSelect(d)} className="cursor-pointer">
              <circle
                cx={d.x} cy={d.y}
                r={active ? 3.4 : 2.2}
                fill={LEVEL_COLORS[d.level]}
                stroke={active ? '#fff' : LEVEL_COLORS[d.level]}
                strokeWidth={active ? 0.7 : 0.3}
                className={d.level === 'critical' ? 'pulse-dot' : ''}
                opacity={0.9}
              />
              {active && (
                <circle cx={d.x} cy={d.y} r="5" fill="none" stroke={LEVEL_COLORS[d.level]} strokeWidth="0.4" opacity="0.6" />
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-3 mt-3">
        {Object.keys(LEVEL_COLORS).map((k) => (
          <span key={k} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: LEVEL_COLORS[k] }} />
            {LEVEL_LABEL[k]}
          </span>
        ))}
      </div>
    </div>
  );
}
