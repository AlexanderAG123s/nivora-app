"use client";
import { useState } from "react";
import { BlockEquation, InlineEquation } from "@/components/ui/MathRenderer";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function EventProbability() {
  const [pA, setPA] = useState<number>(0.5);
  const [pB, setPB] = useState<number>(0.5);
  const [pIntersection, setPIntersection] = useState<number>(0.25);

  const isValid = pA >= 0 && pA <= 1 && pB >= 0 && pB <= 1 && pIntersection >= 0 && pIntersection <= 1 && pIntersection <= pA && pIntersection <= pB;

  const pCondA_B = isValid && pB > 0 ? pIntersection / pB : 0;
  const pCondB_A = isValid && pA > 0 ? pIntersection / pA : 0;
  
  // Independence check: P(A ∩ B) = P(A) * P(B)
  const product = pA * pB;
  const isIndependent = Math.abs(product - pIntersection) < 0.0001;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '1.5rem', alignItems: 'start' }}>
      
      {/* Controls */}
      <div className="panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            Probabilidades Base
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-subtle)', marginBottom: '0.375rem', fontWeight: 500 }}>
                Probabilidad del Evento A, <InlineEquation math="P(A)" />
              </label>
              <input 
                type="number" 
                className="input-field"
                value={pA} 
                onChange={(e) => setPA(Number(e.target.value))}
                min="0" max="1" step="0.01"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-subtle)', marginBottom: '0.375rem', fontWeight: 500 }}>
                Probabilidad del Evento B, <InlineEquation math="P(B)" />
              </label>
              <input 
                type="number" 
                className="input-field"
                value={pB} 
                onChange={(e) => setPB(Number(e.target.value))}
                min="0" max="1" step="0.01"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-subtle)', marginBottom: '0.375rem', fontWeight: 500 }}>
                Intersección <InlineEquation math="P(A \cap B)" />
              </label>
              <input 
                type="number" 
                className="input-field"
                value={pIntersection} 
                onChange={(e) => setPIntersection(Number(e.target.value))}
                min="0" max="1" step="0.01"
                style={{ width: '100%' }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Probabilidad de que ocurran ambos simultáneamente.
              </p>
            </div>

            {!isValid && (
              <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: '6px', fontSize: '0.8125rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                Verifica tus datos. Las probabilidades deben estar entre 0 y 1, y la intersección no puede ser mayor que P(A) ni que P(B).
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {isValid && (
          <div className="panel" style={{ padding: '1.5rem', border: `1px solid ${isIndependent ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`, backgroundColor: isIndependent ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              {isIndependent ? <CheckCircle2 color="#22c55e" size={24} /> : <AlertCircle color="#ef4444" size={24} />}
              <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: isIndependent ? '#16a34a' : '#dc2626' }}>
                Los eventos son {isIndependent ? 'INDEPENDIENTES' : 'DEPENDIENTES'}
              </h4>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-subtle)', marginLeft: '2.25rem', lineHeight: '1.5' }}>
              {isIndependent 
                ? `Al multiplicar P(A) × P(B) obtenemos ${product.toFixed(4)}, que coincide exactamente con P(A ∩ B). Esto significa que la ocurrencia de un evento no afecta al otro.` 
                : `Al multiplicar P(A) × P(B) obtenemos ${product.toFixed(4)}, lo cual es distinto de P(A ∩ B) (${pIntersection.toFixed(4)}). Esto significa que la ocurrencia de un evento sí afecta la probabilidad del otro.`}
            </p>
          </div>
        )}

        <div className="panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-main)' }}>Probabilidad Condicional</h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', marginBottom: '1.5rem' }}>
            Calcula la probabilidad de que ocurra un evento dado que el otro ya ha ocurrido.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', textAlign: 'center', overflowX: 'auto' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 500 }}>
                Probabilidad de A dado B
              </div>
              <BlockEquation math={isValid ? `P(A|B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{${pIntersection}}{${pB}} = ${pCondA_B.toFixed(4)}` : 'P(A|B) = \\frac{P(A \\cap B)}{P(B)}'} />
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', textAlign: 'center', overflowX: 'auto' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 500 }}>
                Probabilidad de B dado A
              </div>
              <BlockEquation math={isValid ? `P(B|A) = \\frac{P(A \\cap B)}{P(A)} = \\frac{${pIntersection}}{${pA}} = ${pCondB_A.toFixed(4)}` : 'P(B|A) = \\frac{P(A \\cap B)}{P(A)}'} />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
