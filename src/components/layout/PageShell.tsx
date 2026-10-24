import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface PageShellProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  children: React.ReactNode
}

export function PageShell({ title, subtitle, children, className }: PageShellProps) {
  return (
    <div className={cn(className)}>
      {title && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
          {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}
