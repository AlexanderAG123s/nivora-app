"use client";
import { useState, useMemo } from "react";
import { useDatasetStore } from "@/stores/dataset-store";
import { calculateFrequencyBins } from "@/lib/statistics/charts";
import EducationalFrequencyTable from "@/components/ui/EducationalFrequencyTable";
import UngroupedFrequencyTable from "@/components/statistics/UngroupedFrequencyTable";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";

export default function FrequencyTablesPage() {
  const { activeData } = useDatasetStore();
  const [binCount, setBinCount] = useState(8);
  const [dataType, setDataType] = useState<'grouped' | 'ungrouped'>('grouped');

  const isValid = activeData.length > 0;

  const bins = useMemo(() => {
    if (!isValid) return [];
    return calculateFrequencyBins(activeData, binCount);
  }, [activeData, binCount, isValid]);

  if (!isValid) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Tablas de Frecuencia
          </h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem' }}>Espacio de trabajo dedicado a la agrupación y desglose de datos.</p>
        </div>
        <EmptyState 
          title="No hay datos para estructurar" 
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
            Tablas de Frecuencia
          </h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem' }}>Analiza la distribución tabular detallada de tu conjunto de datos.</p>
        </div>
      </div>

      <div className="panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => setDataType('grouped')}
              style={{ 
                padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600,
                backgroundColor: dataType === 'grouped' ? 'var(--text-main)' : 'transparent',
                color: dataType === 'grouped' ? 'var(--bg-primary)' : 'var(--text-subtle)',
                border: `1px solid ${dataType === 'grouped' ? 'var(--text-main)' : 'var(--border-subtle)'}`,
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              Datos Agrupados
            </button>
            <button 
              onClick={() => setDataType('ungrouped')}
              style={{ 
                padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600,
                backgroundColor: dataType === 'ungrouped' ? 'var(--text-main)' : 'transparent',
                color: dataType === 'ungrouped' ? 'var(--bg-primary)' : 'var(--text-subtle)',
                border: `1px solid ${dataType === 'ungrouped' ? 'var(--text-main)' : 'var(--border-subtle)'}`,
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              Datos No Agrupados
            </button>
          </div>

          {dataType === 'grouped' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', fontWeight: 500 }}>Intervalos:</span>
              <input 
                type="range" 
                min="3" 
                max="20" 
                value={binCount} 
                onChange={(e) => setBinCount(Number(e.target.value))}
                style={{ width: '150px', accentColor: 'var(--accent-blue)' }}
              />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 600, fontFamily: 'var(--font-fira-code)', width: '20px' }}>{binCount}</span>
            </div>
          )}
        </div>

        {dataType === 'grouped' ? (
          <EducationalFrequencyTable bins={bins} />
        ) : (
          <div style={{ paddingTop: '1rem' }}>
            <UngroupedFrequencyTable data={activeData} />
          </div>
        )}
      </div>
    </div>
  );
}
