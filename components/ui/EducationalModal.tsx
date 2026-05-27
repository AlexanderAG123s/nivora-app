"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
import { BlockEquation } from "./MathRenderer";

export interface EducationalProps {
  explanation: string;
  formula: string;
  application: string;
  stepByStep?: string;
  variables?: Array<{ letter: string; description: string }>;
}

interface EducationalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: string | number;
  educational: EducationalProps;
}

export default function EducationalModal({ isOpen, onClose, title, value, educational }: EducationalModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        className="panel"
        style={{
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-primary)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--bg-primary)',
          zIndex: 10
        }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{title}</h2>
            <div style={{ fontFamily: 'var(--font-fira-code), monospace', fontSize: '1rem', color: 'var(--accent-blue)', fontWeight: 600 }}>{value}</div>
          </div>
          <button 
            onClick={onClose}
            style={{ 
              background: 'transparent', border: 'none', cursor: 'pointer', 
              color: 'var(--text-muted)', padding: '0.5rem', borderRadius: '4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.875rem', color: 'var(--text-subtle)' }}>
          <div>
            <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem', fontSize: '0.9375rem' }}>¿Qué significa?</strong>
            <p style={{ lineHeight: '1.6' }}>{educational.explanation}</p>
          </div>
          
          <div>
            <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem', fontSize: '0.9375rem' }}>Fórmula Matemática</strong>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', textAlign: 'center', overflowX: 'auto' }}>
              <BlockEquation math={educational.formula} />
            </div>
          </div>

          {educational.variables && educational.variables.length > 0 && (
            <div>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem', fontSize: '0.9375rem' }}>Variables de la Fórmula</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '6px' }}>
                {educational.variables.map((v, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-fira-code), monospace', fontWeight: 600, color: 'var(--accent-blue)', textAlign: 'center' }}>{v.letter}</div>
                    <div style={{ lineHeight: '1.5' }}>{v.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {educational.stepByStep && (
            <div>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem', fontSize: '0.9375rem' }}>Sustitución y Cálculo</strong>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', textAlign: 'center', overflowX: 'auto' }}>
                <BlockEquation math={educational.stepByStep} />
              </div>
            </div>
          )}

          <div>
            <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem', fontSize: '0.9375rem' }}>Aplicación Práctica</strong>
            <p style={{ lineHeight: '1.6' }}>{educational.application}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
