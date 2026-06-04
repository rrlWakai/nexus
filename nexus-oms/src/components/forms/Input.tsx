import { type InputHTMLAttributes } from 'react'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  icon?: string
  onChange?: (value: string) => void
}

export default function Input({ label, error, icon, onChange, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="font-label-md text-label-md text-on-surface-variant block ml-1" htmlFor={props.id}>
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
            {icon}
          </span>
        )}
        <input
          className={`w-full h-14 bg-surface-container-low border-0 rounded-xl px-5 font-body-md text-body-md text-ink-primary transition-all duration-300 ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary focus:bg-white focus:shadow-sm outline-none ${icon ? 'pl-12' : ''} ${className}`}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          {...props}
        />
      </div>
      {error && <p className="font-label-sm text-label-sm text-error ml-1">{error}</p>}
    </div>
  )
}
