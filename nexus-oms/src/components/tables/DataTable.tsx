interface Column<T> {
  key: string
  header: string
  render: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  headerClassName?: string
}

export default function DataTable<T>({ columns, data, headerClassName }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className={`bg-surface-container-low/50 ${headerClassName || ''}`}>
            {columns.map((col) => (
              <th key={col.key} className={`px-8 py-5 font-label-sm text-on-surface-variant uppercase tracking-widest font-bold ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-surface-container-low/30 transition-colors group">
              {columns.map((col) => (
                <td key={col.key} className={`px-8 py-5 ${col.className || ''}`}>
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
