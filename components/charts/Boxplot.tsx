"use client";
import { Quartiles } from "@/lib/statistics/charts";

interface BoxplotProps {
  quartiles: Quartiles | null;
}

export default function Boxplot({ quartiles }: BoxplotProps) {
  if (!quartiles) return <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-subtle)' }}>Sin datos disponibles</div>;

  const allValues = [quartiles.min, quartiles.max, ...quartiles.outliers];
  const absMin = Math.min(...allValues);
  const absMax = Math.max(...allValues);
  
  const range = absMax - absMin === 0 ? 1 : absMax - absMin;
  
  const mapY = (val: number) => {
    const normalized = (val - absMin) / range;
    return 280 - (normalized * 260); // 280 bottom padding, 260 available height
  };

  return (
    <div style={{ width: '100%', height: '240px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="100%" height="100%" viewBox="0 0 200 300" style={{ overflow: 'visible' }}>
        {/* Y Axis line */}
        <line x1="20" y1="20" x2="20" y2="280" stroke="var(--border-subtle)" strokeWidth="1" />
        
        {/* Whiskers */}
        <line x1="80" y1={mapY(quartiles.max)} x2="80" y2={mapY(quartiles.min)} stroke="var(--text-muted)" strokeWidth="1.5" strokeDasharray="3 3" />
        
        {/* Top Whisker Cap (Max) */}
        <line x1="60" y1={mapY(quartiles.max)} x2="100" y2={mapY(quartiles.max)} stroke="var(--text-main)" strokeWidth="2" />
        
        {/* Bottom Whisker Cap (Min) */}
        <line x1="60" y1={mapY(quartiles.min)} x2="100" y2={mapY(quartiles.min)} stroke="var(--text-main)" strokeWidth="2" />
        
        {/* Box (Q1 to Q3) */}
        <rect 
          x="40" 
          y={mapY(quartiles.q3)} 
          width="80" 
          height={Math.max(1, mapY(quartiles.q1) - mapY(quartiles.q3))} 
          fill="var(--bg-tertiary)" 
          stroke="var(--border-focus)" 
          strokeWidth="1.5" 
          rx="2" 
        />
        
        {/* Median Line */}
        <line x1="40" y1={mapY(quartiles.median)} x2="120" y2={mapY(quartiles.median)} stroke="var(--accent-blue)" strokeWidth="2" />
        
        {/* Outliers */}
        {quartiles.outliers.map((outlier, i) => (
          <circle key={i} cx="80" cy={mapY(outlier)} r="3" fill="var(--text-subtle)" />
        ))}
        
        {/* Labels */}
        <text x="135" y={mapY(quartiles.median) + 4} fill="var(--text-main)" fontSize="12" fontWeight="500" fontFamily="var(--font-inter)">Md: {quartiles.median.toFixed(1)}</text>
        <text x="135" y={mapY(quartiles.q3) + 4} fill="var(--text-subtle)" fontSize="11" fontFamily="var(--font-inter)">Q3: {quartiles.q3.toFixed(1)}</text>
        <text x="135" y={mapY(quartiles.q1) + 4} fill="var(--text-subtle)" fontSize="11" fontFamily="var(--font-inter)">Q1: {quartiles.q1.toFixed(1)}</text>
      </svg>
    </div>
  );
}
