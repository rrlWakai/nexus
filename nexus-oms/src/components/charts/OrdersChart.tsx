import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface OrdersChartProps {
  data?: { month: string; value: number }[]
}

const defaultData = [
  { month: 'Jan', value: 30 },
  { month: 'Feb', value: 45 },
  { month: 'Mar', value: 60 },
  { month: 'Apr', value: 85 },
  { month: 'May', value: 100 },
  { month: 'Jun', value: 50 },
]

export default function OrdersChart({ data = defaultData }: OrdersChartProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
            formatter={((value: number) => [value, 'Orders']) as any}
          />
          <Bar
            dataKey="value"
            fill="var(--color-primary)"
            radius={[4, 4, 0, 0]}
            opacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
