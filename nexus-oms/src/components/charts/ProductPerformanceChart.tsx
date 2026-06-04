import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ProductPerformanceChartProps {
  data?: { name: string; revenue: number; growth: number }[]
}

const defaultData = [
  { name: 'Nexus Pro', revenue: 124800, growth: 18 },
  { name: 'Quantum ANC', revenue: 89200, growth: 12 },
  { name: 'Cloud Node', revenue: 65300, growth: -3 },
  { name: 'Titanium X20', revenue: 45100, growth: 24 },
  { name: 'Studio Pro', revenue: 38100, growth: 8 },
]

export default function ProductPerformanceChart({ data = defaultData }: ProductPerformanceChartProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" opacity={0.3} horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }}
            axisLine={{ stroke: 'var(--color-outline-variant)', opacity: 0.2 }}
            tickLine={false}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }}
            axisLine={false}
            tickLine={false}
            width={100}
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
          <Bar
            dataKey="revenue"
            fill="var(--color-primary)"
            radius={[0, 4, 4, 0]}
            opacity={0.85}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
