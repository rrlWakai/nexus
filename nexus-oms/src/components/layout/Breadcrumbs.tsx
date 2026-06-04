interface BreadcrumbsProps {
  items: { label: string; href?: string }[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-outline font-label-md mb-2">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && <span className="material-symbols-outlined text-[14px]">chevron_right</span>}
          {item.href ? (
            <a href={item.href} className={index === items.length - 1 ? 'text-primary font-semibold' : ''}>
              {item.label}
            </a>
          ) : (
            <span className={index === items.length - 1 ? 'text-primary font-semibold' : ''}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
