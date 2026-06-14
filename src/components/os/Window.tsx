"use client";

import React, { useRef, useEffect } from 'react';
import { 
  X, 
  Minus, 
  Square,
  Focus
} from 'lucide-react';

export const Window = ({ 
  id, title, icon: Icon, color, content: Content, 
  isOpen, isMinimized, isMaximized, position, size, zIndex,
  isActive, onFocus, onMinimize, onClose, onMaximize,
  onDrag, onBoundsChange, openApp, setExpandedTable, 
  globalStats, setGlobalStats, isSpotlight, onToggleSpotlight
}: any) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ isDragging: false, isResizing: false, startX: 0, startY: 0, startPos: {x:0, y:0}, startSize: {w:0, h:0}, resizeDir: '' });

  const handleToggleSpotlight = React.useCallback((active: boolean) => {
    if (onToggleSpotlight) onToggleSpotlight(id, active);
  }, [id, onToggleSpotlight]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragRef.current.isDragging && !isMaximized) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        onDrag(id, {
          x: Math.max(0, dragRef.current.startPos.x + dx),
          y: Math.max(0, dragRef.current.startPos.y + dy)
        });
      } else if (dragRef.current.isResizing && !isMaximized) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        const dir = dragRef.current.resizeDir;
        
        let newW = dragRef.current.startSize.w;
        let newH = dragRef.current.startSize.h;
        let newX = dragRef.current.startPos.x;
        let newY = dragRef.current.startPos.y;

        if (dir.includes('e')) newW = Math.max(300, newW + dx);
        if (dir.includes('s')) newH = Math.max(200, newH + dy);
        if (dir.includes('w')) {
          const possibleW = Math.max(300, newW - dx);
          if (possibleW > 300) { newW = possibleW; newX = newX + dx; }
        }
        if (dir.includes('n')) {
          const possibleH = Math.max(200, newH - dy);
          if (possibleH > 200) { newH = possibleH; newY = newY + dy; }
        }

        onBoundsChange(id, { x: newX, y: newY, width: newW, height: newH });
      }
    };

    const handleMouseUp = () => {
      dragRef.current.isDragging = false;
      dragRef.current.isResizing = false;
    };

    if (isOpen) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [id, isMaximized, isOpen, onDrag, onBoundsChange]);

  if (!isOpen) return null;

  const currentPos = isMaximized ? { x: 0, y: 0 } : position;
  const currentSize = isMaximized 
    ? { width: '100%', height: 'calc(100vh - 90px)' } 
    : size;

  const handlePointerDown = (e: React.PointerEvent, type: 'drag' | 'resize', dir: string = '') => {
    onFocus(id);
    if (e.button !== 0) return;
    dragRef.current = {
      isDragging: type === 'drag',
      isResizing: type === 'resize',
      startX: e.clientX,
      startY: e.clientY,
      startPos: { ...currentPos },
      startSize: { w: currentSize.width as number, h: currentSize.height as number },
      resizeDir: dir
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };


  return (
    <div
      ref={windowRef}
      onPointerDown={() => onFocus(id)}
      className={`absolute flex flex-col rounded-2xl overflow-hidden pointer-events-auto
        ${isActive ? 'ring-1 ring-white/20 shadow-[0_30px_100px_rgba(0,0,0,0.8)]' : 'ring-1 ring-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'}
        cubic-bezier-spring origin-center ${isActive ? '' : 'grayscale-[20%] opacity-95'}
        ${isSpotlight ? 'ring-2 ring-indigo-500/50 shadow-[0_0_100px_rgba(99,102,241,0.2)]' : ''}
      `}
      style={{
        left: currentPos.x,
        top: currentPos.y,
        width: currentSize.width,
        height: currentSize.height,
        zIndex: isSpotlight ? zIndex + 100 : zIndex,
        transform: isMinimized ? 'scale(0.95) translateY(50px)' : 'scale(1) translateY(0)',
        opacity: isMinimized ? 0 : 1,
        pointerEvents: isMinimized ? 'none' : 'auto',
        transition: dragRef.current.isDragging || dragRef.current.isResizing ? 'none' : 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        backgroundColor: 'rgba(10, 10, 15, 0.65)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
      }}
    >
      <div 
        onPointerDown={(e) => handlePointerDown(e, 'drag')}
        className={`h-12 flex items-center justify-between px-4 select-none cursor-grab active:cursor-grabbing border-b border-white/5
          ${isActive ? 'bg-white/[0.03]' : 'bg-transparent'}
        `}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-4 group">
            <button 
              onPointerDown={(e) => { e.stopPropagation(); onClose(id); }}
              className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-400 flex items-center justify-center transition-colors"
            >
              <X className="w-2.5 h-2.5 text-black/80 opacity-0 group-hover:opacity-100" />
            </button>
            <button 
              onPointerDown={(e) => { e.stopPropagation(); onMinimize(id); }}
              className="w-3.5 h-3.5 rounded-full bg-amber-500/80 hover:bg-amber-400 flex items-center justify-center transition-colors"
            >
              <Minus className="w-2.5 h-2.5 text-black/80 opacity-0 group-hover:opacity-100" />
            </button>
            <button 
              onPointerDown={(e) => { e.stopPropagation(); onMaximize(id); }}
              className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 hover:bg-emerald-400 flex items-center justify-center transition-colors"
            >
              <Square className="w-2.5 h-2.5 text-black/80 opacity-0 group-hover:opacity-100" />
            </button>
          </div>
          <Icon className={`w-4 h-4 ${isActive ? color : 'text-slate-500'}`} />
          <span className={`text-xs font-semibold tracking-wide ${isActive ? 'text-white' : 'text-slate-400'}`}>
            {title}
          </span>
        </div>

        {onToggleSpotlight && (
          <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onToggleSpotlight(id, !isSpotlight)}
            className={`p-1.5 rounded-md transition-colors ${isSpotlight ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:bg-white/10 hover:text-white'}`}
            title="Modo Enfoque (Resaltar ventana)"
          >
            <Focus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden relative">
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
          <div onPointerDown={(e) => handlePointerDown(e, 'resize', 'e')} className="absolute top-0 right-0 w-2 h-full cursor-e-resize" />
          <div onPointerDown={(e) => handlePointerDown(e, 'resize', 'w')} className="absolute top-0 left-0 w-2 h-full cursor-w-resize" />
          <div onPointerDown={(e) => handlePointerDown(e, 'resize', 's')} className="absolute bottom-0 left-0 w-full h-2 cursor-s-resize" />
          <div onPointerDown={(e) => handlePointerDown(e, 'resize', 'n')} className="absolute top-0 left-0 w-full h-2 cursor-n-resize" />
          <div onPointerDown={(e) => handlePointerDown(e, 'resize', 'se')} className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" />
          <div onPointerDown={(e) => handlePointerDown(e, 'resize', 'sw')} className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize" />
          <div onPointerDown={(e) => handlePointerDown(e, 'resize', 'ne')} className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize" />
          <div onPointerDown={(e) => handlePointerDown(e, 'resize', 'nw')} className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize" />
        </>
      )}
    </div>
  );
};
