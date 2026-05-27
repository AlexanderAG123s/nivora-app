"use client";
import { useState, useMemo, useEffect } from "react";
import { calculatePercentile } from "@/lib/statistics/descriptive";
import EducationalModal from "@/components/ui/EducationalModal";
import { InlineEquation } from "@/components/ui/MathRenderer";

interface PercentileCalculatorProps {
  data: number[];
}

type MeasureType = 'quartile' | 'decile' | 'percentile';

export default function PercentileCalculator({ data }: PercentileCalculatorProps) {
  const [measureType, setMeasureType] = useState<MeasureType>('percentile');
  const [inputStr, setInputStr] = useState<string>("50");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-reset when changing measure type
  useEffect(() => {
    if (measureType === 'quartile') setInputStr("2");
    if (measureType === 'decile') setInputStr("5");
    if (measureType === 'percentile') setInputStr("50");
  }, [measureType]);

  const parsedInput = parseInt(inputStr, 10);
  const getMax = () => measureType === 'quartile' ? 3 : measureType === 'decile' ? 9 : 99;
  
  const isInvalid = isNaN(parsedInput) || parsedInput < 1 || parsedInput > getMax();

  const percentile = useMemo(() => {
    if (isInvalid) return null;
    if (measureType === 'quartile') return parsedInput * 25;
    if (measureType === 'decile') return parsedInput * 10;
    return parsedInput;
  }, [measureType, parsedInput, isInvalid]);

  const result = useMemo(() => {
    if (!data || data.length === 0 || percentile === null) return null;
    return calculatePercentile(data, percentile);
  }, [data, percentile]);

  // Calculations for step-by-step
  const n = data.length;
  let educationalData = null;

  if (percentile !== null && !isInvalid) {
    const kValue = (n - 1) * (percentile / 100);
    const f = Math.floor(kValue);
    const c = Math.ceil(kValue);
    const sorted = [...data].sort((a, b) => a - b);
    const valF = sorted[f] ?? 0;
    const valC = sorted[c] ?? 0;

    const measureName = measureType === 'quartile' ? 'Cuartil' : measureType === 'decile' ? 'Decil' : 'Percentil';
    const pos1Based = (kValue + 1).toFixed(2); // Student-friendly 1-based position

    educationalData = {
      explanation: `El ${measureName.toLowerCase()} ${parsedInput} equivale al percentil ${percentile}, que indica el valor debajo del cual se encuentra el ${percentile}% de las observaciones en tu conjunto de datos ordenado.`,
      formula: "Posici\\acute{o}n = \\frac{p}{100} \\times (n - 1) + 1",
      variables: [
        { letter: "n", description: `El número total de datos válidos (${n}).` },
        { letter: "p", description: `El percentil equivalente solicitado (${percentile}).` },
      ],
      stepByStep: `\\begin{aligned} \\text{Posición} &= \\frac{${percentile}}{100} \\times (${n} - 1) + 1 \\\\ ` +
                  `&= ${pos1Based} \\\\ ` +
                  (f === c 
                    ? `\\text{Como es exacta, } x_{${f + 1}} \\text{:} & \\\\ ` +
                      `\\text{Resultado} &= ${result?.toFixed(2)} \\end{aligned}` 
                    : `\\text{Cae entre } x_{${f + 1}} (${valF}) \\text{ y } x_{${c + 1}} (${valC}): & \\\\ ` +
                      `\\text{Resultado} &= ${valF} + (${valC} - ${valF}) \\times ${(kValue - f).toFixed(2)} \\\\ ` +
                      `&= ${result?.toFixed(2)} \\end{aligned}`),
      application: "Se utiliza frecuentemente para entender en qué posición relativa se encuentra un valor dentro del grupo total."
    };
  }

  const measureNameDisplay = measureType === 'quartile' ? 'Cuartil' : measureType === 'decile' ? 'Decil' : 'Percentil';

  return (
    <div className="panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h3 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
          Calculadora de Medidas de Posición
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)' }}>
          Las medidas de posición dividen los datos ordenados en partes iguales.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Tipo de Medida
            </label>
            <select 
              className="input-field"
              value={measureType}
              onChange={(e) => setMeasureType(e.target.value as MeasureType)}
              style={{ width: '100%', marginBottom: '0.5rem' }}
            >
              <option value="quartile">Cuartiles (1 al 3)</option>
              <option value="decile">Deciles (1 al 9)</option>
              <option value="percentile">Percentiles (1 al 99)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Valor solicitado ({measureNameDisplay} <InlineEquation math="k" />)
            </label>
            <input 
              type="text" 
              className="input-field"
              value={inputStr} 
              onChange={(e) => setInputStr(e.target.value)}
              style={{ width: '100%', borderColor: isInvalid ? '#EF4444' : 'var(--border-subtle)' }}
            />
            {isInvalid && (
              <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500 }}>
                El {measureNameDisplay.toLowerCase()} debe ser un número entre 1 y {getMax()}.
              </p>
            )}
          </div>
        </div>

        <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-subtle)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'center' }}>
          {isInvalid ? (
            <div style={{ color: 'var(--text-subtle)', fontSize: '0.875rem' }}>Ingresa un valor válido para calcular.</div>
          ) : (
            <>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)' }}>
                El valor del {measureNameDisplay} {parsedInput} es:
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-blue)', fontFamily: 'var(--font-fira-code), monospace' }}>
                {result?.toFixed(2)}
              </div>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                style={{ 
                  marginTop: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.8125rem', fontWeight: 600,
                  backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', border: '1px solid var(--border-focus)',
                  borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
              >
                Ver procedimiento
              </button>
            </>
          )}
        </div>
      </div>

      {educationalData && (
        <EducationalModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${measureNameDisplay} ${parsedInput}`}
          value={result?.toFixed(2) || "0"}
          educational={educationalData}
        />
      )}
    </div>
  );
}
