import { useState } from 'react'
import { ModulContent } from '@/components/modules/ModulCrudPage'
import { BUM_BERSAMA_CONFIG, BUM_DESA_CONFIG } from '@/data/modulConfigs'
import { Building2, Handshake } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  {
    key: 'bum-desa',
    label: 'BUM Desa',
    icon: <Building2 className="w-4 h-4" />,
    config: BUM_DESA_CONFIG,
  },
  {
    key: 'bum-bersama',
    label: 'BUM Desa Bersama',
    icon: <Handshake className="w-4 h-4" />,
    config: BUM_BERSAMA_CONFIG,
  },
] as const

export default function BUMDesaPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('bum-desa')
  const active = TABS.find((t) => t.key === tab) ?? TABS[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">BUM Desa & BUM Desa Bersama</h1>
        <p className="page-subtitle">
          Data Badan Usaha Milik Desa dan kemitraan BUM bersama antar desa (data demonstrasi).
        </p>
      </div>

      <div className="inline-flex rounded-lg bg-neutral-100 p-1 gap-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors',
              tab === t.key && 'bg-white shadow-sm text-neutral-900'
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <ModulContent config={active.config} />
    </div>
  )
}
