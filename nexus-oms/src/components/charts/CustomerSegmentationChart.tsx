import { Cell, PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface CustomerSegmentationChartProps {
  data?: { name: string; value: number; color: string }[]
}

const defaultData = [
  { name: 'Enterprise', value: 35, color: '#0066cc' },
  { name: 'SME', value: 25, color: '#34C759' },
  { name: 'Startup', value: 20, color: '#FF9F0C' },
  { name: 'Individual', value: 12, color: '#883700' },
  { name: 'Other', value: 8, color: '#aac7ff' },
]

export default function CustomerSegmentationChart({ data = defaultData }: CustomerSegmentationChartProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
            formatter={((value: number, _name: string) => [value, _name]) as any}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span style={{ color: 'var(--color-on-surface-variant)', fontSize: 12 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
