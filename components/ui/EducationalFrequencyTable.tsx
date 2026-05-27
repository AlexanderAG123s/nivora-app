"use client";
import { useState } from "react";
import { BinData } from "@/lib/statistics/charts";
import { Play, SkipForward, Info } from "lucide-react";
import { BlockEquation } from "./MathRenderer";

interface EducationalFrequencyTableProps {
  bins: BinData[];
}

const STEPS = [
  {
    id: 'rango',
    title: '1. Rango y Amplitud',
    description: 'Calculamos la distancia total de los datos (Rango) y la dividimos entre la cantidad de intervalos deseados (k) para obtener la amplitud o ancho de clase (A).',
    formula: 'R = X_{max} - X_{min}, \\quad A = \\frac{R}{k}',
    cols: [] // Initial step before showing intervals
  },
  {
    id: 'intervals',
    title: '2. Intervalos de Clase',
    description: 'Agrupamos los datos en rangos de tamaño A. Se empieza desde el valor mínimo y se suma la amplitud.',
    cols: ['range']
  },
  {
    id: 'fi',
    title: '3. Frecuencia Absoluta (fᵢ)',
    description: 'Contamos cuántos datos caen exactamente dentro de cada intervalo.',
    cols: ['range', 'fi']
  },
  {
    id: 'xi',
    title: '4. Marca de Clase (xᵢ)',
    description: 'Es el punto medio del intervalo. Se usa como representante del intervalo para cálculos matemáticos.',
    formula: 'x_i = \\frac{L_{inf} + L_{sup}}{2}',
    cols: ['range', 'fi', 'xi']
  },
  {
    id: 'hi',
    title: '5. Frecuencia Relativa (hᵢ y pᵢ)',
    description: 'Proporción de datos en el intervalo respecto al total (n). Multiplicado por 100 nos da el porcentaje.',
    formula: 'h_i = \\frac{f_i}{n}, \\quad p_i = h_i \\times 100\\%',
    cols: ['range', 'fi', 'xi', 'hi', 'pi']
  },
  {
    id: 'acum',
    title: '6. Frecuencias Acumuladas (Fᵢ, Hᵢ)',
    description: 'Suma sucesiva de las frecuencias. Responde preguntas como "¿Cuántos datos son menores a X?".',
    formula: 'F_i = F_{i-1} + f_i',
    cols: ['range', 'fi', 'xi', 'hi', 'pi', 'Fi', 'Hi']
  },
  {
    id: 'aux',
    title: '7. Columnas Auxiliares',
    description: 'Se utilizan para calcular estadísticos como la media agrupada o la varianza de forma manual.',
    formula: '\\bar{x} \\approx \\frac{\\sum x_i f_i}{n}, \\quad s^2 \\approx \\frac{\\sum f_i(x_i - \\bar{x})^2}{n-1}',
    cols: ['range', 'fi', 'xi', 'hi', 'pi', 'Fi', 'Hi', 'xifi', 'ximeansq']
  }
];

export default function EducationalFrequencyTable({ bins }: EducationalFrequencyTableProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isInteractive, setIsInteractive] = useState(false);

  if (!bins || bins.length === 0) return null;

  const visibleCols = isInteractive ? STEPS[currentStep].cols : STEPS[STEPS.length - 1].cols;
  const currentStepData = STEPS[currentStep];
  
  // Calculate Rango variables for the formula injection if on step 0
  const xmin = bins[0].min;
  const xmax = bins[bins.length - 1].max;
  const k = bins.length;
  const R = xmax - xmin;
  const A = R / k;

  const stepFormula = currentStepData.id === 'rango' 
    ? `R = ${xmax.toFixed(2)} - ${xmin.toFixed(2)} = ${R.toFixed(2)} \\\\ A = \\frac{${R.toFixed(2)}}{${k}} = ${A.toFixed(2)}`
    : currentStepData.formula;

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
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)' }}>Construye la tabla de frecuencias gradualmente para aprender su estructura matemática.</p>
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
          <p style={{ fontSize: '0.875rem', color: 'var(--text-subtle)', lineHeight: '1.5', marginBottom: stepFormula ? '1rem' : 0 }}>
            {currentStepData.description}
          </p>
          {stepFormula && (
            <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '6px', overflowX: 'auto', textAlign: 'center' }}>
              <BlockEquation math={currentStepData.id === 'rango' ? `\\begin{aligned} ${stepFormula} \\end{aligned}` : stepFormula} />
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div style={{ width: '100%', overflowX: 'auto', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-tertiary)' }}>
              {visibleCols.includes('range') && <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-subtle)' }} title="Intervalo de la clase">Intervalo</th>}
              {visibleCols.includes('fi') && <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-subtle)' }} title="Frecuencia Absoluta: N° de datos en el intervalo">fᵢ</th>}
              {visibleCols.includes('xi') && <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-subtle)' }} title="Marca de Clase: Punto medio del intervalo">xᵢ</th>}
              {visibleCols.includes('hi') && <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-subtle)' }} title="Frecuencia Relativa: fᵢ / n">hᵢ</th>}
              {visibleCols.includes('pi') && <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-subtle)' }} title="Porcentaje: hᵢ * 100">pᵢ (%)</th>}
              {visibleCols.includes('Fi') && <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-subtle)' }} title="Frecuencia Acumulada: Suma de fᵢ">Fᵢ</th>}
              {visibleCols.includes('Hi') && <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-subtle)' }} title="Frecuencia Relativa Acumulada: Suma de hᵢ">Hᵢ</th>}
              {visibleCols.includes('xifi') && <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-subtle)' }} title="Producto de la marca de clase por su frecuencia">xᵢ·fᵢ</th>}
              {visibleCols.includes('ximeansq') && <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-subtle)' }} title="Desviación al cuadrado de la media">|xᵢ - x̄|²</th>}
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
                {visibleCols.includes('range') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-main)' }}>{row.rangeStr}</td>}
                {visibleCols.includes('fi') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-main)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.frequency}</td>}
                {visibleCols.includes('xi') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.xi.toFixed(2)}</td>}
                {visibleCols.includes('hi') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.relative}</td>}
                {visibleCols.includes('pi') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.percentage}</td>}
                {visibleCols.includes('Fi') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.cumulative}</td>}
                {visibleCols.includes('Hi') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.Hi.toFixed(2)}</td>}
                {visibleCols.includes('xifi') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.xi_fi.toFixed(2)}</td>}
                {visibleCols.includes('ximeansq') && <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-fira-code), monospace' }}>{row.xi_mean_sq.toFixed(2)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
