"use client";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

export function BlockEquation({ math }: { math: string }) {
  return (
    <div style={{ 
      color: 'var(--text-main)', 
      background: 'var(--bg-primary)', 
      padding: '1rem', 
      borderRadius: '6px',
      border: '1px solid var(--border-subtle)'
    }}>
      <BlockMath math={math} />
    </div>
  );
}

export function InlineEquation({ math }: { math: string }) {
  return (
    <span style={{ color: 'var(--text-main)' }}>
      <InlineMath math={math} />
    </span>
  );
}
