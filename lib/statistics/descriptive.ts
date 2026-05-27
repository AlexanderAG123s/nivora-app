export function calculateMean(data: number[]): number {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
}

export function calculateMedian(data: number[]): number {
  if (data.length === 0) return 0;
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

export function calculateMode(data: number[]): number[] {
  if (data.length === 0) return [];
  
  const frequency: Record<number, number> = {};
  let maxFreq = 0;
  
  data.forEach(val => {
    frequency[val] = (frequency[val] || 0) + 1;
    if (frequency[val] > maxFreq) {
      maxFreq = frequency[val];
    }
  });

  const modes: number[] = [];
  for (const key in frequency) {
    if (frequency[key] === maxFreq) {
      modes.push(Number(key));
    }
  }
  
  return modes;
}

export function calculateVariance(data: number[], isSample = true): number {
  if (data.length <= 1) return 0;
  const mean = calculateMean(data);
  const sumSq = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  return sumSq / (data.length - (isSample ? 1 : 0));
}

export function calculateStdDev(data: number[], isSample = true): number {
  return Math.sqrt(calculateVariance(data, isSample));
}

export function calculateRange(data: number[]): number {
  if (data.length === 0) return 0;
  return Math.max(...data) - Math.min(...data);
}

export function calculatePercentile(data: number[], p: number): number {
  if (data.length === 0) return 0;
  if (p <= 0) return Math.min(...data);
  if (p >= 100) return Math.max(...data);

  const sorted = [...data].sort((a, b) => a - b);
  const k = (sorted.length - 1) * (p / 100);
  const f = Math.floor(k);
  const c = Math.ceil(k);

  if (f === c) return sorted[k];

  return sorted[f] + (sorted[c] - sorted[f]) * (k - f);
}
