import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline'
  className?: string
  children: React.ReactNode
}

const variants = {
  default: 'bg-neutral-100 text-neutral-800',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  outline: 'border border-neutral-200 bg-white text-neutral-600',
}

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const map: Record<string, keyof typeof variants> = {
    Lengkap: 'success',
    'Dalam Proses': 'warning',
    'Belum Diisi': 'danger',
  }
  const variant = map[status] || 'outline'
  return <Badge variant={variant} className={className}>{status}</Badge>
}
