export function SkeletonCard() {
  return (
    <div className="panel animate-pulse" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ height: '1rem', width: '40%', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}></div>
        <div style={{ height: '1rem', width: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}></div>
      </div>
      <div style={{ height: '2rem', width: '60%', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}></div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="animate-pulse" style={{ width: '100%', height: '240px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}></div>
  );
}

export function SkeletonTable() {
  return (
    <div className="animate-pulse" style={{ width: '100%', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
      <div style={{ height: '40px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}></div>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ height: '48px', borderBottom: i !== 3 ? '1px solid var(--border-subtle)' : 'none', backgroundColor: 'var(--bg-primary)' }}></div>
      ))}
    </div>
  );
}
