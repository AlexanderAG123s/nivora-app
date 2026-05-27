"use client";
import { ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ScatterLineChartProps {
  data: number[];
  mode: 'scatter' | 'line';
}

export default function ScatterLineChart({ data, mode }: ScatterLineChartProps) {
  const chartData = data.map((val, index) => ({
    index: index + 1,
    value: val
  }));

  return (
    <div style={{ width: '100%', height: '350px' }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
          <XAxis 
            type="number"
            dataKey="index" 
            stroke="var(--text-muted)" 
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'var(--border-subtle)' }}
            domain={['dataMin', 'dataMax']}
            name="Índice"
          />
          <YAxis 
            type="number"
            dataKey="value"
            stroke="var(--text-muted)" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
            name="Valor"
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', fontSize: '0.875rem' }}
            formatter={(val: number) => [val, 'Valor']}
            labelFormatter={(label: any) => `Índice: ${label}`}
          />
          {mode === 'scatter' ? (
            <Scatter name="Datos" dataKey="value" fill="var(--accent-blue)" />
          ) : (
            <Line type="monotone" dataKey="value" stroke="var(--accent-blue)" strokeWidth={2} dot={{ r: 3, fill: 'var(--accent-blue)' }} activeDot={{ r: 6 }} />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
