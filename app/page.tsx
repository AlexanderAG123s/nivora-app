"use client";
import { useMemo, useEffect, useState } from "react";
import StatCard from "@/components/statistics/StatCard";
import { Sigma, Activity, Hash, ArrowUpRight, Maximize2, MoveHorizontal, Database } from "lucide-react";
import Histogram from "@/components/charts/Histogram";
import Boxplot from "@/components/charts/Boxplot";
import FrequencyTable from "@/components/ui/FrequencyTable";
import EmptyState from "@/components/ui/EmptyState";
import { useDatasetStore } from "@/stores/dataset-store";
import { calculateMean, calculateMedian, calculateMode, calculateVariance, calculateStdDev, calculateRange } from "@/lib/statistics/descriptive";
import { calculateFrequencyBins, calculateQuartiles } from "@/lib/statistics/charts";
import Link from "next/link";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { activeData } = useDatasetStore();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Resumen de Métricas
          </h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem' }}>Resumen estadístico del conjunto de datos principal en memoria.</p>
        </div>
      </div>

      {!isValid || !stats ? (
        <EmptyState 
          title="Ningún conjunto de datos activo" 
          description="Para ver las métricas y gráficos del resumen, primero debes cargar o ingresar un conjunto de datos."
          icon={<Database size={32} strokeWidth={1.5} />}
          action={
            <Link 
              href="/descriptive-statistics"
              style={{
                display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1.5rem',
                backgroundColor: 'var(--text-main)', borderRadius: '6px', fontSize: '0.8125rem', 
                fontWeight: 600, color: 'var(--bg-primary)'
              }}
            >
              Ir a Estadística Descriptiva
            </Link>
          }
        />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatCard title="Media (μ)" value={stats.mean.toFixed(2)} icon={<Sigma size={16} />} />
            <StatCard title="Mediana" value={stats.median.toFixed(2)} icon={<Activity size={16} />} />
            <StatCard title="Moda" value={stats.mode.length > 0 ? stats.mode.join(', ') : 'Ninguna'} icon={<Hash size={16} />} />
            <StatCard title="Varianza (s²)" value={stats.variance.toFixed(2)} icon={<ArrowUpRight size={16} />} />
            <StatCard title="Desv. Est. (s)" value={stats.stdDev.toFixed(2)} icon={<Maximize2 size={16} />} />
            <StatCard title="Rango" value={stats.range.toFixed(2)} icon={<MoveHorizontal size={16} />} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>Distribución de Frecuencias</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', marginBottom: '1.5rem' }}>Conjunto de datos agrupado por intervalos estándar.</p>
              <Histogram bins={bins} />
            </div>
            <div className="panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>Resumen de los Cinco Números</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', marginBottom: '1.5rem' }}>Análisis de cuartiles.</p>
              <Boxplot quartiles={quartiles} />
            </div>
          </div>

          <div className="panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '1.5rem' }}>Desglose de Datos</h3>
            <FrequencyTable bins={bins} />
          </div>
        </>
      )}
    </>
  );
}
