"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Terminal,
  Maximize2,
  PieChart,
  Target,
  List,
  HelpCircle,
  X,
  Info
} from 'lucide-react';

export const DescriptiveContent = ({ openApp, setExpandedTable, setGlobalStats, onToggleSpotlight }: any) => {
  const [rawData, setRawData] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [posType, setPosType] = useState('percentil');
  const [posInput, setPosInput] = useState("50");
  const [isGrouped, setIsGrouped] = useState(true);
  const [focusedSection, setFocusedSection] = useState<string | null>(null);

  useEffect(() => {
    if (onToggleSpotlight) onToggleSpotlight(!!focusedSection);
    return () => { if(onToggleSpotlight) onToggleSpotlight(false); }
  }, [focusedSection, onToggleSpotlight]);

  useEffect(() => {
    const cleanText = rawData.replace(/[^\d.,\s-]/g, '').replace(/,/g, ' ');
    const arr = cleanText.split(/\s+/).map(Number).filter(n => !isNaN(n) && cleanText.trim() !== "");

    if (arr.length === 0) {
      setStats(null);
      setGlobalStats(null);
      return;
    }

    const n = arr.length;
    const sum = arr.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(n / 2);
    const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    const isMedianAverage = n % 2 === 0;

    const getPercentile = (k: number) => {
      const pos = (k / 100) * n;
      if (pos === 0) return sorted[0];
      if (Number.isInteger(pos)) return (sorted[pos - 1] + sorted[pos]) / 2;
      const idx = Math.ceil(pos) - 1;
      return sorted[Math.min(idx, n - 1)];
    };

    const minVal = sorted[0];
    const maxVal = sorted[n - 1];
    const q1 = getPercentile(25);
    const q3 = getPercentile(75);

    const counts: any = {};
    arr.forEach(val => counts[val] = (counts[val] || 0) + 1);
    let maxCount = 0;
    let modes: number[] = [];
    for (const val in counts) {
      if (counts[val] > maxCount) {
        maxCount = counts[val];
        modes = [Number(val)];
      } else if (counts[val] === maxCount) {
        modes.push(Number(val));
      }
    }
    const modeStr = (modes.length === arr.length || maxCount === 1) ? "Amodal" : modes.join(', ');

    let variance = 0;
    let stdDev = 0;
    if (n > 1) {
      variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1);
      stdDev = Math.sqrt(variance);
    }

    let frequencyTable = [];
    if (n > 0) {
      const R = maxVal - minVal;
      
      if (!isGrouped) {
        const uniqueValues = Array.from(new Set(sorted));
        let cumulativeFreq = 0;
        for (let i = 0; i < uniqueValues.length; i++) {
          const val = uniqueValues[i];
          const f_i = counts[val.toString()] || counts[val];
          cumulativeFreq += f_i;
          frequencyTable.push({
            clase: i + 1,
            linf: val,
            lsup: val,
            marca: val,
            fi: f_i,
            Fa: cumulativeFreq,
            fr: f_i / n,
            FrPct: (cumulativeFreq / n) * 100
          });
        }
      } else {
        if (R === 0) {
          frequencyTable.push({
            clase: 1, linf: minVal, lsup: maxVal, marca: minVal, fi: n, Fa: n, fr: 1, FrPct: 100
          });
        } else {
          const K = Math.max(1, Math.ceil(1 + 3.322 * Math.log10(n)));
          const A = R / K;
          let currentMin = minVal;
          let cumulativeFreq = 0;

          for (let i = 0; i < K; i++) {
            const currentMax = i === K - 1 ? maxVal : currentMin + A;
            const f_i = arr.filter(x => i === K - 1 ? (x >= currentMin && x <= currentMax) : (x >= currentMin && x < currentMax)).length;
            cumulativeFreq += f_i;
            
            frequencyTable.push({
              clase: i + 1,
              linf: currentMin,
              lsup: currentMax,
              marca: (currentMin + currentMax) / 2,
              fi: f_i,
              Fa: cumulativeFreq,
              fr: f_i / n,
              FrPct: (cumulativeFreq / n) * 100
            });
            currentMin = currentMax;
          }
        }
      }
    }

    const finalStats = {
      n, sum, mean, median, isMedianAverage, mid,
      mode: modeStr, modes, maxCount, counts,
      variance, stdDev, sorted, frequencyTable,
      boxPlot: { minVal, maxVal, q1, median, q3 }
    };

    setStats(finalStats);
    setGlobalStats(finalStats);

  }, [rawData, isGrouped, setGlobalStats]);

  let positionResult = "N/A";
  let posProc = "";
  if (stats && stats.sorted && posInput) {
      let k = Number(posInput);
      if (!isNaN(k) && k > 0) {
          let originalK = k;
          if (posType === 'cuartil') k = Math.min(k, 4) * 25;
          else if (posType === 'decil') k = Math.min(k, 10) * 10;
          else k = Math.min(k, 100);

          const pos = (k / 100) * stats.n;
          if (pos === 0) {
              positionResult = stats.sorted[0].toFixed(2);
              posProc = `Posición = (${k}/100) * ${stats.n} = 0 -> Elemento 1 = ${stats.sorted[0]}`;
          } else if (Number.isInteger(pos)) {
              const val1 = stats.sorted[pos - 1];
              const val2 = stats.sorted[pos];
              positionResult = ((val1 + val2) / 2).toFixed(2);
              posProc = `Posición = (${k}/100) * ${stats.n} = ${pos} (Entero).\nPromedio de las posiciones ${pos} y ${pos + 1}:\n(${val1} + ${val2}) / 2 = ${positionResult}`;
          } else {
              const idx = Math.ceil(pos) - 1;
              const val = stats.sorted[Math.min(idx, stats.n - 1)];
              positionResult = val.toFixed(2);
              posProc = `Posición = (${k}/100) * ${stats.n} = ${pos.toFixed(2)}.\nRedondeando hacia arriba -> Posición ${idx + 1}:\nValor = ${val}`;
          }
      }
  }

  const statCards = [
    { 
      id: 'n', label: "Muestra (n)", value: stats?.n, color: "text-blue-400",
      desc: "Cantidad total de elementos ingresados.",
      formula: "n = Σ(elementos)",
      proc: stats ? `Se contaron ${stats.n} elementos en total.` : ''
    },
    { 
      id: 'mean', label: "Media (x̄)", value: stats?.mean?.toFixed(2), color: "text-emerald-400",
      desc: "El promedio aritmético de los datos.",
      formula: "x̄ = (Σx) / n",
      proc: stats ? `Suma total (${stats.sum.toFixed(2)}) / n (${stats.n}) = ${stats.mean.toFixed(2)}` : ''
    },
    { 
      id: 'median', label: "Mediana (Me)", value: stats?.median?.toFixed(2), color: "text-purple-400",
      desc: "El valor central cuando los datos están ordenados de menor a mayor.",
      formula: "Si n es impar: x_((n+1)/2). Si n es par: (x_(n/2) + x_(n/2 + 1))/2",
      proc: stats ? (stats.isMedianAverage 
        ? `n=${stats.n} (par). Se promediaron los valores centrales [pos ${stats.mid} y ${stats.mid + 1}]:\n(${stats.sorted[stats.mid - 1]} + ${stats.sorted[stats.mid]}) / 2 = ${stats.median.toFixed(2)}`
        : `n=${stats.n} (impar). Se tomó el valor central exacto [pos ${stats.mid + 1}]:\n${stats.median.toFixed(2)}`) : ''
    },
    { 
      id: 'mode', label: "Moda (Mo)", value: stats?.mode, color: "text-pink-400",
      desc: "El valor o valores que más se repiten en el conjunto.",
      formula: "Valor con mayor frecuencia absoluta (fi)",
      proc: stats ? (stats.mode === "Amodal" 
        ? "No hay ningún valor que se repita más que el resto (Amodal)." 
        : `Valor(es) con mayor frecuencia (${stats.maxCount} repeticiones): ${stats.modes.join(', ')}`) : ''
    },
    { 
      id: 'var', label: "Varianza (s²)", value: stats?.variance !== "N/A" ? Number(stats?.variance).toFixed(2) : "N/A", color: "text-amber-400",
      desc: "Mide qué tan dispersos están los datos respecto a la media (promedio de las diferencias al cuadrado).",
      formula: "s² = Σ(x - x̄)² / (n - 1)",
      proc: stats && stats.n > 1 ? `Suma de (valor - media)² = ${(stats.variance * (stats.n - 1)).toFixed(2)}.\nDividido entre n-1 (${stats.n - 1}) = ${stats.variance.toFixed(2)}` : 'Requiere al menos 2 datos.'
    },
    { 
      id: 'std', label: "Desv. Est. (s)", value: stats?.stdDev !== "N/A" ? Number(stats?.stdDev).toFixed(2) : "N/A", color: "text-rose-400",
      desc: "La raíz cuadrada de la varianza. Indica la dispersión promedio en las mismas unidades que los datos originales.",
      formula: "s = √s²",
      proc: stats && stats.n > 1 ? `Raíz cuadrada de la varianza (√${stats.variance.toFixed(2)}) = ${stats.stdDev.toFixed(2)}` : 'Requiere al menos 2 datos.'
    },
  ];

  return (
    <div className="flex flex-col gap-4 h-full p-4 md:p-6 overflow-y-auto custom-scrollbar relative">
      
      {focusedSection && (
        <div 
          className="absolute inset-0 z-40 bg-[#030305]/80 backdrop-blur-md transition-all duration-500 cursor-pointer flex items-center justify-center p-4"
          onClick={() => setFocusedSection(null)}
          title="Clic para salir del modo enfoque"
        >
          {focusedSection.startsWith('stat_') && stats && (() => {
            const card = statCards.find(c => c.id === focusedSection.split('_')[1]);
            if (!card) return null;
            return (
              <div 
                className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl cursor-default animate-in zoom-in-95 duration-300 ring-1 ring-indigo-500/30"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-full bg-current opacity-10 flex items-center justify-center ${card.color}`}></div>
                  <div>
                    <h2 className={`text-xl md:text-2xl font-bold tracking-tight ${card.color}`}>{card.label}</h2>
                    <p className="text-xl text-white font-mono mt-1">{card.value}</p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Significado</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Fórmula</p>
                    <p className="text-sm font-mono text-indigo-300">{card.formula}</p>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Procedimiento (Tus Datos)</p>
                    <p className="text-sm font-mono text-emerald-400 whitespace-pre-wrap">{card.proc}</p>
                  </div>
                </div>
              </div>
            );
          })()}

          {focusedSection === 'position' && stats && (
            <div 
              className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl cursor-default animate-in zoom-in-95 duration-300 ring-1 ring-purple-500/30"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-purple-400" />
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-purple-400">Medida de Posición</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Qué significa</p>
                  <p className="text-sm text-slate-300 leading-relaxed">Divide el conjunto de datos ordenados en partes iguales (Percentil: 100 partes, Decil: 10 partes, Cuartil: 4 partes).</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Fórmula de Posición</p>
                  <p className="text-sm font-mono text-purple-300">Posición = (k / 100) * n</p>
                  <p className="text-xs text-slate-400 mt-2 italic">* Si la posición es decimal, se redondea al siguiente entero. Si es entera, se promedia con el valor siguiente.</p>
                </div>
                <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Procedimiento (Tus Datos)</p>
                  <p className="text-sm font-mono text-emerald-400 whitespace-pre-wrap">{posProc || "Calculando..."}</p>
                </div>
              </div>
            </div>
          )}

          {focusedSection === 'table' && stats && (
            <div 
              className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl cursor-default animate-in zoom-in-95 duration-300 ring-1 ring-emerald-500/30"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <List className="w-8 h-8 text-emerald-400" />
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-emerald-400">Distribución de Frecuencias</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Tipos de Tabla</p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    <strong className="text-white">No Agrupados:</strong> Lista cada valor único y cuenta cuántas veces aparece. Ideal para pocos datos distintos.<br/><br/>
                    <strong className="text-white">Agrupados (Sturges):</strong> Agrupa los datos en rangos (intervalos) para resumir muestras grandes y continuas.
                  </p>
                </div>
                
                {isGrouped ? (
                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Procedimiento Regla de Sturges (Tus Datos)</p>
                    <p className="text-sm font-mono text-emerald-400">Rango (R) = Max - Min = {stats.boxPlot.maxVal} - {stats.boxPlot.minVal} = {(stats.boxPlot.maxVal - stats.boxPlot.minVal).toFixed(2)}</p>
                    <p className="text-sm font-mono text-emerald-400">Intervalos (K) = 1 + 3.322 * log10({stats.n}) ≈ {Math.max(1, Math.ceil(1 + 3.322 * Math.log10(stats.n)))}</p>
                    <p className="text-sm font-mono text-emerald-400">Amplitud (A) = R / K = {((stats.boxPlot.maxVal - stats.boxPlot.minVal) / Math.max(1, Math.ceil(1 + 3.322 * Math.log10(stats.n)))).toFixed(2)}</p>
                  </div>
                ) : (
                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Procedimiento (No Agrupados)</p>
                    <p className="text-sm font-mono text-emerald-400">Simplemente se tomaron los {new Set(stats.sorted).size} valores únicos y se contó cuántas veces aparece cada uno en la muestra.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex-shrink-0 transition-all focus-within:border-indigo-500/30 focus-within:bg-black/60 shadow-inner relative z-10">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
          <Terminal className="w-4 h-4 text-indigo-400" /> Ingesta de Datos (Tiempo Real)
        </h3>
        <textarea 
          value={rawData}
          onChange={(e) => setRawData(e.target.value)}
          className="w-full h-24 md:h-32 bg-transparent border-none p-2 text-slate-300 font-mono text-sm focus:ring-0 outline-none resize-none custom-scrollbar transition-all placeholder:text-slate-700"
          placeholder="Pega aquí los datos... Ej: 85, 90, 78, 92, 88.5"
        ></textarea>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-shrink-0 relative z-10">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 md:p-4 flex flex-col justify-between transition-all hover:bg-white/[0.04] group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-16 h-16 bg-current opacity-[0.02] rounded-full -translate-y-1/2 translate-x-1/2 ${card.color}`}></div>
            <div className="flex justify-between items-start">
              <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-medium relative z-10">{card.label}</p>
              <button 
                onClick={() => setFocusedSection(focusedSection === `stat_${card.id}` ? null : `stat_${card.id}`)}
                className="relative z-10 p-1 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                title="¿Cómo se calculó?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            {stats ? (
              <p className={`text-xl md:text-2xl font-bold mt-2 tracking-tight ${card.color} animate-in fade-in slide-in-from-bottom-2 relative z-10`}>
                {card.value}
              </p>
            ) : (
              <div className="h-6 md:h-8 w-1/2 bg-white/5 rounded mt-2 animate-pulse relative z-10"></div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex-shrink-0 transition-all hover:bg-white/[0.03] relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Medidas de Posición</h3>
          </div>
          <button 
            onClick={() => setFocusedSection(focusedSection === 'position' ? null : 'position')}
            className="p-1 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
            title="¿Cómo se calculó?"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex bg-black/40 border border-white/10 rounded-lg overflow-hidden focus-within:border-purple-500/50 transition-colors">
            <select 
              value={posType} 
              onChange={e => setPosType(e.target.value)}
              className="bg-transparent text-slate-300 text-sm px-3 py-2 outline-none border-r border-white/10 cursor-pointer hover:bg-white/5"
            >
              <option value="percentil" className="bg-slate-900">Percentil</option>
              <option value="decil" className="bg-slate-900">Decil</option>
              <option value="cuartil" className="bg-slate-900">Cuartil</option>
            </select>
            <input 
              type="number" 
              min="1"
              max={posType === 'cuartil' ? 4 : posType === 'decil' ? 10 : 100}
              value={posInput}
              onChange={e => setPosInput(e.target.value)}
              className="w-full bg-transparent text-white px-3 py-2 outline-none text-sm font-mono placeholder:text-slate-600"
              placeholder={`Ej: ${posType === 'cuartil' ? '3' : '85'}`}
            />
          </div>
          <div className="w-24 md:w-32 bg-purple-500/10 border border-purple-500/20 rounded-lg py-2 px-3 text-right">
            <span className="block text-[10px] text-purple-300 uppercase tracking-wider font-medium mb-0.5">Resultado</span>
            <span className="text-lg font-bold text-purple-400 leading-none block">{stats ? positionResult : '-'}</span>
          </div>
        </div>
      </div>

      {stats && stats.frequencyTable && (
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex-shrink-0 transition-all hover:bg-white/[0.03] relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Distribución de Frecuencias</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-black/40 border border-white/10 rounded-lg p-1 mr-2">
                <button
                  onClick={() => setIsGrouped(false)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${!isGrouped ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  No Agrupados
                </button>
                <button
                  onClick={() => setIsGrouped(true)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${isGrouped ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Agrupados
                </button>
              </div>
              <button 
                onClick={() => setFocusedSection(focusedSection === 'table' ? null : 'table')}
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors"
                title="¿Cómo se calculó?"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setExpandedTable(stats.frequencyTable)}
                title="Ampliar tabla y enfocar"
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar rounded-lg border border-white/5 bg-black/20">
            <table className="w-full text-left text-xs md:text-sm text-slate-300">
              <thead className="bg-white/5 text-slate-400 font-medium border-b border-white/5">
                <tr>
                  <th className="px-4 py-3">Clase</th>
                  <th className="px-4 py-3">{isGrouped ? 'Intervalo' : 'Valor (X)'}</th>
                  <th className="px-4 py-3">Marca (Xi)</th>
                  <th className="px-4 py-3">fi</th>
                  <th className="px-4 py-3">Fa</th>
                  <th className="px-4 py-3">fr</th>
                  <th className="px-4 py-3">fr %</th>
                </tr>
              </thead>
              <tbody>
                {stats.frequencyTable.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors last:border-0">
                    <td className="px-4 py-2.5 text-slate-500 text-center w-10">{row.clase}</td>
                    <td className="px-4 py-2.5 font-mono text-xs whitespace-nowrap">
                      {isGrouped ? (
                        <>
                          <span className="text-slate-500">[</span>
                          {row.linf.toFixed(2)} - {row.lsup.toFixed(2)}
                          <span className="text-slate-500">{i === stats.frequencyTable.length - 1 ? ']' : ')'}</span>
                        </>
                      ) : (
                        <span className="text-slate-300">{row.marca}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">{row.marca.toFixed(2)}</td>
                    <td className="px-4 py-2.5 font-medium text-emerald-400">{row.fi}</td>
                    <td className="px-4 py-2.5">{row.Fa}</td>
                    <td className="px-4 py-2.5">{(row.fr).toFixed(3)}</td>
                    <td className="px-4 py-2.5 font-medium text-indigo-300">{row.FrPct.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex-1 mt-2 flex flex-col items-center justify-center border border-white/5 bg-white/[0.01] rounded-xl p-4 transition-all hover:bg-white/[0.02] relative z-10">
        <BarChart3 className={`w-8 h-8 mb-3 transition-colors ${stats ? 'text-indigo-500/80' : 'text-slate-600'}`} />
          <p className="text-sm text-slate-400 mb-4 text-center">
            {stats ? "Motor listo. Visualiza las frecuencias y dispersión." : "Ingresa datos para habilitar los gráficos."}
          </p>
          <button 
            onClick={() => openApp('charts')}
            disabled={!stats}
            className={`py-2.5 px-6 rounded-xl text-sm font-medium transition-all flex items-center gap-2
              ${stats 
                ? 'bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] active:scale-95 cursor-pointer' 
                : 'bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed'}`}
          >
            <PieChart className="w-4 h-4" />
            Abrir Visualizador de Datos
          </button>
      </div>
    </div>
  );
};
