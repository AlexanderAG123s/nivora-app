"use client";
import { useState } from "react";
import { BlockEquation, InlineEquation } from "@/components/ui/MathRenderer";

const combinations = (n: number, k: number): number => {
  if (k === 0 || k === n) return 1;
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = res * (n - i + 1) / i;
  }
  return res;
};

export default function BinomialTheorem() {
  const [n, setN] = useState<number>(3);

  const generatePolynomial = (power: number) => {
    if (power < 0) return '';
    if (power === 0) return '1';
    
    let terms = [];
    for (let k = 0; k <= power; k++) {
      const c = combinations(power, k);
      const coeff = c === 1 ? '' : c.toString();
      
      const aPower = power - k;
      const bPower = k;
      
      let aTerm = '';
      if (aPower === 1) aTerm = 'a';
      else if (aPower > 1) aTerm = `a^{${aPower}}`;
      
      let bTerm = '';
      if (bPower === 1) bTerm = 'b';
      else if (bPower > 1) bTerm = `b^{${bPower}}`;
      
      terms.push(`${coeff}${aTerm}${bTerm}`);
    }
    
    return terms.join(' + ');
  };

  const expansion = generatePolynomial(n);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '1.5rem', alignItems: 'start' }}>
      
      {/* Controls */}
      <div className="panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            Parámetros del Binomio
          </h3>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-subtle)', marginBottom: '0.375rem', fontWeight: 500 }}>
              Potencia (n)
            </label>
            <input 
              type="number" 
              className="input-field"
              value={n} 
              onChange={(e) => setN(Number(e.target.value))}
              min="0"
              max="20"
              style={{ width: '100%' }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Se admiten potencias hasta n=20 para evitar desbordamiento visual.
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-main)' }}>Expansión Algebraica</h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', marginBottom: '1.5rem' }}>
            Fórmula expandida para el binomio <InlineEquation math="(a + b)^{n}" /> usando coeficientes binomiales <InlineEquation math="\binom{n}{k}" />.
          </p>
          
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', textAlign: 'center', overflowX: 'auto' }}>
            <BlockEquation math={`(a + b)^{${n}} = ${n >= 0 && n <= 20 ? expansion : '\\text{Límite excedido}'}`} />
          </div>

          {n > 0 && n <= 20 && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px', fontSize: '0.8125rem', color: 'var(--text-subtle)' }}>
              <strong>Nota:</strong> Esta expansión contiene {n + 1} términos en total. La suma de las potencias de 'a' y 'b' en cualquier término siempre es igual a {n}.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
