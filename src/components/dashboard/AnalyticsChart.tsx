'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

interface DayData {
  date: string
  views: number
}

interface AnalyticsChartProps {
  data: DayData[]
  type?: 'line' | 'bar'
}

export default function AnalyticsChart({ data, type = 'line' }: AnalyticsChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
        No data yet — share your portfolio to get views!
      </div>
    )
  }

  const formatted = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))

  const commonProps = {
    data: formatted,
    margin: { top: 5, right: 10, left: -20, bottom: 0 },
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      {type === 'bar' ? (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
          <Bar dataKey="views" fill="#7c3aed" radius={[4, 4, 0, 0]} />
        </BarChart>
      ) : (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
          <Line type="monotone" dataKey="views" stroke="#7c3aed" strokeWidth={2} dot={false} />
        </LineChart>
      )}
    </ResponsiveContainer>
  )
}