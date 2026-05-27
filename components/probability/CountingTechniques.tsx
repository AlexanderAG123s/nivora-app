"use client";
import { useState } from "react";
import { BlockEquation, InlineEquation } from "@/components/ui/MathRenderer";

const fact = (n: number): number => {
  if (n < 0) return NaN;
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
};

export default function CountingTechniques() {
  const [nFact, setNFact] = useState<number>(5);
  const [n, setN] = useState<number>(5);
  const [k, setK] = useState<number>(2);

  const isValidFact = nFact >= 0;
  const isValidPK = n >= 0 && k >= 0 && n >= k;
  
  const factorialResult = isValidFact ? fact(nFact) : NaN;
  const permutations = isValidPK ? fact(n) / fact(n - k) : NaN;
  const combinations = isValidPK ? fact(n) / (fact(k) * fact(n - k)) : NaN;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '1.5rem', alignItems: 'start' }}>
      
      {/* Controls Panel */}
      <div className="panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            Factorial
          </h3>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-subtle)', marginBottom: '0.375rem', fontWeight: 500 }}>
              Número (n)
            </label>
            <input 
              type="number" 
              className="input-field"
              value={nFact} 
              onChange={(e) => setNFact(Number(e.target.value))}
              min="0"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            Permutaciones y Combinaciones
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-subtle)', marginBottom: '0.375rem', fontWeight: 500 }}>
                Población Total (n)
              </label>
              <input 
                type="number" 
                className="input-field"
                value={n} 
                onChange={(e) => setN(Number(e.target.value))}
                min="0"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-subtle)', marginBottom: '0.375rem', fontWeight: 500 }}>
                Tamaño de Muestra (r o k)
              </label>
              <input 
                type="number" 
                className="input-field"
                value={k} 
                onChange={(e) => setK(Number(e.target.value))}
                min="0"
                style={{ width: '100%' }}
              />
            </div>
            {!isValidPK && (
              <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: '6px', fontSize: '0.8125rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                El valor de 'n' debe ser mayor o igual a 'r'.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results View */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div className="panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-main)' }}>Factorial (<InlineEquation math="n!" />)</h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', marginBottom: '1rem' }}>
            El producto de todos los números enteros positivos desde 1 hasta n.
          </p>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', textAlign: 'center' }}>
            <BlockEquation math={isValidFact ? `${nFact}! = ${factorialResult.toLocaleString('en-US')}` : `n!`} />
          </div>
        </div>

        <div className="panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-main)' }}>Permutaciones (<InlineEquation math="nP_r" />)</h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', marginBottom: '1rem' }}>
            Maneras de organizar <InlineEquation math="r" /> elementos de un conjunto de <InlineEquation math="n" /> elementos, donde <strong>el orden importa</strong>.
          </p>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', textAlign: 'center', overflowX: 'auto' }}>
            <BlockEquation math={isValidPK ? `P(${n}, ${k}) = \\frac{${n}!}{(${n}-${k})!} = ${permutations.toLocaleString('en-US')}` : 'P(n, r) = \\frac{n!}{(n-r)!}'} />
          </div>
        </div>
        
        <div className="panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-main)' }}>Combinaciones (<InlineEquation math="nC_r" />)</h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', marginBottom: '1rem' }}>
            Maneras de agrupar <InlineEquation math="r" /> elementos de un conjunto de <InlineEquation math="n" /> elementos, donde <strong>el orden no importa</strong>.
          </p>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', textAlign: 'center', overflowX: 'auto' }}>
            <BlockEquation math={isValidPK ? `C(${n}, ${k}) = \\binom{${n}}{${k}} = \\frac{${n}!}{${k}!(${n}-${k})!} = ${combinations.toLocaleString('en-US')}` : 'C(n, r) = \\binom{n}{r} = \\frac{n!}{r!(n-r)!}'} />
          </div>
        </div>

      </div>
    </div>
  );
}
