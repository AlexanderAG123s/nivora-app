"use client";
import { useState, useMemo, useEffect } from "react";
import { parseCSV } from "@/lib/statistics/dataset";
import { calculateMean, calculateMedian, calculateMode, calculateVariance, calculateStdDev, calculateRange } from "@/lib/statistics/descriptive";
import { calculateFrequencyBins, calculateQuartiles } from "@/lib/statistics/charts";
import { exportFrequencyToCSV } from "@/lib/statistics/export";
import { useDatasetStore } from "@/stores/dataset-store";

import StatCard from "@/components/statistics/StatCard";
import Histogram from "@/components/charts/Histogram";
import Boxplot from "@/components/charts/Boxplot";
import FrequencyTable from "@/components/ui/FrequencyTable";
import PercentileCalculator from "@/components/statistics/PercentileCalculator";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonCard, SkeletonChart, SkeletonTable } from "@/components/ui/Skeletons";
import { Upload, Sigma, Activity, Hash, ArrowUpRight, Maximize2, MoveHorizontal, Download, Printer, AlertCircle } from "lucide-react";

export default function DescriptiveStatisticsPage() {
  const [mounted, setMounted] = useState(false);
  const { activeRawInput, activeData, setDataset, clearDataset } = useDatasetStore();
  const [localInput, setLocalInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLocalInput(activeRawInput);
  }, [activeRawInput]);

  const handleProcess = () => {
    setError(null);
    if (!localInput.trim()) {
      setError("El conjunto de datos está vacío. Ingresa al menos un número.");
      return;
    }
    
    setIsCalculating(true);
    // Simulate slight delay for polished UX
    setTimeout(() => {
      const parsed = parseCSV(localInput);
      const data1D = parsed.type === '1D' ? (parsed.data as number[]) : parsed.data.length > 0 ? Object.values(parsed.data[0] as Record<string, number>) : [];
      if (parsed.type === '1D' && (parsed.data as number[]).length === 0) {
        setError("No se encontraron valores numéricos válidos en la entrada.");
      } else {
        setDataset(localInput, parsed, `Análisis ${new Date().toLocaleDateString()}`);
      }
      setIsCalculating(false);
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setIsCalculating(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setLocalInput(text);
        const parsed = parseCSV(text);
        if (parsed.type === '1D' && (parsed.data as number[]).length === 0) {
          setError("El archivo CSV no contiene números válidos.");
          setIsCalculating(false);
        } else {
          setTimeout(() => {
            setDataset(text, parsed, file.name);
            setIsCalculating(false);
          }, 600);
        }
      }
    };
    reader.onerror = () => {
      setError("Error al leer el archivo.");
      setIsCalculating(false);
    };
    reader.readAsText(file);
  };

  const isValid = activeData.length > 0;

  const stats = useMemo(() => {
    if (!isValid) return null;
    return {
      mean: calculateMean(activeData),
      median: calculateMedian(activeData),
      mode: calculateMode(activeData),
      variance: calculateVariance(activeData, true),
      stdDev: calculateStdDev(activeData, true),
      range: calculateRange(activeData)
    };
  }, [activeData, isValid]);

  const bins = useMemo(() => isValid ? calculateFrequencyBins(activeData, 8) : [], [activeData, isValid]);
  const quartiles = useMemo(() => isValid ? calculateQuartiles(activeData) : null, [activeData, isValid]);

  const handlePrint = () => {
    window.print();
  };

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Estadística Descriptiva
          </h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem' }}>Analiza la tendencia central, dispersión y distribución de tu conjunto de datos.</p>
        </div>
        
        {isValid && (
          <div className="no-print" style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={() => exportFrequencyToCSV(bins)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
                backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: '6px',
                cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-main)'
              }}
            >
              <Download size={14} /> Exportar CSV
            </button>
            <button 
              onClick={handlePrint}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
                backgroundColor: 'var(--accent-blue)', border: 'none', borderRadius: '6px',
                cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500, color: '#FFF'
              }}
            >
              <Printer size={14} /> Imprimir Reporte
            </button>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="panel no-print tour-upload" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)' }}>Entrada de Datos</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
             {isValid && (
               <button 
                 onClick={() => { clearDataset(); setLocalInput(""); }}
                 style={{
                   padding: '0.35rem 0.75rem', backgroundColor: 'transparent', border: '1px solid var(--border-subtle)',
                   borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-muted)'
                 }}
               >
                 Limpiar
               </button>
             )}
          </div>
        </div>
        
        {error && (
          <div style={{ 
            marginBottom: '1rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', color: '#EF4444',
            fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea
            className="input-field"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder="Ingresa números separados por comas, espacios o saltos de línea..."
            style={{ width: '100%', minHeight: '100px', resize: 'vertical', fontFamily: 'var(--font-fira-code), monospace', fontSize: '0.875rem' }}
          />
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)' }}>
              {isValid && !isCalculating ? `${activeData.length} datos numéricos válidos en memoria` : ''}
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input 
                type="file" 
                id="csv-upload" 
                accept=".csv,.txt" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
              <label 
                htmlFor="csv-upload" 
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
                  backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: '6px',
                  cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-main)',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <Upload size={14} /> Subir CSV
              </label>
              <button 
                onClick={handleProcess}
                disabled={isCalculating}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem',
                  backgroundColor: 'var(--text-main)', border: 'none', borderRadius: '6px',
                  cursor: isCalculating ? 'not-allowed' : 'pointer', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--bg-primary)',
                  opacity: isCalculating ? 0.7 : 1
                }}
              >
                {isCalculating ? 'Procesando...' : 'Analizar Datos'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isCalculating && !isValid ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <SkeletonChart />
            <SkeletonChart />
          </div>
          <SkeletonTable />
        </>
      ) : !isValid ? (
        <EmptyState 
          title="No hay datos para analizar" 
          description="Ingresa tus datos manualmente en el cuadro de texto o sube un archivo CSV para generar el reporte estadístico."
        />
      ) : stats && (
        <>
          {/* Summary Cards */}
          <div className="tour-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <StatCard 
              title="Media (μ)" 
              value={stats.mean.toFixed(2)} 
              icon={<Sigma size={16} />} 
              educational={{
                explanation: "Representa el centro de gravedad del conjunto de datos. Es el valor que tendrían todos los datos si fueran iguales.",
                formula: "\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i",
                variables: [
                  { letter: "n", description: "El número total de observaciones (tamaño de la muestra)." },
                  { letter: "x_i", description: "Representa cada uno de los valores individuales en el conjunto." },
                  { letter: "\\bar{x} \\text{ o } \\mu", description: "La media aritmética calculada." }
                ],
                stepByStep: `\\bar{x} = \\frac{${activeData.reduce((a,b)=>a+b,0).toFixed(0)}}{${activeData.length}} = ${stats.mean.toFixed(2)}`,
                application: "Ideal para datos simétricos sin valores extremos (outliers)."
              }}
            />
            <StatCard 
              title="Mediana" 
              value={stats.median.toFixed(2)} 
              icon={<Activity size={16} />} 
              educational={{
                explanation: "Es el valor central cuando los datos están ordenados de menor a mayor. Divide los datos en dos mitades iguales.",
                formula: "Me = x_{\\frac{n+1}{2}}",
                variables: [
                  { letter: "n", description: "El número total de datos." },
                  { letter: "x_{\\frac{n+1}{2}}", description: "El dato situado exactamente en la posición central tras ordenar la lista." }
                ],
                application: "Es la medida de tendencia central más robusta cuando hay valores atípicos que distorsionan la media."
              }}
            />
            <StatCard 
              title="Moda" 
              value={stats.mode.length > 0 ? stats.mode.join(', ') : 'Ninguna'} 
              icon={<Hash size={16} />} 
              educational={{
                explanation: "Es el valor (o valores) que más se repite en el conjunto de datos.",
                formula: "Mo = valor\\ con\\ max(f_i)",
                variables: [
                  { letter: "f_i", description: "La frecuencia absoluta de cada dato (cuántas veces aparece)." },
                  { letter: "max(f_i)", description: "La frecuencia máxima encontrada en el conjunto." }
                ],
                application: "Útil en encuestas de votación o estudios de mercado para saber qué opción es la más popular."
              }}
            />
            <StatCard 
              title="Varianza (s²)" 
              value={stats.variance.toFixed(2)} 
              icon={<ArrowUpRight size={16} />} 
              educational={{
                explanation: "Mide qué tan dispersos están los datos alrededor de la media. Al estar al cuadrado, penaliza fuertemente los datos muy lejanos.",
                formula: "s^2 = \\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2",
                variables: [
                  { letter: "n", description: "El número total de datos. Usamos (n-1) para la varianza muestral (corrección de Bessel)." },
                  { letter: "x_i", description: "Cada dato individual." },
                  { letter: "\\bar{x}", description: "La media aritmética calculada." },
                  { letter: "s^2", description: "La varianza obtenida." }
                ],
                application: "Se usa en finanzas para medir el riesgo de una cartera de inversiones."
              }}
            />
            <StatCard 
              title="Desv. Est. (s)" 
              value={stats.stdDev.toFixed(2)} 
              icon={<Maximize2 size={16} />} 
              educational={{
                explanation: "Es la raíz cuadrada de la varianza. Devuelve la medida de dispersión a las mismas unidades que los datos originales.",
                formula: "s = \\sqrt{s^2}",
                variables: [
                  { letter: "s^2", description: "La varianza muestral calculada previamente." },
                  { letter: "s", description: "La desviación estándar resultante." }
                ],
                application: "Permite saber la distancia promedio de los datos a la media de forma fácil de interpretar."
              }}
            />
            <StatCard 
              title="Rango" 
              value={stats.range.toFixed(2)} 
              icon={<MoveHorizontal size={16} />} 
              educational={{
                explanation: "Es la diferencia entre el valor máximo y el valor mínimo del conjunto de datos.",
                formula: "R = x_{max} - x_{min}",
                variables: [
                  { letter: "x_{max}", description: "El valor más alto en el conjunto de datos." },
                  { letter: "x_{min}", description: "El valor más bajo en el conjunto de datos." },
                  { letter: "R", description: "La amplitud o rango total." }
                ],
                stepByStep: `R = ${Math.max(...activeData)} - ${Math.min(...activeData)} = ${stats.range.toFixed(2)}`,
                application: "Da una idea rápida de la amplitud total de los datos."
              }}
            />
          </div>

          {/* Position Measures */}
          <div className="tour-position" style={{ marginTop: '0.5rem' }}>
            <PercentileCalculator data={activeData} />
          </div>

          {/* Visualizations */}
          <div className="tour-charts" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '0.5rem' }}>
            <div className="panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>Distribución de Frecuencias</h3>
              <p className="no-print" style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', marginBottom: '1.5rem' }}>Representación en histograma del conjunto de datos.</p>
              <Histogram bins={bins} />
              <div className="educational-note no-print" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px', fontSize: '0.8125rem', color: 'var(--text-subtle)' }}>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>Lectura del Histograma</strong>
                Observa cómo se agrupan los datos. Si la forma se parece a una campana simétrica, tienes una distribución normal. Si se inclina hacia un lado, existe <em>asimetría</em>.
              </div>
            </div>
            <div className="panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>Resumen de los Cinco Números</h3>
              <p className="no-print" style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', marginBottom: '1.5rem' }}>Análisis de cuartiles.</p>
              <Boxplot quartiles={quartiles} />
              <div className="educational-note no-print" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px', fontSize: '0.8125rem', color: 'var(--text-subtle)' }}>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>Lectura del Diagrama de Caja</strong>
                La caja central contiene el 50% de los datos (Rango Intercuartílico). La línea interna es la Mediana. Los puntos sueltos representan <em>valores atípicos (outliers)</em>.
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="panel tour-table" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '1.5rem' }}>Desglose de Datos</h3>
            <FrequencyTable bins={bins} />
          </div>
        </>
      )}
    </div>
  );
}
