"use client";
import { useDatasetStore } from "@/stores/dataset-store";
import EmptyState from "@/components/ui/EmptyState";
import { FolderOpen, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const { history, loadHistoryItem, deleteHistoryItem, activeId } = useDatasetStore();
  const router = useRouter();

  const handleOpen = (id: string) => {
    loadHistoryItem(id);
    router.push("/descriptive-statistics");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
          Historial de Análisis
        </h1>
        <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem' }}>Tus análisis recientes guardados localmente.</p>
      </div>

      {history.length === 0 ? (
        <EmptyState 
          title="No hay análisis recientes" 
          description="Los análisis que proceses en la sección de Estadística Descriptiva aparecerán aquí automáticamente."
          action={
            <Link 
              href="/descriptive-statistics"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem',
                backgroundColor: 'var(--text-main)', borderRadius: '6px', fontSize: '0.8125rem', 
                fontWeight: 600, color: 'var(--bg-primary)'
              }}
            >
              Nuevo Análisis
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map(item => (
            <div key={item.id} className="panel" style={{ 
              padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderLeft: activeId === item.id ? '4px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
              flexWrap: 'wrap', gap: '1rem'
            }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  {item.name}
                  {activeId === item.id && <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 500 }}>Activo</span>}
                </h3>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                  <span>•</span>
                  <span>{item.count} valores numéricos</span>
                  <span>•</span>
                  <span>Media prom: {item.meanPreview.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  onClick={() => deleteHistoryItem(item.id)}
                  style={{
                    padding: '0.5rem', backgroundColor: 'transparent', border: '1px solid var(--border-subtle)',
                    borderRadius: '6px', cursor: 'pointer', color: 'var(--text-muted)'
                  }}
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  onClick={() => handleOpen(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
                    backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)',
                    borderRadius: '6px', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-main)'
                  }}
                >
                  Abrir <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
