"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart,
  Minimize2,
  Maximize2,
  GitCommit,
  Info
} from 'lucide-react';

export const ChartsContent = ({ globalStats, onToggleSpotlight }: any) => {
  const [focusedChart, setFocusedChart] = useState<string | null>(null);

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
  const maxFi = Math.max(...frequencyTable.map((d: any) => d.fi));

  const range = boxPlot.maxVal - boxPlot.minVal || 1; 
  const toPct = (val: number) => ((val - boxPlot.minVal) / range) * 100;
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

            {frequencyTable.map((bin: any, i: number) => {
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
                  <div className="absolute w-1 h-full bg-emerald-400" style={{ left: `${boxPlot.q3 === boxPlot.q1 ? 50 : ((boxPlot.median - boxPlot.q1) / (boxPlot.q3 - boxPlot.q1)) * 100}%` }}></div>
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
