import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  Calculator, 
  Hexagon, 
  Activity, 
  Sparkles, 
  Terminal,
  Settings2,
  Minus,
  X,
  Maximize2,
  Minimize2,
  PieChart,
  LayoutGrid,
  Target,
  List,
  GitCommit,
  ArrowLeft,
  Info,
  HelpCircle
} from 'lucide-react';

// --- MÓDULOS DE CONTENIDO ---

const DescriptiveContent = ({ openApp, setExpandedTable, setGlobalStats }) => {
  const [rawData, setRawData] = useState("");
  const [stats, setStats] = useState(null);
  const [posType, setPosType] = useState('percentil');
  const [posInput, setPosInput] = useState("50");

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

    const getPercentile = (k) => {
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

    const counts = {};
    arr.forEach(val => counts[val] = (counts[val] || 0) + 1);
    let maxCount = 0;
    let modes = [];
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

    const finalStats = {
      n,
      mean: mean.toFixed(2),
      median: median.toFixed(2),
      mode: modeStr,
      variance: n > 1 ? variance.toFixed(2) : "N/A",
      stdDev: n > 1 ? stdDev.toFixed(2) : "N/A",
      sorted,
      frequencyTable,
      boxPlot: { minVal, maxVal, q1, median, q3 }
    };

    setStats(finalStats);
    setGlobalStats(finalStats);

  }, [rawData, setGlobalStats]);

  const statCards = [
    { label: "Muestra (n)", value: stats?.n, color: "text-blue-400" },
    { label: "Media (x̄)", value: stats?.mean, color: "text-emerald-400" },
    { label: "Mediana (Me)", value: stats?.median, color: "text-purple-400" },
    { label: "Moda (Mo)", value: stats?.mode, color: "text-pink-400" },
    { label: "Varianza (s²)", value: stats?.variance, color: "text-amber-400" },
    { label: "Desv. Est. (s)", value: stats?.stdDev, color: "text-rose-400" },
  ];

  let positionResult = "N/A";
  if (stats && stats.sorted && posInput) {
      let k = Number(posInput);
      if (!isNaN(k) && k > 0) {
          if (posType === 'cuartil') k = Math.min(k, 4) * 25;
          else if (posType === 'decil') k = Math.min(k, 10) * 10;
          else k = Math.min(k, 100);

          const pos = (k / 100) * stats.n;
          if (pos === 0) {
              positionResult = stats.sorted[0].toFixed(2);
          } else if (Number.isInteger(pos)) {
              positionResult = ((stats.sorted[pos - 1] + stats.sorted[pos]) / 2).toFixed(2);
          } else {
              const idx = Math.ceil(pos) - 1;
              positionResult = stats.sorted[Math.min(idx, stats.n - 1)].toFixed(2);
          }
      }
  }

  return (
    <div className="flex flex-col gap-4 h-full p-4 md:p-6">
      <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex-shrink-0 transition-all focus-within:border-indigo-500/30 focus-within:bg-black/60 shadow-inner">
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-shrink-0">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 md:p-4 flex flex-col justify-between transition-all hover:bg-white/[0.04] group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-16 h-16 bg-current opacity-[0.02] rounded-full -translate-y-1/2 translate-x-1/2 ${card.color}`}></div>
            <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-medium">{card.label}</p>
            {stats ? (
              <p className={`text-xl md:text-2xl font-bold mt-2 tracking-tight ${card.color} animate-in fade-in slide-in-from-bottom-2`}>
                {card.value}
              </p>
            ) : (
              <div className="h-6 md:h-8 w-1/2 bg-white/5 rounded mt-2 animate-pulse"></div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex-shrink-0 transition-all hover:bg-white/[0.03]">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Medidas de Posición</h3>
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
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex-shrink-0 transition-all hover:bg-white/[0.03]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Distribución de Frecuencias (Sturges)</h3>
            </div>
            <button 
              onClick={() => setExpandedTable(stats.frequencyTable)}
              title="Ampliar tabla y enfocar"
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto custom-scrollbar rounded-lg border border-white/5 bg-black/20">
            <table className="w-full text-left text-xs md:text-sm text-slate-300">
              <thead className="bg-white/5 text-slate-400 font-medium border-b border-white/5">
                <tr>
                  <th className="px-4 py-3">Clase</th>
                  <th className="px-4 py-3">Intervalo</th>
                  <th className="px-4 py-3">Marca (Xi)</th>
                  <th className="px-4 py-3">fi</th>
                  <th className="px-4 py-3">Fa</th>
                  <th className="px-4 py-3">fr</th>
                  <th className="px-4 py-3">fr %</th>
                </tr>
              </thead>
              <tbody>
                {stats.frequencyTable.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors last:border-0">
                    <td className="px-4 py-2.5 text-slate-500 text-center w-10">{row.clase}</td>
                    <td className="px-4 py-2.5 font-mono text-xs whitespace-nowrap">
                      <span className="text-slate-500">[</span>
                      {row.linf.toFixed(2)} - {row.lsup.toFixed(2)}
                      <span className="text-slate-500">{i === stats.frequencyTable.length - 1 ? ']' : ')'}</span>
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

      <div className="flex-1 mt-2 flex flex-col items-center justify-center border border-white/5 bg-white/[0.01] rounded-xl p-4 transition-all hover:bg-white/[0.02]">
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

const ChartsContent = ({ globalStats, onToggleSpotlight }) => {
  const [focusedChart, setFocusedChart] = useState(null);

  useEffect(() => {
    if (onToggleSpotlight) onToggleSpotlight(!!focusedChart);
    return () => { if(onToggleSpotlight) onToggleSpotlight(false); }
  }, [focusedChart, onToggleSpotlight]);

  if (!globalStats || !globalStats.frequencyTable) {
    return (
      <div className="flex flex-col gap-4 h-full p-4 md:p-6">
         <div className="flex-1 bg-black/40 border border-white/10 rounded-xl flex flex-col items-center justify-center group overflow-hidden relative p-8 text-center">
            <PieChart className="w-12 h-12 text-rose-500/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-2">A la espera de datos</h3>
            <p className="text-sm text-slate-500 max-w-sm">
              Ingresa tus datos en la aplicación de <span className="text-indigo-400">Estadística Descriptiva</span> para renderizar los gráficos automáticamente.
            </p>
         </div>
      </div>
    );
  }

  const { frequencyTable, boxPlot } = globalStats;
  const maxFi = Math.max(...frequencyTable.map(d => d.fi));

  const range = boxPlot.maxVal - boxPlot.minVal || 1; 
  const toPct = (val) => ((val - boxPlot.minVal) / range) * 100;
  const q1Pct = toPct(boxPlot.q1);
  const q3Pct = toPct(boxPlot.q3);
  const medPct = toPct(boxPlot.median);

  return (
    <div className="flex flex-col gap-6 min-h-full p-4 md:p-6 relative">
      
      {focusedChart && (
        <div 
          className="absolute inset-0 z-40 bg-[#030305]/70 backdrop-blur-sm transition-all duration-500 cursor-pointer"
          onClick={() => setFocusedChart(null)}
          title="Clic para salir del modo enfoque"
        ></div>
      )}

      <div 
        className={`bg-black/40 border border-white/10 rounded-xl p-5 md:p-6 flex flex-col lg:flex-row gap-6 transition-all duration-500 origin-center
          ${focusedChart === 'histogram' 
            ? 'relative z-50 ring-1 ring-indigo-500/50 shadow-[0_0_80px_rgba(99,102,241,0.15)] bg-[#0a0a0f]' 
            : focusedChart ? 'opacity-30 blur-md scale-95 pointer-events-none' : ''}`}
      >
        <div className="flex-1 flex flex-col w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Histograma de Frecuencias</h3>
            </div>
            <button 
              onClick={() => setFocusedChart(focusedChart === 'histogram' ? null : 'histogram')}
              title={focusedChart === 'histogram' ? "Contraer" : "Expandir y enfocar"}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white bg-white/5"
            >
              {focusedChart === 'histogram' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="flex-1 w-full min-h-[200px] flex items-end gap-1 relative pt-6 px-2">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 px-2 border-l border-b border-white/10">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full border-t border-white/5 relative">
                    <span className="absolute -left-6 -top-2.5 text-[10px] text-slate-500">{Math.round(maxFi * (1 - i/4))}</span>
                  </div>
                ))}
            </div>

            {frequencyTable.map((bin, i) => {
              const hPct = (bin.fi / maxFi) * 100;
              return (
                <div key={i} className="relative group flex-1 flex flex-col items-center justify-end h-full z-10">
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0a0a0f] border border-indigo-500/30 shadow-xl rounded-lg px-3 py-1.5 pointer-events-none z-50 flex flex-col items-center whitespace-nowrap">
                      <span className="text-xs font-bold text-indigo-400">fi: {bin.fi}</span>
                      <span className="text-[10px] text-slate-400">[{bin.linf.toFixed(1)} - {bin.lsup.toFixed(1)}{i === frequencyTable.length - 1 ? ']' : ')'}</span>
                  </div>
                  
                  <div 
                    className="w-full bg-gradient-to-t from-indigo-600/80 to-indigo-400/80 hover:from-indigo-500 hover:to-indigo-300 transition-all rounded-t-sm border border-indigo-400/20 shadow-[0_0_15px_rgba(99,102,241,0.1)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]" 
                    style={{ height: `${hPct}%`, minHeight: hPct > 0 ? '4px' : '0' }}
                  ></div>
                  <span className="text-[10px] text-slate-400 rotate-45 md:rotate-0 origin-left mt-3 absolute -bottom-6">{bin.marca.toFixed(1)}</span>
                </div>
              )
            })}
          </div>
        </div>

        {focusedChart === 'histogram' && (
          <div className="hidden lg:flex w-72 flex-col border-l border-white/10 pl-6 animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-indigo-400" />
                <h4 className="text-white font-semibold tracking-tight text-sm">¿Qué representa?</h4>
             </div>
             <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
               <p>
                 El <strong className="text-indigo-400">Histograma</strong> representa visualmente la distribución de frecuencias de tu muestra.
               </p>
               <p>
                 No hay espacios entre columnas porque los datos están agrupados en <strong>intervalos continuos</strong> (Regla de Sturges).
               </p>
               <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <span className="block text-slate-400 mb-1 font-medium">💡 Guía Rápida:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400">
                    <li><strong className="text-slate-300">Campana:</strong> Distribución normal.</li>
                    <li><strong className="text-slate-300">Sesgo Derecho:</strong> Cola larga a la derecha.</li>
                    <li><strong className="text-slate-300">Picos:</strong> Posible bimodalidad.</li>
                  </ul>
               </div>
             </div>
          </div>
        )}
      </div>

      <div 
        className={`bg-black/40 border border-white/10 rounded-xl p-5 md:p-6 flex flex-col lg:flex-row gap-6 transition-all duration-500 origin-center
          ${focusedChart === 'boxplot' 
            ? 'relative z-50 ring-1 ring-emerald-500/50 shadow-[0_0_80px_rgba(16,185,129,0.15)] bg-[#0a0a0f]' 
            : focusedChart ? 'opacity-30 blur-md scale-95 pointer-events-none' : ''}`}
      >
        <div className="flex-1 flex flex-col w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Diagrama de Caja y Bigotes</h3>
            </div>
            <button 
              onClick={() => setFocusedChart(focusedChart === 'boxplot' ? null : 'boxplot')}
              title={focusedChart === 'boxplot' ? "Contraer" : "Expandir y enfocar"}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white bg-white/5"
            >
              {focusedChart === 'boxplot' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="w-full px-6 py-10 relative">
            <div className="relative w-full h-16 flex items-center">
              <div className="absolute w-full h-px bg-white/10 rounded-full"></div>
              
              <div className="absolute h-px bg-emerald-500/80" style={{ left: '0%', width: `${q1Pct}%` }}></div>
              <div className="absolute w-1 h-6 bg-emerald-500/80 -translate-y-1/2 top-1/2 rounded-full" style={{ left: '0%' }}></div>

              <div 
                className="absolute h-10 bg-emerald-500/10 border-2 border-emerald-500/60 top-1/2 -translate-y-1/2 rounded flex items-center justify-center overflow-hidden hover:bg-emerald-500/20 transition-colors cursor-crosshair group/box z-10" 
                style={{ left: `${q1Pct}%`, width: `${q3Pct - q1Pct}%` }}
              >
                  <div className="absolute -top-10 opacity-0 group-hover/box:opacity-100 transition-opacity bg-[#0a0a0f] border border-emerald-500/30 rounded-lg px-2 py-1 text-[10px] text-emerald-300 pointer-events-none whitespace-nowrap z-50">
                      RIC: {(boxPlot.q3 - boxPlot.q1).toFixed(2)}
                  </div>
                  <div className="absolute w-1 h-full bg-emerald-400" style={{ left: `${((boxPlot.median - boxPlot.q1) / (boxPlot.q3 - boxPlot.q1)) * 100}%` }}></div>
              </div>

              <div className="absolute h-px bg-emerald-500/80" style={{ left: `${q3Pct}%`, width: `${100 - q3Pct}%` }}></div>
              <div className="absolute w-1 h-6 bg-emerald-500/80 -translate-y-1/2 top-1/2 -ml-1 rounded-full" style={{ left: '100%' }}></div>
            </div>

            <div className="relative w-full h-8 mt-2">
              <span className="absolute text-[10px] md:text-xs font-mono text-slate-400 -translate-x-1/2" style={{ left: '0%' }}>Min: {boxPlot.minVal.toFixed(1)}</span>
              <span className="absolute text-[10px] md:text-xs font-mono text-emerald-400 -translate-x-1/2 font-medium" style={{ left: `${q1Pct}%` }}>Q1: {boxPlot.q1.toFixed(1)}</span>
              <span className="absolute text-[10px] md:text-xs font-mono text-white -translate-x-1/2 font-bold bg-black/50 px-1 rounded border border-white/10" style={{ left: `${medPct}%` }}>Me: {boxPlot.median.toFixed(1)}</span>
              <span className="absolute text-[10px] md:text-xs font-mono text-emerald-400 -translate-x-1/2 font-medium" style={{ left: `${q3Pct}%` }}>Q3: {boxPlot.q3.toFixed(1)}</span>
              <span className="absolute text-[10px] md:text-xs font-mono text-slate-400 -translate-x-1/2" style={{ left: '100%' }}>Max: {boxPlot.maxVal.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {focusedChart === 'boxplot' && (
          <div className="hidden lg:flex w-72 flex-col border-l border-white/10 pl-6 animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-emerald-400" />
                <h4 className="text-white font-semibold tracking-tight text-sm">Tukey's 5 Numbers</h4>
             </div>
             <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
               <p>
                 El <strong className="text-emerald-400">Diagrama de Caja</strong> revela la dispersión y simetría de tus datos de un vistazo.
               </p>
               <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
                  <p><strong className="text-emerald-400">Caja (Q1 a Q3):</strong> Contiene el 50% central de los datos. Su ancho es el Rango Intercuartílico (RIC).</p>
                  <p><strong className="text-white">Línea (Me):</strong> Si no está centrada en la caja, tu distribución es asimétrica.</p>
                  <p><strong className="text-slate-400">Bigotes:</strong> Abarcan desde el valor Mínimo hasta el Máximo, mostrando la dispersión extrema.</p>
               </div>
             </div>
          </div>
        )}
      </div>

    </div>
  );
};

// --- MÓDULO 2: PROBABILIDAD (MOTOR MATEMÁTICO PURO) ---
const ProbabilityContent = ({ onToggleSpotlight }) => {
  const [focusedSection, setFocusedSection] = useState(null);

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

  const factorial = (num) => {
    if (num < 0) return BigInt(0);
    let result = BigInt(1);
    for (let i = 2; i <= num; i++) result *= BigInt(i);
    return result;
  };

  const permutation = (n, r) => {
    if (n < r || r < 0) return BigInt(0);
    return factorial(n) / factorial(n - r);
  };

  const combination = (n, r) => {
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


// --- GESTOR DE VENTANAS (OS SIMULATOR) ---

const Window = ({ 
  id, title, icon: Icon, color, content: Content, 
  isActive, isMinimized, isOpen, isMaximized, isSpotlight, position, size, zIndex,
  onFocus, onMinimize, onClose, onMaximize, onDrag, onBoundsChange, openApp, setExpandedTable, globalStats, setGlobalStats, onToggleSpotlight
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initX: 0, initY: 0 });
  const resizeRef = useRef({ startX: 0, startY: 0, initW: 0, initH: 0, initX: 0, initY: 0, direction: '' });

  const handlePointerDown = (e) => {
    if (isMaximized) return;
    onFocus(id);
    setIsDragging(true);
    e.target.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: position.x,
      initY: position.y
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    onDrag(id, { x: dragRef.current.initX + dx, y: dragRef.current.initY + dy });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  const handleResizeDown = (e, direction) => {
    e.stopPropagation();
    onFocus(id);
    setIsResizing(true);
    e.target.setPointerCapture(e.pointerId);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initW: size.width,
      initH: size.height,
      initX: position.x,
      initY: position.y,
      direction
    };
  };

  const handleResizeMove = (e) => {
    if (!isResizing) return;
    const { startX, startY, initW, initH, initX, initY, direction } = resizeRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newW = initW;
    let newH = initH;
    let newX = initX;
    let newY = initY;

    if (direction.includes('e')) newW = Math.max(350, initW + dx);
    if (direction.includes('s')) newH = Math.max(300, initH + dy);
    
    if (direction.includes('w')) {
      newW = Math.max(350, initW - dx);
      if (newW > 350) newX = initX + dx;
    }
    if (direction.includes('n')) {
      newH = Math.max(300, initH - dy);
      if (newH > 300) newY = initY + dy;
    }

    onBoundsChange(id, { x: newX, y: newY, width: newW, height: newH });
  };

  const handleResizeUp = (e) => {
    setIsResizing(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  const stopPropagation = (e) => e.stopPropagation();

  // FIX: Previene la creación de funciones inline para el efecto Spotlight en Window
  const handleToggleSpotlight = useCallback((active) => {
    if (onToggleSpotlight) onToggleSpotlight(id, active);
  }, [id, onToggleSpotlight]);

  let actualWidth = size.width;
  let actualLeft = position.x;

  if (isSpotlight && !isMaximized) {
      actualWidth = Math.min(window.innerWidth - 40, size.width + 320); 
      const widthDiff = actualWidth - size.width;
      actualLeft = Math.max(20, position.x - (widthDiff / 2)); 
  }

  const windowStyle = isMaximized ? {
    left: 0,
    top: 0,
    width: '100vw',
    height: 'calc(100vh - 80px)', 
    borderRadius: '0px',
    zIndex: zIndex
  } : {
    left: actualLeft,
    top: position.y,
    width: actualWidth,
    height: size.height,
    zIndex: zIndex
  };

  const animationClasses = (isDragging || isResizing) 
    ? '!duration-0 transition-none' 
    : 'transition-all duration-300 cubic-bezier-spring';

  return (
    <div 
      className={`absolute flex flex-col bg-[#0a0a0f]/85 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden origin-bottom
        ${!isMaximized ? 'rounded-2xl' : ''}
        ${animationClasses}
        ${isActive && !isMinimized && isOpen ? 'ring-1 ring-white/20 shadow-[0_0_60px_rgba(0,0,0,0.6)]' : 'opacity-90 grayscale-[20%]'}`}
      style={{
        ...windowStyle,
        opacity: !isOpen ? 0 : (isMinimized ? 0 : 1),
        transform: !isOpen 
          ? 'scale(0.95) translateY(20px)' 
          : (isMinimized ? 'scale(0.8) translateY(100px)' : 'scale(1) translateY(0)'),
        pointerEvents: (!isOpen || isMinimized) ? 'none' : 'auto'
      }}
      onPointerDown={() => onFocus(id)}
    >
      <div 
        className={`h-[42px] bg-white/[0.03] border-b border-white/5 flex items-center justify-between px-3 select-none z-20 ${!isMaximized ? 'cursor-grab active:cursor-grabbing' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex items-center gap-1.5 group/controls w-16" onPointerDown={stopPropagation}>
          <button 
            onClick={() => onClose(id)} 
            className="w-3 h-3 rounded-full bg-[#ff5f56] flex items-center justify-center text-black/60 hover:bg-[#ff5f56]/90 transition-colors"
          >
            <X className="w-2 h-2 opacity-0 group-hover/controls:opacity-100 transition-opacity" strokeWidth={3} />
          </button>
          <button 
            onClick={() => onMinimize(id)} 
            className="w-3 h-3 rounded-full bg-[#ffbd2e] flex items-center justify-center text-black/60 hover:bg-[#ffbd2e]/90 transition-colors"
          >
            <Minus className="w-2 h-2 opacity-0 group-hover/controls:opacity-100 transition-opacity" strokeWidth={3} />
          </button>
          <button 
            onClick={() => onMaximize(id)} 
            className="w-3 h-3 rounded-full bg-[#27c93f] flex items-center justify-center text-black/60 hover:bg-[#27c93f]/90 transition-colors"
          >
            {isMaximized 
              ? <Minimize2 className="w-2 h-2 opacity-0 group-hover/controls:opacity-100 transition-opacity" strokeWidth={3} />
              : <Maximize2 className="w-2 h-2 opacity-0 group-hover/controls:opacity-100 transition-opacity" strokeWidth={3} />
            }
          </button>
        </div>

        <div className="flex items-center gap-2 pointer-events-none flex-1 justify-center -ml-16">
          <Icon className={`w-3.5 h-3.5 ${color}`} />
          <span className="text-xs font-semibold text-slate-300 tracking-wide opacity-80">{title}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-black/20 flex flex-col z-10">
        <Content 
          openApp={openApp} 
          setExpandedTable={setExpandedTable} 
          globalStats={globalStats} 
          setGlobalStats={setGlobalStats} 
          onToggleSpotlight={handleToggleSpotlight}
        />
      </div>

      {!isMaximized && (
        <>
          <div className="absolute top-0 left-4 right-4 h-1.5 cursor-n-resize z-50" onPointerDown={e => handleResizeDown(e, 'n')} onPointerMove={handleResizeMove} onPointerUp={handleResizeUp} />
          <div className="absolute bottom-0 left-4 right-4 h-1.5 cursor-s-resize z-50" onPointerDown={e => handleResizeDown(e, 's')} onPointerMove={handleResizeMove} onPointerUp={handleResizeUp} />
          <div className="absolute left-0 top-4 bottom-4 w-1.5 cursor-w-resize z-50" onPointerDown={e => handleResizeDown(e, 'w')} onPointerMove={handleResizeMove} onPointerUp={handleResizeUp} />
          <div className="absolute right-0 top-4 bottom-4 w-1.5 cursor-e-resize z-50" onPointerDown={e => handleResizeDown(e, 'e')} onPointerMove={handleResizeMove} onPointerUp={handleResizeUp} />
          
          <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50" onPointerDown={e => handleResizeDown(e, 'nw')} onPointerMove={handleResizeMove} onPointerUp={handleResizeUp} />
          <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50" onPointerDown={e => handleResizeDown(e, 'ne')} onPointerMove={handleResizeMove} onPointerUp={handleResizeUp} />
          <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50" onPointerDown={e => handleResizeDown(e, 'sw')} onPointerMove={handleResizeMove} onPointerUp={handleResizeUp} />
          
          <div className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-50 flex items-end justify-end p-1 opacity-20 hover:opacity-100 transition-opacity" onPointerDown={e => handleResizeDown(e, 'se')} onPointerMove={handleResizeMove} onPointerUp={handleResizeUp}>
            <div className="w-2 h-2 border-r-2 border-b-2 border-white/50 rounded-br-sm pointer-events-none"></div>
          </div>
        </>
      )}
    </div>
  );
};


// --- APP PRINCIPAL (EL ESCRITORIO) ---

export default function App() {
  const [expandedTable, setExpandedTable] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);

  const [windows, setWindows] = useState([
    {
      id: 'stats',
      title: 'Estadística Descriptiva',
      icon: Activity,
      color: 'text-indigo-400',
      content: DescriptiveContent,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      isSpotlight: false,
      position: { x: 50, y: 50 },
      size: { width: 650, height: 600 },
      zIndex: 2
    },
    {
      id: 'charts',
      title: 'Visualizador de Datos',
      icon: PieChart,
      color: 'text-rose-400',
      content: ChartsContent,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      isSpotlight: false,
      position: { x: 300, y: 80 }, 
      size: { width: 550, height: 650 },
      zIndex: 1
    },
    {
      id: 'prob',
      title: 'Probabilidad',
      icon: Calculator,
      color: 'text-emerald-400',
      content: ProbabilityContent,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      isSpotlight: false,
      position: { x: Math.max(100, window.innerWidth - 500), y: 150 },
      size: { width: 450, height: 500 },
      zIndex: 1
    }
  ]);

  const [topZIndex, setTopZIndex] = useState(2);

  const applyTilingLayout = (currentWindows) => {
    if (typeof window === 'undefined') return currentWindows;

    let visibleWindows = currentWindows.filter(w => w.isOpen && !w.isMinimized);
    
    visibleWindows.sort((a, b) => {
      if (a.id === 'charts') return -1;
      if (b.id === 'charts') return 1;
      return 0;
    });

    const n = visibleWindows.length;
    if (n === 0) return currentWindows;

    const startX = 110; 
    const startY = 24;  
    const padding = 16; 
    const taskbarHeight = 90;
    
    const availableW = window.innerWidth - startX - padding;
    const availableH = window.innerHeight - startY - taskbarHeight;

    return currentWindows.map(w => {
      if (!w.isOpen || w.isMinimized) return w;
      
      const index = visibleWindows.findIndex(vw => vw.id === w.id);
      let newPos = { ...w.position };
      let newSize = { ...w.size };
      let isMax = false; 

      if (n === 1) {
        newPos = { x: startX, y: startY };
        newSize = { width: Math.min(800, availableW), height: availableH };
      } else if (n === 2) {
        const halfW = (availableW - padding) / 2;
        newPos = { x: startX + (index * (halfW + padding)), y: startY };
        newSize = { width: halfW, height: availableH };
      } else if (n === 3) {
        const halfW = (availableW - padding) / 2;
        const halfH = (availableH - padding) / 2;
        if (index === 0) {
          newPos = { x: startX, y: startY };
          newSize = { width: halfW, height: availableH };
        } else {
          newPos = { x: startX + halfW + padding, y: startY + ((index - 1) * (halfH + padding)) };
          newSize = { width: halfW, height: halfH };
        }
      } else if (n >= 4) {
        const idx = Math.min(index, 3);
        const halfW = (availableW - padding) / 2;
        const halfH = (availableH - padding) / 2;
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        newPos = { x: startX + (col * (halfW + padding)), y: startY + (row * (halfH + padding)) };
        newSize = { width: halfW, height: halfH };
      }

      return { ...w, position: newPos, size: newSize, isMaximized: isMax };
    });
  };

  useEffect(() => {
    setWindows(prev => applyTilingLayout(prev));
    const handleResize = () => setWindows(prev => applyTilingLayout(prev));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const focusWindow = (id) => {
    const newZ = topZIndex + 1;
    setTopZIndex(newZ);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: newZ } : w));
  };

  const updatePosition = (id, newPos) => setWindows(prev => prev.map(w => w.id === id ? { ...w, position: newPos } : w));
  const updateSize = (id, newSize) => setWindows(prev => prev.map(w => w.id === id ? { ...w, size: newSize } : w));
  
  const updateBounds = (id, bounds) => {
    setWindows(prev => prev.map(w => w.id === id ? { 
      ...w, 
      position: { x: bounds.x, y: bounds.y }, 
      size: { width: bounds.width, height: bounds.height } 
    } : w));
  };

  const toggleMaximize = (id) => { focusWindow(id); setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)); };
  
  const toggleSpotlight = useCallback((id, active) => {
    setWindows(prev => {
      const win = prev.find(w => w.id === id);
      if (win && win.isSpotlight === active) return prev;
      return prev.map(w => w.id === id ? { ...w, isSpotlight: active } : w);
    });
  }, []);

  const closeWindow = (id) => {
    setWindows(prev => {
      const updated = prev.map(w => w.id === id ? { ...w, isOpen: false, isMinimized: false, isSpotlight: false } : w);
      return applyTilingLayout(updated);
    });
  };

  const openApp = (id) => {
    const newZ = topZIndex + 1;
    setTopZIndex(newZ);
    setWindows(prev => {
      const win = prev.find(w => w.id === id);
      if (!win.isOpen || win.isMinimized) {
        const updated = prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: newZ } : w);
        return applyTilingLayout(updated);
      } else {
        return prev.map(w => w.id === id ? { ...w, zIndex: newZ } : w);
      }
    });
  };

  const handleTaskbarClick = (id) => {
    const newZ = topZIndex + 1;
    setTopZIndex(newZ);
    setWindows(prev => {
      const win = prev.find(w => w.id === id);
      if (win.zIndex === topZIndex && !win.isMinimized && win.isOpen) {
        const updated = prev.map(w => w.id === id ? { ...w, isMinimized: true } : w);
        return applyTilingLayout(updated);
      } else {
        const updated = prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: newZ } : w);
        if (win.isMinimized || !win.isOpen) return applyTilingLayout(updated);
        return updated;
      }
    });
  };

  return (
    <div className="h-screen w-full bg-[#030305] overflow-hidden relative font-sans selection:bg-indigo-500/30 text-slate-300">
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        .cubic-bezier-spring { transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1) !important; }
      `}} />

      <div className="absolute top-0 left-1/4 w-[60vw] h-[60vw] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[150px] translate-y-1/3 mix-blend-screen pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none mix-blend-overlay"></div>
      
      <div className="absolute top-4 left-4 flex flex-col gap-4 p-4 z-0">
         <div className="flex items-center gap-2 text-white/50 text-sm font-semibold mb-4 pointer-events-none">
            <Sparkles className="w-5 h-5 text-indigo-400" /> StatOS
         </div>
         <button onClick={() => openApp('stats')} className="flex flex-col items-center gap-2 w-20 p-2 rounded-xl hover:bg-white/5 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-[#0a0a0f] border border-indigo-500/30 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/5"></div>
                <Activity className="w-7 h-7 text-indigo-400 relative z-10" />
            </div>
            <span className="text-xs text-white/90 font-medium text-center drop-shadow-md">Estadística</span>
         </button>
         <button onClick={() => openApp('charts')} className="flex flex-col items-center gap-2 w-20 p-2 rounded-xl hover:bg-white/5 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-[#0a0a0f] border border-rose-500/30 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-orange-500/5"></div>
                <PieChart className="w-7 h-7 text-rose-400 relative z-10" />
            </div>
            <span className="text-xs text-white/90 font-medium text-center drop-shadow-md">Gráficas</span>
         </button>
         <button onClick={() => openApp('prob')} className="flex flex-col items-center gap-2 w-20 p-2 rounded-xl hover:bg-white/5 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-[#0a0a0f] border border-emerald-500/30 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/5"></div>
                <Calculator className="w-7 h-7 text-emerald-400 relative z-10" />
            </div>
            <span className="text-xs text-white/90 font-medium text-center drop-shadow-md">Probabilidad</span>
         </button>
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="relative w-full h-full">
          {windows.map(win => (
            <Window 
              key={win.id}
              {...win}
              openApp={openApp}
              setExpandedTable={setExpandedTable}
              globalStats={globalStats}
              setGlobalStats={setGlobalStats}
              isActive={win.zIndex === topZIndex}
              onFocus={focusWindow}
              onMinimize={() => {
                setWindows(prev => {
                  const updated = prev.map(w => w.id === win.id ? { ...w, isMinimized: true } : w);
                  return applyTilingLayout(updated);
                });
              }}
              onClose={closeWindow}
              onMaximize={toggleMaximize}
              onDrag={updatePosition}
              onResize={updateSize}
              onBoundsChange={updateBounds}
              onToggleSpotlight={toggleSpotlight}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-[#0a0a0f]/80 backdrop-blur-3xl border border-white/10 p-2 rounded-2xl shadow-2xl flex items-center gap-2">
           {windows.map(win => (
             <button 
               key={win.id}
               onClick={() => handleTaskbarClick(win.id)}
               className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group ${
                 win.zIndex === topZIndex && !win.isMinimized && win.isOpen
                   ? 'bg-white/15 shadow-inner' 
                   : 'hover:bg-white/10'
               } ${!win.isOpen ? 'hidden' : 'flex'}`}
             >
               <win.icon className={`w-6 h-6 transition-all duration-300 ${win.color} ${win.isMinimized ? 'opacity-50 scale-90' : 'opacity-100 scale-100 group-hover:scale-110'}`} />
               <div className={`absolute -bottom-1 h-1 rounded-full transition-all duration-300 ${
                  win.zIndex === topZIndex && !win.isMinimized ? 'w-4 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'w-1 bg-white/50'
               }`}></div>
             </button>
           ))}
           
           {windows.filter(w => w.isOpen).length > 0 && <div className="w-px h-8 bg-white/10 mx-1"></div>}

           <button 
             onClick={() => setWindows(prev => applyTilingLayout(prev))}
             title="Forzar Organización de Ventanas"
             className="flex items-center justify-center w-12 h-12 rounded-xl hover:bg-white/10 transition-colors group"
           >
              <LayoutGrid className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
           </button>

           <button className="flex items-center justify-center w-12 h-12 rounded-xl hover:bg-white/10 transition-colors">
              <Settings2 className="w-6 h-6 text-slate-400" />
           </button>
        </div>
      </div>

      {expandedTable && (
        <div 
          className="absolute inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setExpandedTable(null)}
        >
          <div 
            className="bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden ring-1 ring-white/5 animate-in zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/5 bg-white/[0.02]">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-inner">
                     <List className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                     <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight">Distribución de Frecuencias (Sturges)</h2>
                     <p className="text-xs md:text-sm text-slate-400 mt-1">Vista detallada y ampliada de los datos agrupados.</p>
                  </div>
               </div>
               <button 
                  onClick={() => setExpandedTable(null)} 
                  className="p-2.5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all text-slate-400 border border-transparent hover:border-red-500/30"
               >
                  <X className="w-6 h-6" />
               </button>
            </div>
            
            <div className="p-0 overflow-y-auto custom-scrollbar flex-1 bg-black/20">
               <table className="w-full text-left text-sm md:text-base text-slate-300">
                  <thead className="bg-white/[0.03] text-slate-400 font-medium border-b border-white/10 sticky top-0 backdrop-blur-xl shadow-md">
                     <tr>
                        <th className="px-6 py-4">Clase</th>
                        <th className="px-6 py-4">Intervalo</th>
                        <th className="px-6 py-4">Marca de Clase (Xi)</th>
                        <th className="px-6 py-4">Frec. Absoluta (fi)</th>
                        <th className="px-6 py-4">Frec. Acumulada (Fa)</th>
                        <th className="px-6 py-4">Frec. Relativa (fr)</th>
                        <th className="px-6 py-4">Frec. Porcentual (fr %)</th>
                     </tr>
                  </thead>
                  <tbody>
                     {expandedTable.map((row, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors last:border-0">
                           <td className="px-6 py-4 text-slate-500 font-medium w-16">{row.clase}</td>
                           <td className="px-6 py-4 font-mono text-sm whitespace-nowrap">
                              <span className="text-slate-500">[</span>
                              <span className="text-white">{row.linf.toFixed(2)}</span>
                              <span className="text-slate-500 mx-2">-</span>
                              <span className="text-white">{row.lsup.toFixed(2)}</span>
                              <span className="text-slate-500">{i === expandedTable.length - 1 ? ']' : ')'}</span>
                           </td>
                           <td className="px-6 py-4 text-slate-300 font-mono">{row.marca.toFixed(2)}</td>
                           <td className="px-6 py-4 font-bold text-emerald-400 text-lg">{row.fi}</td>
                           <td className="px-6 py-4 font-medium text-slate-300">{row.Fa}</td>
                           <td className="px-6 py-4 text-slate-400">{(row.fr).toFixed(4)}</td>
                           <td className="px-6 py-4 font-semibold text-indigo-400 tracking-wide">{row.FrPct.toFixed(2)}%</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}