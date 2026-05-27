"use client";
import { useState } from "react";
import CountingTechniques from "./CountingTechniques";
import BinomialTheorem from "./BinomialTheorem";
import EventProbability from "./EventProbability";

export default function ProbabilityCalculator() {
  const [activeTab, setActiveTab] = useState<'counting' | 'binomial' | 'events'>('counting');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <button onClick={() => setActiveTab('counting')} style={tabStyle(activeTab === 'counting')}>Técnicas de Conteo</button>
        <button onClick={() => setActiveTab('binomial')} style={tabStyle(activeTab === 'binomial')}>Teorema del Binomio</button>
        <button onClick={() => setActiveTab('events')} style={tabStyle(activeTab === 'events')}>Probabilidad de Eventos</button>
      </div>

      <div style={{ minHeight: '400px' }}>
        {activeTab === 'counting' && <CountingTechniques />}
        {activeTab === 'binomial' && <BinomialTheorem />}
        {activeTab === 'events' && <EventProbability />}
      </div>
    </div>
  );
}

function tabStyle(isActive: boolean): React.CSSProperties {
  return {
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: isActive ? 'var(--accent-blue)' : 'var(--text-subtle)',
    border: 'none',
    borderBottom: isActive ? '2px solid var(--accent-blue)' : '2px solid transparent',
    fontWeight: isActive ? 600 : 500,
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    transform: 'translateY(1px)'
  };
}
