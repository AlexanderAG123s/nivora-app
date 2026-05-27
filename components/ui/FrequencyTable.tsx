"use client";
import { useState } from "react";
import { BinData } from "@/lib/statistics/charts";
import { SlidersHorizontal } from "lucide-react";

interface FrequencyTableProps {
  bins: BinData[];
}

export default function FrequencyTable({ bins }: FrequencyTableProps) {
  const [isAdvanced, setIsAdvanced] = useState(false);
  
  if (!bins || bins.length === 0) return null;

  return (
    <div className="tour-table">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }} className="no-print">
        <button 
          onClick={() => setIsAdvanced(!isAdvanced)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem',
            backgroundColor: isAdvanced ? 'var(--bg-tertiary)' : 'transparent', 
            border: '1px solid var(--border-subtle)', borderRadius: '6px',
            cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-main)',
            transition: 'all 0.15s ease'
          }}
        >
          <SlidersHorizontal size={14} /> 
          {isAdvanced ? 'Vista Simplificada' : 'Modo Avanzado'}
        </button>
      </div>
      <div style={{ width: '100%', overflowX: 'auto', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
              <th style={{ padding: '0.875rem 1rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Intervalo de Clase</th>
              {isAdvanced && <th style={{ padding: '0.875rem 1rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Marca (xᵢ)</th>}
              <th style={{ padding: '0.875rem 1rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Frecuencia (fᵢ)</th>
              {isAdvanced && <th style={{ padding: '0.875rem 1rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Frec. Acumulada (Fᵢ)</th>}
              <th style={{ padding: '0.875rem 1rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Frec. Relativa (hᵢ)</th>
              {isAdvanced && <th style={{ padding: '0.875rem 1rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Rel. Acumulada (Hᵢ)</th>}
              {isAdvanced && <th style={{ padding: '0.875rem 1rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Porcentaje (pᵢ)</th>}
              {!isAdvanced && <th style={{ padding: '0.875rem 1rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Frec. Acumulada</th>}
              {isAdvanced && <th style={{ padding: '0.875rem 1rem', fontWeight: 500, color: 'var(--text-subtle)' }}>xᵢ·fᵢ</th>}
              {isAdvanced && <th style={{ padding: '0.875rem 1rem', fontWeight: 500, color: 'var(--text-subtle)' }}>(xᵢ-x̄)²</th>}
            </tr>
          </thead>
          <tbody>
            {bins.map((row, i) => (
              <tr 
                key={i} 
                style={{ 
                  borderBottom: i !== bins.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '0.875rem 1rem', color: 'var(--text-main)' }}>{row.rangeStr}</td>
                {isAdvanced && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-main)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.xi.toFixed(2)}</td>}
                <td style={{ padding: '0.875rem 1rem', color: 'var(--text-main)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.frequency}</td>
                {isAdvanced && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.cumulative}</td>}
                <td style={{ padding: '0.875rem 1rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.relative}</td>
                {isAdvanced && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.Hi.toFixed(2)}</td>}
                {isAdvanced && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.percentage}</td>}
                {!isAdvanced && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.cumulative}</td>}
                {isAdvanced && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.xi_fi.toFixed(2)}</td>}
                {isAdvanced && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.xi_mean_sq.toFixed(2)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
