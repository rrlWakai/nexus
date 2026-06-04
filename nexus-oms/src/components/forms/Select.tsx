import { type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export default function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor={props.id}>
          {label}
        </label>
      )}
      <select
        className={`w-full h-12 bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 font-body-md focus:ring-2 focus:ring-primary/20 transition-all appearance-none ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
