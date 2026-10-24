import { NavLink } from 'react-router-dom'
import {
  Home,
  Building2,
  BarChart3,
  FileText,
  X,
  FileCheck,
  Settings,
  DollarSign,
  File,
  Users,
  Building,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Building2,
  BarChart3,
  FileText,
  X,
  FileCheck,
  Settings,
  DollarSign,
  File,
  Users,
  Building,
  ShieldCheck,
}

interface MenuItem {
  label: string
  href: string
  icon: keyof typeof iconMap
}

interface MenuGroup {
  label: string
  items: MenuItem[]
}

const MENU: MenuGroup[] = [
  {
    label: 'Utama',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: 'Home' },
      { label: 'Data Desa', href: '/data-desa', icon: 'Building2' },
    ],
  },
  {
    label: 'Administrasi Desa',
    items: [
      { label: 'IDM', href: '/idm', icon: 'BarChart3' },
      { label: 'Pengajuan Dana Desa (DD)', href: '/pengajuan-dana-desa', icon: 'DollarSign' },
      { label: 'Pengajuan ADD', href: '/pengajuan-add', icon: 'DollarSign' },
      { label: 'APBDes', href: '/apbdes', icon: 'FileText' },
      { label: 'SK Aparat Desa', href: '/sk-aparat-desa', icon: 'FileCheck' },
      { label: 'SK BPD', href: '/sk-bpd', icon: 'FileCheck' },
      { label: 'Profil Desa', href: '/profil-desa', icon: 'Building' },
      { label: 'Berita Acara Musrenbang Desa', href: '/berita-acara-musrenbang', icon: 'File' },
      { label: 'SK Kader Posyandu Desa', href: '/sk-kader-posyandu', icon: 'ShieldCheck' },
      { label: 'RTLH', href: '/rtlh', icon: 'Users' },
      { label: 'BUM Desa & BUM Desa Bersama', href: '/bum-desa', icon: 'Building2' },
    ],
  },
  {
    label: 'Sistem',
    items: [
      { label: 'Dokumen', href: '/dokumen', icon: 'File' },
      { label: 'Laporan', href: '/laporan', icon: 'FileText' },
      { label: 'Pengaturan', href: '/pengaturan', icon: 'Settings' },
    ],
  },
]

export interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <nav className="flex flex-col h-full">
      <div className="flex items-center justify-between h-12 px-4 border-b border-neutral-200">
        <span className="font-bold text-primary-700 tracking-tight">DesaAdmin</span>
        {isOpen && (
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-neutral-900"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {MENU.map((group) => (
          <div key={group.label} className="mb-4">
            <h3 className="px-3 mb-2 text-xs font-medium text-neutral-400 uppercase tracking-wider">
              {group.label}
            </h3>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = iconMap[item.icon] ?? FileText
                return (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      end={item.href === '/dashboard'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors',
                          isActive && 'bg-primary-50 text-primary-700'
                        )
                      }
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        <div className="px-3 pt-4 border-t border-neutral-200">
          <p className="text-xs text-neutral-400 mb-3">Prototype Demo</p>
          <NavLink
            to="/laporan"
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors',
                isActive && 'bg-primary-50 border-primary-200 text-primary-700'
              )
            }
          >
            <FileText className="w-4 h-4" />
            Rekap & ekspor data demo
          </NavLink>
          <p className="px-3 pt-3 text-[11px] leading-relaxed text-neutral-400">
            Semua data di aplikasi ini adalah data demonstrasi (mock); perubahan hanya tersimpan di localStorage.
          </p>
        </div>
      </div>
    </nav>
  )
}
