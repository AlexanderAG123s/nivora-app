import ProbabilityCalculator from "@/components/probability/ProbabilityCalculator";

export default function ProbabilityPage() {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Probabilidad y Conteo
          </h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem' }}>Cálculos combinatorios interactivos.</p>
        </div>
      </div>
      
      <ProbabilityCalculator />
    </>
  );
}
