import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface RevenueChartProps {
  data?: { month: string; value: number }[]
}

const defaultData = [
  { month: 'Jan', value: 150000 },
  { month: 'Feb', value: 140000 },
  { month: 'Mar', value: 100000 },
  { month: 'Apr', value: 80000 },
  { month: 'May', value: 140000 },
  { month: 'Jun', value: 180000 },
]

export default function RevenueChart({ data = defaultData }: RevenueChartProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" opacity={0.3} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }}
            axisLine={{ stroke: 'var(--color-outline-variant)', opacity: 0.2 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
            formatter={((value: number) => [`$${value.toLocaleString()}`, 'Revenue']) as any}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-primary)"
            strokeWidth={2.5}
            dot={{ fill: 'var(--color-primary)', r: 4, strokeWidth: 2, stroke: 'white' }}
            activeDot={{ r: 6, fill: 'var(--color-primary)', stroke: 'white', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
