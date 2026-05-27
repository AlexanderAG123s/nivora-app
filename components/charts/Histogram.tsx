"use client";
import { useState } from "react";
import { BinData } from "@/lib/statistics/charts";

interface HistogramProps {
  bins: BinData[];
}

export default function Histogram({ bins }: HistogramProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  if (!bins || bins.length === 0) return <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-subtle)' }}>Sin datos disponibles</div>;

  const maxFreq = Math.max(...bins.map(b => b.frequency));
  const safeMax = maxFreq === 0 ? 1 : maxFreq;
  
  return (
    <div style={{ width: '100%', height: '240px', display: 'flex', alignItems: 'flex-end', gap: '4px', position: 'relative' }}>
      {/* Grid lines */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 0, pointerEvents: 'none' }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ borderTop: '1px solid var(--border-subtle)', width: '100%', height: '25%' }}></div>
        ))}
      </div>
      
      {/* Bars */}
      {bins.map((bin, i) => (
        <div 
          key={i}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{
            flex: 1,
            height: `${(bin.frequency / safeMax) * 100}%`,
            background: hoveredIndex === i ? 'var(--accent-blue)' : 'var(--accent-slate)',
            borderRadius: '4px 4px 0 0',
            position: 'relative',
            zIndex: 1,
            transition: 'background-color 0.15s ease, height 0.3s ease',
            cursor: 'pointer',
          }}
        >
          {hoveredIndex === i && (
            <div style={{
              position: 'absolute',
              top: '-30px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--bg-tertiary)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--text-main)',
              border: '1px solid var(--border-focus)',
              pointerEvents: 'none',
              zIndex: 10,
              fontFamily: 'var(--font-fira-code), monospace',
              whiteSpace: 'nowrap'
            }}>
              {bin.rangeStr} (f: {bin.frequency})
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
