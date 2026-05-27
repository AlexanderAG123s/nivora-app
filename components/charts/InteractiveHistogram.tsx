"use client";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BinData } from "@/lib/statistics/charts";

interface InteractiveHistogramProps {
  bins: BinData[];
  showNormalCurve: boolean;
  isDensity: boolean;
  mean: number;
  stdDev: number;
}

export default function InteractiveHistogram({ bins, showNormalCurve, isDensity, mean, stdDev }: InteractiveHistogramProps) {
  const calculateNormalPDF = (x: number) => {
    if (stdDev === 0) return 0;
    const exponent = Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * exponent;
  };
  
  const totalCount = bins.reduce((sum, b) => sum + b.frequency, 0);
  const binWidth = bins.length > 0 ? bins[0].max - bins[0].min : 1;

  const chartData = bins.map(bin => {
    const yValue = isDensity ? (bin.frequency / totalCount) / binWidth : bin.frequency;
    const normalY = isDensity ? calculateNormalPDF(bin.xi) : calculateNormalPDF(bin.xi) * totalCount * binWidth;
    
    return {
      name: bin.rangeStr,
      xi: bin.xi,
      yValue: Number(yValue.toFixed(4)),
      normalValue: showNormalCurve ? Number(normalY.toFixed(4)) : null,
      frequency: bin.frequency
    };
  });

  return (
    <div style={{ width: '100%', height: '350px' }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="var(--text-muted)" 
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'var(--border-subtle)' }}
            dy={10}
          />
          <YAxis 
            stroke="var(--text-muted)" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => isDensity ? val.toFixed(2) : val}
          />
          <Tooltip 
            cursor={{ fill: 'var(--bg-secondary)' }}
            contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', fontSize: '0.875rem' }}
            labelStyle={{ color: 'var(--text-subtle)', marginBottom: '0.5rem' }}
            formatter={(value: any, name: string) => {
              if (name === 'normalValue') return [value, 'Curva Normal'];
              return [value, isDensity ? 'Densidad' : 'Frecuencia'];
            }}
          />
          <Bar dataKey="yValue" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} name="Valor" />
          {showNormalCurve && (
            <Line type="monotone" dataKey="normalValue" stroke="#EF4444" strokeWidth={2} dot={false} name="Curva Normal" />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
