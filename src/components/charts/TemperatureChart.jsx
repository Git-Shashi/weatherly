import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

export const TemperatureChart = ({ data, unit = 'celsius' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{payload[0].payload.time}</p>
          <p className="text-sm text-blue-600">
            Temp: {Math.round(payload[0].value)}°{unit === 'celsius' ? 'C' : 'F'}
          </p>
          {payload[1] && (
            <p className="text-sm text-orange-600">
              Feels like: {Math.round(payload[1].value)}°{unit === 'celsius' ? 'C' : 'F'}
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
            value: `Temperature (°${unit === 'celsius' ? 'C' : 'F'})`, 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: 'hsl(var(--muted-foreground))' }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="temp" 
          stroke="#3b82f6" 
          strokeWidth={2}
          name="Temperature"
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="feelsLike" 
          stroke="#f97316" 
          strokeWidth={2}
          strokeDasharray="5 5"
          name="Feels Like"
          dot={{ fill: '#f97316', r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
