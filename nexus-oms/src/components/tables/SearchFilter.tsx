interface SearchFilterProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

export default function SearchFilter({ placeholder = "Search...", value, onChange }: SearchFilterProps) {
  return (
    <div className="relative w-full max-w-md">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[20px]">
        search
      </span>
      <input
        className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-body-md focus:ring-2 focus:ring-primary/20 transition-all"
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
