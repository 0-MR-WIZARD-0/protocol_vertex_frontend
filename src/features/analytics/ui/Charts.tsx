/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function AnalyticsCharts({ data }: { data: any[] }) {
  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="mb-2">По дням</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line dataKey="done" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="mb-2">Бар график</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="done" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}