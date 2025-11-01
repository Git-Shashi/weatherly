import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const WindChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No wind data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{payload[0].payload.time}</p>
          <p className="text-sm text-gray-600">
            Wind Speed: {Math.round(payload[0].value)} km/h
          </p>
          {payload[0].payload.direction && (
            <p className="text-sm text-gray-500">
              Direction: {payload[0].payload.direction}°
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
            value: 'Wind Speed (km/h)', 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: 'hsl(var(--muted-foreground))' }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="speed" 
          stroke="#6b7280" 
          strokeWidth={2}
          name="Wind Speed"
          dot={{ fill: '#6b7280', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
