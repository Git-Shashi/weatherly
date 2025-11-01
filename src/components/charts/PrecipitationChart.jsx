import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const PrecipitationChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No precipitation data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{payload[0].payload.time}</p>
          <p className="text-sm text-blue-600">
            Rain: {payload[0].value}%
          </p>
          {payload[0].payload.humidity && (
            <p className="text-sm text-cyan-600">
              Humidity: {payload[0].payload.humidity}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="time" 
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis 
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          label={{ 
            value: 'Probability (%)', 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: 'hsl(var(--muted-foreground))' }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar 
          dataKey="pop" 
          fill="#3b82f6" 
          name="Rain Probability"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
