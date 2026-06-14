"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  Sparkles, 
  PieChart,
  LayoutGrid,
  Settings2,
  Calculator,
  List,
  X
} from 'lucide-react';
import { Window } from '@/components/os/Window';
import { DescriptiveContent } from '@/components/apps/DescriptiveContent';
import { ChartsContent } from '@/components/apps/ChartsContent';
import { ProbabilityContent } from '@/components/apps/ProbabilityContent';

import { Landing } from '@/components/Landing';
import { BootSequence } from '@/components/BootSequence';
import { LoginScreen } from '@/components/LoginScreen';

function StatOS() {
  const [expandedTable, setExpandedTable] = useState<any>(null);
  const [globalStats, setGlobalStats] = useState<any>(null);

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
      position: { x: 800, y: 150 },
      size: { width: 450, height: 500 },
      zIndex: 1
    }
  ]);

  const [topZIndex, setTopZIndex] = useState(2);

  const applyTilingLayout = (currentWindows: any[]) => {
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

  const focusWindow = (id: string) => {
    const newZ = topZIndex + 1;
    setTopZIndex(newZ);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: newZ } : w));
  };

  const updatePosition = (id: string, newPos: any) => setWindows(prev => prev.map(w => w.id === id ? { ...w, position: newPos } : w));
  const updateSize = (id: string, newSize: any) => setWindows(prev => prev.map(w => w.id === id ? { ...w, size: newSize } : w));
  
  const updateBounds = (id: string, bounds: any) => {
    setWindows(prev => prev.map(w => w.id === id ? { 
      ...w, 
      position: { x: bounds.x, y: bounds.y }, 
      size: { width: bounds.width, height: bounds.height } 
    } : w));
  };

  const toggleMaximize = (id: string) => { focusWindow(id); setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)); };
  
  const toggleSpotlight = useCallback((id: string, active: boolean) => {
    setWindows(prev => {
      const win = prev.find(w => w.id === id);
      if (win && win.isSpotlight === active) return prev;
      return prev.map(w => w.id === id ? { ...w, isSpotlight: active } : w);
    });
  }, []);

  const closeWindow = (id: string) => {
    setWindows(prev => {
      const updated = prev.map(w => w.id === id ? { ...w, isOpen: false, isMinimized: false, isSpotlight: false } : w);
      return applyTilingLayout(updated);
    });
  };

  const openApp = (id: string) => {
    const newZ = topZIndex + 1;
    setTopZIndex(newZ);
    setWindows(prev => {
      const win = prev.find(w => w.id === id);
      if (win && (!win.isOpen || win.isMinimized)) {
        const updated = prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: newZ } : w);
        return applyTilingLayout(updated);
      } else {
        return prev.map(w => w.id === id ? { ...w, zIndex: newZ } : w);
      }
    });
  };

  const handleTaskbarClick = (id: string) => {
    const newZ = topZIndex + 1;
    setTopZIndex(newZ);
    setWindows(prev => {
      const win = prev.find(w => w.id === id);
      if (win && win.zIndex === topZIndex && !win.isMinimized && win.isOpen) {
        const updated = prev.map(w => w.id === id ? { ...w, isMinimized: true } : w);
        return applyTilingLayout(updated);
      } else {
        const updated = prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: newZ } : w);
        if (win && (win.isMinimized || !win.isOpen)) return applyTilingLayout(updated);
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
              onBoundsChange={updateBounds}
              onToggleSpotlight={toggleSpotlight}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-[#0a0a0f]/80 backdrop-blur-3xl border border-white/10 p-2 rounded-2xl shadow-2xl flex items-center gap-2">
           {windows.map((win: any) => {
             const Icon = win.icon;
             return (
             <button 
               key={win.id}
               onClick={() => handleTaskbarClick(win.id)}
               className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-150 group ${
                 win.zIndex === topZIndex && !win.isMinimized && win.isOpen
                   ? 'bg-white/15 shadow-inner' 
                   : 'hover:bg-white/10'
               } ${!win.isOpen ? 'hidden' : 'flex'}`}
             >
               <Icon className={`w-6 h-6 transition-all duration-150 ${win.color} ${win.isMinimized ? 'opacity-50 scale-90' : 'opacity-100 scale-100 group-hover:scale-110'}`} />
               <div className={`absolute -bottom-1 h-1 rounded-full transition-all duration-150 ${
                  win.zIndex === topZIndex && !win.isMinimized ? 'w-4 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'w-1 bg-white/50'
               }`}></div>
             </button>
           )})}
           
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
          className="absolute inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-150"
          onClick={() => setExpandedTable(null)}
        >
          <div 
            className="bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden ring-1 ring-white/5 animate-in zoom-in-95 duration-150"
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
                     {expandedTable.map((row: any, i: number) => (
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

export default function App() {
  const [step, setStep] = useState<'landing' | 'boot' | 'login' | 'os'>('landing');

  if (step === 'landing') {
    return <Landing onEnter={() => setStep('boot')} />;
  }

  if (step === 'boot') {
    return <BootSequence onComplete={() => setStep('login')} />;
  }

  if (step === 'login') {
    return <LoginScreen onLogin={() => setStep('os')} />;
  }

  return (
    <div className="animate-in fade-in zoom-in-[0.98] duration-700 fill-mode-forwards h-screen w-full">
      <StatOS />
    </div>
  );
}
