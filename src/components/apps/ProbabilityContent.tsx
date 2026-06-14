"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Hexagon, 
  Target,
  Minimize2,
  HelpCircle,
  Info
} from 'lucide-react';

export const ProbabilityContent = ({ onToggleSpotlight }: any) => {
  const [focusedSection, setFocusedSection] = useState<string | null>(null);

  useEffect(() => {
    if (onToggleSpotlight) onToggleSpotlight(!!focusedSection);
    return () => { if(onToggleSpotlight) onToggleSpotlight(false); }
  }, [focusedSection, onToggleSpotlight]);

  const [countN, setCountN] = useState(5);
  const [countR, setCountR] = useState(3);
  const [binomN, setBinomN] = useState(3);
  const [pA, setPA] = useState(0.5);
  const [pB, setPB] = useState(0.4);
  const [pIntersect, setPIntersect] = useState(0.2);

  const factorial = (num: number): bigint => {
    if (num < 0) return BigInt(0);
    let result = BigInt(1);
    for (let i = 2; i <= num; i++) result *= BigInt(i);
    return result;
  };

  const permutation = (n: number, r: number): bigint => {
    if (n < r || r < 0) return BigInt(0);
    return factorial(n) / factorial(n - r);
  };

  const combination = (n: number, r: number): bigint => {
    if (n < r || r < 0) return BigInt(0);
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  const nFact = countN >= 0 ? factorial(countN).toString() : "N/A";
  const nPr = (countN >= 0 && countR >= 0 && countN >= countR) ? permutation(countN, countR).toString() : "Error de dominio";
  const nCr = (countN >= 0 && countR >= 0 && countN >= countR) ? combination(countN, countR).toString() : "Error de dominio";

  const renderBinomial = () => {
    if (binomN < 0 || binomN > 50) return <span className="text-red-400">El exponente debe estar entre 0 y 50 para evitar cuelgues.</span>;
    if (binomN === 0) return <span>1</span>;
    
    let terms = [];
    for (let k = 0; k <= binomN; k++) {
      const coeff = combination(binomN, k);
      const aPower = binomN - k;
      const bPower = k;

      let termJSX = (
        <span key={k} className="inline-block mx-1">
          {coeff > BigInt(1) && <span className="text-emerald-400 font-bold">{coeff.toString()}</span>}
          {aPower > 0 && <span>a{aPower > 1 && <sup className="text-[10px] text-slate-400">{aPower}</sup>}</span>}
          {bPower > 0 && <span>b{bPower > 1 && <sup className="text-[10px] text-slate-400">{bPower}</sup>}</span>}
        </span>
      );

      terms.push(termJSX);
      if (k < binomN) terms.push(<span key={`plus-${k}`} className="text-slate-500 mx-1">+</span>);
    }
    return terms;
  };

  const pAGivenB = pB > 0 ? (pIntersect / pB).toFixed(4) : "Div/0";
  const isIndependent = pB > 0 && Math.abs((pIntersect / pB) - pA) < 0.0001; 

  return (
    <div className="flex flex-col gap-6 min-h-full p-4 md:p-6 overflow-y-auto custom-scrollbar relative">
      
      {focusedSection && (
        <div 
          className="absolute inset-0 z-40 bg-[#030305]/70 backdrop-blur-sm transition-all duration-500 cursor-pointer"
          onClick={() => setFocusedSection(null)}
          title="Clic para salir del modo enfoque"
        ></div>
      )}

      {/* SECCIÓN 1: TÉCNicas DE CONTEO */}
      <div 
        className={`bg-black/40 border border-white/10 rounded-xl p-5 flex flex-col lg:flex-row gap-6 transition-all duration-500 origin-center
          ${focusedSection === 'counting' 
            ? 'relative z-50 ring-1 ring-indigo-500/50 shadow-[0_0_80px_rgba(99,102,241,0.15)] bg-[#0a0a0f]' 
            : focusedSection ? 'opacity-30 blur-md scale-95 pointer-events-none' : 'hover:bg-white/[0.02]'}`}
      >
        <div className="flex-1 flex flex-col w-full">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Técnicas de Conteo</h3>
            </div>
            <button 
              onClick={() => setFocusedSection(focusedSection === 'counting' ? null : 'counting')}
              title={focusedSection === 'counting' ? "Contraer" : "Ver guía de uso"}
              className={`p-1.5 rounded-full transition-colors ${focusedSection === 'counting' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'}`}
            >
              {focusedSection === 'counting' ? <Minimize2 className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="text-xs text-slate-400 w-24">Conjunto (n):</label>
                <input 
                  type="number" 
                  min="0" 
                  value={countN.toString()} 
                  onChange={e => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val)) val = 0;
                    setCountN(val);
                  }} 
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500/50 text-sm font-mono" 
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs text-slate-400 w-24">Subgrupo (r):</label>
                <input 
                  type="number" 
                  min="0" 
                  value={countR.toString()} 
                  onChange={e => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val)) val = 0;
                    setCountR(val);
                  }} 
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500/50 text-sm font-mono" 
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-lg p-3 space-y-3">
               <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-xs text-slate-500">Factorial (n!)</span>
                  <span className="text-sm font-mono text-indigo-300 max-w-[120px] truncate" title={nFact}>{nFact}</span>
               </div>
               <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-xs text-slate-500">Permutación (nPr)</span>
                  <span className="text-sm font-mono text-emerald-300 max-w-[120px] truncate" title={nPr}>{nPr}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Combinación (nCr)</span>
                  <span className="text-sm font-mono text-purple-300 max-w-[120px] truncate" title={nCr}>{nCr}</span>
               </div>
            </div>
          </div>
        </div>

        {focusedSection === 'counting' && (
          <div className="hidden lg:flex w-72 flex-col border-l border-white/10 pl-6 animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-indigo-400" />
                <h4 className="text-white font-semibold tracking-tight text-sm">Guía de Uso</h4>
             </div>
             <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
               <p>
                 Define tu universo o población total <strong className="text-indigo-400">(n)</strong> y el tamaño del grupo o selección que deseas formar <strong className="text-indigo-400">(r)</strong>.
               </p>
               <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-3">
                  <div>
                    <p className="font-semibold text-white mb-0.5">Factorial (n!)</p>
                    <p className="text-slate-400">Formas de organizar <strong>todos</strong> los elementos. <br/><span className="text-slate-500 italic">Ej: Acomodar 5 libros en un estante.</span></p>
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-400 mb-0.5">Permutación (nPr)</p>
                    <p className="text-slate-400">Formas de elegir elementos donde <strong>SÍ IMPORTA</strong> el orden. <br/><span className="text-slate-500 italic">Ej: Repartir 1º, 2º y 3º lugar.</span></p>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-400 mb-0.5">Combinación (nCr)</p>
                    <p className="text-slate-400">Formas de elegir elementos donde <strong>NO IMPORTA</strong> el orden. <br/><span className="text-slate-500 italic">Ej: Formar un equipo de 3 personas.</span></p>
                  </div>
               </div>
             </div>
          </div>
        )}
      </div>

      {/* SECCIÓN 2: TEOREMA DEL BINOMIO */}
      <div 
        className={`bg-black/40 border border-white/10 rounded-xl p-5 flex flex-col lg:flex-row gap-6 transition-all duration-500 origin-center
          ${focusedSection === 'binomial' 
            ? 'relative z-50 ring-1 ring-emerald-500/50 shadow-[0_0_80px_rgba(16,185,129,0.15)] bg-[#0a0a0f]' 
            : focusedSection ? 'opacity-30 blur-md scale-95 pointer-events-none' : 'hover:bg-white/[0.02]'}`}
      >
        <div className="flex-1 flex flex-col w-full">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Hexagon className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Teorema del Binomio <span className="text-slate-500 text-xs font-normal ml-2">(a + b)ⁿ</span></h3>
            </div>
            <button 
              onClick={() => setFocusedSection(focusedSection === 'binomial' ? null : 'binomial')}
              title={focusedSection === 'binomial' ? "Contraer" : "Ver guía de uso"}
              className={`p-1.5 rounded-full transition-colors ${focusedSection === 'binomial' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'}`}
            >
              {focusedSection === 'binomial' ? <Minimize2 className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
             <label className="text-xs text-slate-400">Potencia (n):</label>
             <input 
               type="number" 
               min="0" 
               max="50" 
               value={binomN.toString()} 
               onChange={e => {
                 let val = parseInt(e.target.value, 10);
                 if (isNaN(val)) val = 0;
                 if (val > 50) val = 50; 
                 setBinomN(val);
               }} 
               className="w-24 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500/50 text-sm font-mono text-center" 
             />
          </div>

          <div className="w-full bg-[#0a0a0f] border border-white/5 rounded-lg p-6 overflow-x-auto custom-scrollbar flex items-center shadow-inner">
             <div className="text-lg md:text-xl font-serif text-slate-200 whitespace-nowrap tracking-wide">
               {renderBinomial()}
             </div>
          </div>
        </div>

        {focusedSection === 'binomial' && (
          <div className="hidden lg:flex w-72 flex-col border-l border-white/10 pl-6 animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-emerald-400" />
                <h4 className="text-white font-semibold tracking-tight text-sm">Guía de Uso</h4>
             </div>
             <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
               <p>
                 El <strong className="text-emerald-400">Teorema del Binomio</strong> describe el desarrollo de la potencia de un binomio o de una suma.
               </p>
               <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-3">
                  <div>
                    <p className="font-semibold text-white mb-0.5">Coeficientes</p>
                    <p className="text-slate-400">Calculados usando combinaciones <strong className="text-emerald-400">nCr</strong>. Forman las filas del famoso Triángulo de Pascal.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-0.5">Exponente de 'a'</p>
                    <p className="text-slate-400">Comienza en la potencia máxima <strong className="text-emerald-400">n</strong> y disminuye hasta 0 en cada término.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-0.5">Exponente de 'b'</p>
                    <p className="text-slate-400">Inicia siempre en 0 y va aumentando hasta llegar al nivel de <strong className="text-emerald-400">n</strong>.</p>
                  </div>
               </div>
             </div>
          </div>
        )}
      </div>

      {/* SECCIÓN 3: PROBABILIDAD Y EVENTOS */}
      <div 
        className={`bg-black/40 border border-white/10 rounded-xl p-5 flex flex-col lg:flex-row gap-6 transition-all duration-500 origin-center
          ${focusedSection === 'events' 
            ? 'relative z-50 ring-1 ring-rose-500/50 shadow-[0_0_80px_rgba(243,110,132,0.15)] bg-[#0a0a0f]' 
            : focusedSection ? 'opacity-30 blur-md scale-95 pointer-events-none' : 'hover:bg-white/[0.02]'}`}
      >
        <div className="flex-1 flex flex-col w-full">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm font-semibold text-white">Probabilidad de Eventos</h3>
            </div>
            <button 
              onClick={() => setFocusedSection(focusedSection === 'events' ? null : 'events')}
              title={focusedSection === 'events' ? "Contraer" : "Ver guía de uso"}
              className={`p-1.5 rounded-full transition-colors ${focusedSection === 'events' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'}`}
            >
              {focusedSection === 'events' ? <Minimize2 className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                {[
                  { label: "P(A)", val: pA, set: setPA, color: "focus:border-blue-500/50" },
                  { label: "P(B)", val: pB, set: setPB, color: "focus:border-rose-500/50" },
                  { label: "P(A ∩ B)", val: pIntersect, set: setPIntersect, color: "focus:border-purple-500/50" }
                ].map((input, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <label className="text-xs font-mono text-slate-400 w-24">{input.label}:</label>
                    <input 
                      type="number" step="0.01" min="0" max="1" 
                      value={input.val} 
                      onChange={e => input.set(parseFloat(e.target.value) || 0)} 
                      className={`w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none text-sm font-mono transition-colors ${input.color}`} 
                    />
                  </div>
                ))}
             </div>

             <div className="flex flex-col justify-center gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                <div className="bg-white/5 rounded-lg p-4">
                   <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Probabilidad Condicional</p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-white">P(A|B) =</span>
                      <span className="text-2xl font-mono text-rose-400">{pAGivenB}</span>
                   </div>
                </div>

                <div className={`rounded-lg p-4 flex items-center justify-between border ${isIndependent ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                   <div>
                     <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Relación de Eventos</p>
                     <p className={`text-sm font-semibold ${isIndependent ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {isIndependent ? "Eventos Independientes" : "Eventos Dependientes"}
                     </p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-slate-500">Fórmula aplicada:</p>
                      <p className="text-xs font-mono text-slate-300">P(A|B) {isIndependent ? '=' : '≠'} P(A)</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {focusedSection === 'events' && (
          <div className="hidden lg:flex w-72 flex-col border-l border-white/10 pl-6 animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-rose-400" />
                <h4 className="text-white font-semibold tracking-tight text-sm">Guía de Uso</h4>
             </div>
             <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
               <p>
                 Evalúa la relación entre dos sucesos para determinar si la ocurrencia de uno afecta al otro.
               </p>
               <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-3">
                  <div>
                    <p className="font-semibold text-white mb-0.5">Condicional P(A|B)</p>
                    <p className="text-slate-400">Probabilidad de que ocurra A sabiendo que B ya ocurrió. Se calcula dividiendo la intersección sobre P(B).</p>
                  </div>
                  <div>
                    <p className="font-semibold text-rose-400 mb-0.5">Independencia</p>
                    <p className="text-slate-400">Si P(A|B) es exactamente igual a P(A), el evento B no aporta información nueva. Son independientes.</p>
                  </div>
               </div>
             </div>
          </div>
        )}
      </div>

    </div>
  );
};
