"use client";
import { useState, useMemo } from "react";
import { useDatasetStore } from "@/stores/dataset-store";
import { calculateFrequencyBins, calculateQuartiles } from "@/lib/statistics/charts";
import { calculateMean, calculateStdDev } from "@/lib/statistics/descriptive";
import InteractiveHistogram from "@/components/charts/InteractiveHistogram";
import Boxplot from "@/components/charts/Boxplot";
import ScatterLineChart from "@/components/charts/ScatterLineChart";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";
import { BarChart2, TrendingUp, Settings2 } from "lucide-react";

export default function VisualizationsPage() {
  const { activeData } = useDatasetStore();
  const [binCount, setBinCount] = useState(8);
  const [isDensity, setIsDensity] = useState(false);
  const [showNormalCurve, setShowNormalCurve] = useState(false);
  const [chartType, setChartType] = useState<'histogram' | 'boxplot' | 'scatter' | 'line'>('histogram');

  const isValid = activeData.length > 0;

  const bins = useMemo(() => {
    if (!isValid) return [];
    return calculateFrequencyBins(activeData, binCount);
  }, [activeData, binCount, isValid]);

  const quartiles = useMemo(() => {
    if (!isValid) return null;
    return calculateQuartiles(activeData);
  }, [activeData, isValid]);

  const mean = useMemo(() => isValid ? calculateMean(activeData) : 0, [activeData, isValid]);
  const stdDev = useMemo(() => isValid ? calculateStdDev(activeData, true) : 0, [activeData, isValid]);

  if (!isValid) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Laboratorio de Visualizaciones
          </h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem' }}>Explora tus datos con gráficos interactivos y personalizables.</p>
        </div>
        <EmptyState 
          title="No hay datos para visualizar" 
          description="Sube o ingresa datos en la sección de Estadística Descriptiva primero."
          action={
            <Link 
              href="/descriptive-statistics"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem',
                backgroundColor: 'var(--text-main)', borderRadius: '6px', fontSize: '0.8125rem', 
                fontWeight: 600, color: 'var(--bg-primary)'
              }}
            >
              Cargar Datos
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Laboratorio de Visualizaciones
          </h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem' }}>Explora la distribución y tendencia secuencial de tus datos.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Controls Panel */}
        <div className="panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Settings2 size={16} color="var(--text-subtle)" />
            <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)' }}>Controles del Gráfico</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', fontWeight: 500 }}>Tipo de Gráfico</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                onClick={() => setChartType('histogram')}
                style={{ 
                  textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '4px', cursor: 'pointer',
                  backgroundColor: chartType === 'histogram' ? 'var(--bg-tertiary)' : 'transparent',
                  border: chartType === 'histogram' ? '1px solid var(--border-focus)' : '1px solid var(--border-subtle)',
                  color: chartType === 'histogram' ? 'var(--text-main)' : 'var(--text-subtle)',
                  fontSize: '0.8125rem', fontWeight: 500, transition: 'all 0.2s ease'
                }}
              >
                Histograma Dinámico
              </button>
              <button 
                onClick={() => setChartType('boxplot')}
                style={{ 
                  textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '4px', cursor: 'pointer',
                  backgroundColor: chartType === 'boxplot' ? 'var(--bg-tertiary)' : 'transparent',
                  border: chartType === 'boxplot' ? '1px solid var(--border-focus)' : '1px solid var(--border-subtle)',
                  color: chartType === 'boxplot' ? 'var(--text-main)' : 'var(--text-subtle)',
                  fontSize: '0.8125rem', fontWeight: 500, transition: 'all 0.2s ease'
                }}
              >
                Diagrama de Caja
              </button>
              <button 
                onClick={() => setChartType('scatter')}
                style={{ 
                  textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '4px', cursor: 'pointer',
                  backgroundColor: chartType === 'scatter' ? 'var(--bg-tertiary)' : 'transparent',
                  border: chartType === 'scatter' ? '1px solid var(--border-focus)' : '1px solid var(--border-subtle)',
                  color: chartType === 'scatter' ? 'var(--text-main)' : 'var(--text-subtle)',
                  fontSize: '0.8125rem', fontWeight: 500, transition: 'all 0.2s ease'
                }}
              >
                Dispersión (Índice vs Valor)
              </button>
              <button 
                onClick={() => setChartType('line')}
                style={{ 
                  textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '4px', cursor: 'pointer',
                  backgroundColor: chartType === 'line' ? 'var(--bg-tertiary)' : 'transparent',
                  border: chartType === 'line' ? '1px solid var(--border-focus)' : '1px solid var(--border-subtle)',
                  color: chartType === 'line' ? 'var(--text-main)' : 'var(--text-subtle)',
                  fontSize: '0.8125rem', fontWeight: 500, transition: 'all 0.2s ease'
                }}
              >
                Línea de Tendencia
              </button>
            </div>
          </div>

          {chartType === 'histogram' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', fontWeight: 500 }}>Intervalos (Bins)</label>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-main)', fontFamily: 'var(--font-fira-code)' }}>{binCount}</span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="30" 
                  value={binCount} 
                  onChange={(e) => setBinCount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-blue)' }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={isDensity}
                  onChange={(e) => setIsDensity(e.target.checked)}
                  style={{ accentColor: 'var(--accent-blue)' }}
                />
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-main)' }}>Modo Densidad</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={showNormalCurve}
                  onChange={(e) => setShowNormalCurve(e.target.checked)}
                  style={{ accentColor: '#EF4444' }}
                />
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-main)' }}>Superponer Curva Normal</span>
              </label>
            </div>
          )}
        </div>

        {/* Chart View */}
        <div className="panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '500px' }}>
          {chartType === 'histogram' && (
            <>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>Histograma {isDensity ? 'de Densidad' : 'de Frecuencias'}</h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
                  Mostrando distribución con {binCount} intervalos de clase.
                </p>
              </div>
              <InteractiveHistogram 
                bins={bins} 
                isDensity={isDensity} 
                showNormalCurve={showNormalCurve} 
                mean={mean} 
                stdDev={stdDev} 
              />
              <div className="educational-note" style={{ marginTop: '1.5rem', padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px', fontSize: '0.875rem', color: 'var(--text-subtle)', lineHeight: '1.5' }}>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem', fontSize: '0.9375rem' }}>Interpretación del Histograma</strong>
                <p style={{ marginBottom: '0.5rem' }}>El histograma agrupa tus datos en intervalos contiguos (bins). La altura de la barra representa la cantidad de datos (frecuencia) que caen en ese rango.</p>
                {isDensity && <p style={{ marginBottom: '0.5rem' }}><strong>Modo Densidad:</strong> El eje Y ahora muestra la <em>densidad de probabilidad</em>. El área total de todas las barras suma exactamente 1. Esto permite comparar tu distribución empírica con distribuciones teóricas continuas.</p>}
                {showNormalCurve && <p style={{ marginBottom: '0.5rem', color: '#EF4444' }}><strong>Curva Normal:</strong> Esta es la curva teórica de Gauss calculada usando la media ({mean.toFixed(2)}) y desviación estándar ({stdDev.toFixed(2)}) de tus datos. Si las barras siguen esta campana, tus datos tienen una distribución normal.</p>}
              </div>
            </>
          )}

          {chartType === 'boxplot' && (
            <>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>Diagrama de Caja y Bigotes</h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
                  Visualizando dispersión y valores atípicos.
                </p>
              </div>
              <Boxplot quartiles={quartiles} />
              <div className="educational-note" style={{ marginTop: '1.5rem', padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px', fontSize: '0.875rem', color: 'var(--text-subtle)' }}>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem', fontSize: '0.9375rem' }}>Interpretación del Diagrama de Caja</strong>
                <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: '1.5' }}>
                  <li><strong>La Caja:</strong> Representa el 50% central de los datos. Su límite inferior es el Cuartil 1 (25%) y el superior el Cuartil 3 (75%).</li>
                  <li><strong>Línea Central:</strong> Es la Mediana (Cuartil 2). Si no está en el centro de la caja, indica asimetría.</li>
                  <li><strong>Los Bigotes:</strong> Se extienden hasta los valores más extremos que no son considerados atípicos (calculados como 1.5 veces el Rango Intercuartílico).</li>
                  <li><strong>Puntos Aislados:</strong> Son valores atípicos (outliers) matemáticamente anormales en comparación con el resto de la muestra.</li>
                </ul>
              </div>
            </>
          )}

          {(chartType === 'scatter' || chartType === 'line') && (
            <>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Gráfico de {chartType === 'scatter' ? 'Dispersión' : 'Líneas'}
                </h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
                  Mostrando los valores crudos en orden de aparición (Índice vs Valor).
                </p>
              </div>
              <ScatterLineChart data={activeData} mode={chartType} />
              <div className="educational-note" style={{ marginTop: '1.5rem', padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px', fontSize: '0.875rem', color: 'var(--text-subtle)', lineHeight: '1.5' }}>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem', fontSize: '0.9375rem' }}>Interpretación del Gráfico de {chartType === 'scatter' ? 'Dispersión' : 'Tendencia'}</strong>
                <p>Este gráfico traza los valores exactamente en el orden en que fueron ingresados. El eje X representa el índice temporal o de entrada, y el eje Y representa el valor (magnitud).</p>
                <p style={{ marginTop: '0.5rem' }}>Es sumamente útil para detectar patrones secuenciales, como una tendencia al alza a lo largo del tiempo, o para ver si un valor atípico fue introducido por error en un momento específico.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
