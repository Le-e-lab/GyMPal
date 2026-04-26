import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-xl shadow-xl">
        <p className="text-zinc-400 text-xs mb-1 font-medium">{label}</p>
        <p className="text-blue-400 font-bold text-lg">
          {payload[0].value} <span className="text-xs text-zinc-500">kg</span>
        </p>
      </div>
    );
  }
  return null;
};

const WeightChart = ({ data, target = 70 }) => {
  // Format data for Recharts
  const chartData = useMemo(() => (
    data.map(log => ({
      name: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: log.weight
    }))
  ), [data]);

  // Add dummy trendline data if we only have 0 or 1 point
  if (chartData.length === 0) {
    return (
      <div className="h-48 w-full flex items-center justify-center text-zinc-500 text-sm border border-dashed border-zinc-700 rounded-xl bg-zinc-900/50" role="status" aria-live="polite">
        Log your weight every Monday to see the trend!
      </div>
    );
  }
  
  if (chartData.length === 1) {
    chartData.push({ name: 'Goal', weight: target });
  }

  const latestWeight = chartData[chartData.length - 1]?.weight;

  return (
    <div className="w-full h-64 mt-4" role="img" aria-label="Body weight trend chart">
      <p className="sr-only">
        Weight trend chart. Current logged weight is {latestWeight} kilograms. Target weight is {target} kilograms.
      </p>
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <LineChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="name" 
            stroke="#52525b" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={['dataMin - 2', 'dataMax + 2']} 
            stroke="#52525b" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}kg`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#111827' }}
            activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChart;
