export interface BinData {
  rangeStr: string;
  min: number;
  max: number;
  frequency: number;     // fi
  relative: string;      // hi (formatted)
  cumulative: number;    // Fi
  
  // Advanced variables
  xi: number;            // Class mark
  hi: number;            // Relative frequency (numeric)
  Hi: number;            // Cumulative relative frequency
  percentage: string;    // hi * 100 %
  xi_fi: number;         // xi * fi
  xi_mean_sq: number;    // (xi - mean)²
  abs_dev: number;       // |xi - mean|
  fi_xi_mean_sq: number; // fi * (xi - mean)²
}

export function calculateFrequencyBins(data: number[], numBins = 8, precalculatedMean?: number): BinData[] {
  if (data.length === 0) return [];
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const mean = precalculatedMean ?? (data.reduce((a, b) => a + b, 0) / data.length);
  
  if (min === max) {
    const xi = min;
    return [{
      rangeStr: `${min} - ${max}`,
      min,
      max,
      frequency: data.length,
      relative: '1.00',
      cumulative: data.length,
      xi,
      hi: 1,
      Hi: 1,
      percentage: '100.00%',
      xi_fi: xi * data.length,
      xi_mean_sq: Math.pow(xi - mean, 2),
      abs_dev: Math.abs(xi - mean),
      fi_xi_mean_sq: data.length * Math.pow(xi - mean, 2)
    }];
  }

  const binWidth = (max - min) / numBins;
  const bins: BinData[] = [];
  
  for (let i = 0; i < numBins; i++) {
    const binMin = min + i * binWidth;
    const binMax = i === numBins - 1 ? max : min + (i + 1) * binWidth;
    const xi = (binMin + binMax) / 2;
    bins.push({
      rangeStr: `${binMin.toFixed(1)} - ${binMax.toFixed(1)}`,
      min: binMin,
      max: binMax,
      frequency: 0,
      relative: '0',
      cumulative: 0,
      xi,
      hi: 0,
      Hi: 0,
      percentage: '0%',
      xi_fi: 0,
      xi_mean_sq: Math.pow(xi - mean, 2),
      abs_dev: Math.abs(xi - mean),
      fi_xi_mean_sq: 0
    });
  }

  // Calculate frequencies
  data.forEach(val => {
    for (let i = 0; i < bins.length; i++) {
      const isLastBin = i === bins.length - 1;
      if (val >= bins[i].min && (isLastBin ? val <= bins[i].max : val < bins[i].max)) {
        bins[i].frequency++;
        break;
      }
    }
  });

  // Calculate relative, cumulative and advanced
  let cumulative = 0;
  let cumulativeHi = 0;
  
  bins.forEach(bin => {
    cumulative += bin.frequency;
    bin.cumulative = cumulative;
    
    bin.hi = bin.frequency / data.length;
    bin.relative = bin.hi.toFixed(2);
    
    cumulativeHi += bin.hi;
    bin.Hi = cumulativeHi;
    
    bin.percentage = (bin.hi * 100).toFixed(1) + '%';
    bin.xi_fi = bin.xi * bin.frequency;
    bin.fi_xi_mean_sq = bin.frequency * bin.xi_mean_sq;
  });

  return bins;
}

export interface Quartiles {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  iqr: number;
  lowerFence: number;
  upperFence: number;
  outliers: number[];
}

export function calculateQuartiles(data: number[]): Quartiles | null {
  if (data.length === 0) return null;
  
  const sorted = [...data].sort((a, b) => a - b);
  
  const getMedian = (arr: number[]) => {
    if (arr.length === 0) return 0;
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
  };

  const median = getMedian(sorted);
  
  const lowerHalf = sorted.slice(0, Math.floor(sorted.length / 2));
  const upperHalf = sorted.slice(Math.ceil(sorted.length / 2));
  
  const q1 = getMedian(lowerHalf) || median;
  const q3 = getMedian(upperHalf) || median;
  
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;
  
  const outliers = sorted.filter(x => x < lowerFence || x > upperFence);
  
  // Real min/max without outliers
  const nonOutliers = sorted.filter(x => x >= lowerFence && x <= upperFence);
  const min = nonOutliers.length > 0 ? nonOutliers[0] : sorted[0];
  const max = nonOutliers.length > 0 ? nonOutliers[nonOutliers.length - 1] : sorted[sorted.length - 1];

  return { min, q1, median, q3, max, iqr, lowerFence, upperFence, outliers };
}
