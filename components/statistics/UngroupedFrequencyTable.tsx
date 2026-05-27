"use client";
import { useState } from "react";
import { InlineEquation, BlockEquation } from "@/components/ui/MathRenderer";
import { SkipForward, Info } from "lucide-react";

interface UngroupedFrequencyTableProps {
  data: number[];
}

const STEPS = [
  {
    id: 'xi',
    title: '1. Valores Únicos (xᵢ)',
    description: 'Identificamos todos los datos sin repetirlos y los ordenamos de menor a mayor.',
    cols: ['xi']
  },
  {
    id: 'fi',
    title: '2. Frecuencia Absoluta (fᵢ)',
    description: 'Contamos cuántas veces aparece exactamente cada valor único en la muestra total.',
    cols: ['xi', 'fi']
  },
  {
    id: 'acum',
    title: '3. Frecuencia Acumulada (Fᵢ)',
    description: 'Vamos sumando sucesivamente las frecuencias absolutas. El último valor debe ser igual a n.',
    formula: 'F_i = F_{i-1} + f_i',
    cols: ['xi', 'fi', 'Fi']
  },
  {
    id: 'fr',
    title: '4. Frecuencia Relativa (fᵣ)',
    description: 'Calculamos la proporción que representa cada valor dividiendo su frecuencia absoluta entre el total de datos (n).',
    formula: 'f_r = \\frac{f_i}{n}',
    cols: ['xi', 'fi', 'Fi', 'fr']
  },
  {
    id: 'abs_dev',
    title: '5. Desviación Absoluta (|xᵢ - x̄|)',
    description: 'Calculamos qué tan lejos está cada dato de la media aritmética general (x̄), tomando siempre su valor positivo.',
    formula: '|x_i - \\bar{x}|',
    cols: ['xi', 'fi', 'Fi', 'fr', 'absDev']
  },
  {
    id: 'sq_dev',
    title: '6. Desviación al Cuadrado ((xᵢ - x̄)²)',
    description: 'Elevamos al cuadrado la desviación obtenida en el paso anterior. Esto elimina los signos negativos y penaliza los valores más lejanos a la media.',
    formula: '(x_i - \\bar{x})^2',
    cols: ['xi', 'fi', 'Fi', 'fr', 'absDev', 'sqDev']
  },
  {
    id: 'product',
    title: '7. Producto de Varianza (fᵢ · (xᵢ - x̄)²)',
    description: 'Multiplicamos la desviación cuadrada por la cantidad de veces que aparece ese dato. La sumatoria de esta columna nos servirá para calcular la Varianza (s²).',
    formula: '\\text{Sumatoria} = \\sum f_i \\cdot (x_i - \\bar{x})^2',
    cols: ['xi', 'fi', 'Fi', 'fr', 'absDev', 'sqDev', 'fiSqDev']
  }
];

export default function UngroupedFrequencyTable({ data }: UngroupedFrequencyTableProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isInteractive, setIsInteractive] = useState(false);

  if (!data || data.length === 0) return null;

  // Calculate mean
  const n = data.length;
  const mean = data.reduce((a, b) => a + b, 0) / n;

  // Group by unique values
  const frequencyMap = new Map<number, number>();
  data.forEach(val => {
    frequencyMap.set(val, (frequencyMap.get(val) || 0) + 1);
  });

  // Sort unique values
  const uniqueValues = Array.from(frequencyMap.keys()).sort((a, b) => a - b);

  let cumulativeFi = 0;
  
  const rows = uniqueValues.map(xi => {
    const fi = frequencyMap.get(xi)!;
    cumulativeFi += fi;
    const fr = fi / n;
    
    const absDev = Math.abs(xi - mean);
    const sqDev = Math.pow(xi - mean, 2);
    const fiSqDev = fi * sqDev;

    return {
      xi,
      fi,
      Fi: cumulativeFi,
      fr,
      absDev,
      sqDev,
      fiSqDev
    };
  });

  const visibleCols = isInteractive ? STEPS[currentStep].cols : STEPS[STEPS.length - 1].cols;
  const currentStepData = STEPS[currentStep];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
            <input 
              type="checkbox" 
              checked={isInteractive}
              onChange={(e) => setIsInteractive(e.target.checked)}
              style={{ accentColor: 'var(--accent-blue)' }}
            />
            <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-main)' }}>Modo Constructor Paso a Paso</span>
          </label>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)' }}>Aprende paso a paso cómo se extraen los datos de la muestra.</p>
        </div>

        {isInteractive && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>Paso {currentStep + 1} de {STEPS.length}</span>
            <button 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              style={{ padding: '0.4rem 0.75rem', backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: '4px', cursor: currentStep === 0 ? 'not-allowed' : 'pointer', opacity: currentStep === 0 ? 0.5 : 1, color: 'var(--text-main)', fontSize: '0.8125rem' }}
            >
              Anterior
            </button>
            <button 
              onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
              disabled={currentStep === STEPS.length - 1}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.75rem', backgroundColor: 'var(--text-main)', border: 'none', borderRadius: '4px', cursor: currentStep === STEPS.length - 1 ? 'not-allowed' : 'pointer', opacity: currentStep === STEPS.length - 1 ? 0.5 : 1, color: 'var(--bg-primary)', fontWeight: 600, fontSize: '0.8125rem' }}
            >
              Siguiente <SkipForward size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Educational Panel */}
      {isInteractive && (
        <div style={{ backgroundColor: 'var(--bg-secondary)', borderLeft: '4px solid var(--accent-blue)', padding: '1.25rem', borderRadius: '4px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            <Info size={16} color="var(--accent-blue)" /> {currentStepData.title}
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-subtle)', lineHeight: '1.5', marginBottom: currentStepData.formula ? '1rem' : 0 }}>
            {currentStepData.description}
          </p>
          {currentStepData.formula && (
            <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '6px', overflowX: 'auto', textAlign: 'center' }}>
              <BlockEquation math={currentStepData.formula} />
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div style={{ width: '100%', overflowX: 'auto', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-tertiary)' }}>
              {visibleCols.includes('xi') && <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-subtle)' }}><InlineEquation math="x_i" /></th>}
              {visibleCols.includes('fi') && <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-subtle)' }}><InlineEquation math="f_i" /></th>}
              {visibleCols.includes('Fi') && <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-subtle)' }}><InlineEquation math="F_i" /></th>}
              {visibleCols.includes('fr') && <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-subtle)' }}><InlineEquation math="f_r" /></th>}
              {visibleCols.includes('absDev') && <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-subtle)' }}><InlineEquation math="|x_i - \bar{x}|" /></th>}
              {visibleCols.includes('sqDev') && <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-subtle)' }}><InlineEquation math="(x_i - \bar{x})^2" /></th>}
              {visibleCols.includes('fiSqDev') && <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-subtle)' }}><InlineEquation math="f_i \cdot (x_i - \bar{x})^2" /></th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr 
                key={i} 
                style={{ 
                  borderBottom: i !== rows.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {visibleCols.includes('xi') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-main)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.xi}</td>}
                {visibleCols.includes('fi') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-main)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.fi}</td>}
                {visibleCols.includes('Fi') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.Fi}</td>}
                {visibleCols.includes('fr') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.fr.toFixed(4)}</td>}
                {visibleCols.includes('absDev') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.absDev.toFixed(4)}</td>}
                {visibleCols.includes('sqDev') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.sqDev.toFixed(4)}</td>}
                {visibleCols.includes('fiSqDev') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.fiSqDev.toFixed(4)}</td>}
              </tr>
            ))}
            <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderTop: '2px solid var(--border-subtle)' }}>
              {visibleCols.includes('xi') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-main)', fontWeight: 600 }}>Total</td>}
              {visibleCols.includes('fi') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-main)', fontFamily: 'var(--font-fira-code), monospace', fontWeight: 600 }}>{n}</td>}
              {visibleCols.includes('Fi') && <td colSpan={1}></td>}
              {visibleCols.includes('fr') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-main)', fontFamily: 'var(--font-fira-code), monospace', fontWeight: 600 }}>1.0000</td>}
              {visibleCols.includes('absDev') && <td colSpan={1}></td>}
              {visibleCols.includes('sqDev') && <td colSpan={1}></td>}
              {visibleCols.includes('fiSqDev') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-main)', fontFamily: 'var(--font-fira-code), monospace', fontWeight: 600 }}>
                {rows.reduce((sum, r) => sum + r.fiSqDev, 0).toFixed(4)}
              </td>}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
