import { useLocation } from 'react-router-dom'
import { Menu, Bell, User } from 'lucide-react'
import { toast } from 'sonner'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/data-desa': 'Data Desa',
  '/idm': 'IDM — Indeks Desa Membangun',
  '/pengajuan-dana-desa': 'Pengajuan Dana Desa (DD)',
  '/pengajuan-add': 'Pengajuan ADD',
  '/apbdes': 'APBDes',
  '/sk-aparat-desa': 'SK Aparat Desa',
  '/sk-bpd': 'SK BPD',
  '/profil-desa': 'Profil Desa',
  '/berita-acara-musrenbang': 'Berita Acara Musrenbang Desa',
  '/sk-kader-posyandu': 'SK Kader Posyandu Desa',
  '/rtlh': 'Rumah Tidak Layak Huni (RTLH)',
  '/bum-desa': 'BUM Desa & BUM Desa Bersama',
  '/dokumen': 'Dokumen',
  '/laporan': 'Laporan',
  '/pengaturan': 'Pengaturan',
}

function pageTitleFor(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname]
  if (pathname.startsWith('/data-desa/')) return 'Data Desa — Detail Desa'
  return 'Halaman tidak ditemukan'
}

export interface HeaderProps {
  onMenuToggle: () => void
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const location = useLocation()
  const title = pageTitleFor(location.pathname)

  return (
    <header className="sticky top-0 z-30 h-14 flex items-center justify-between border-b border-neutral-200 bg-white/80 backdrop-blur px-4 sm:px-6">
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 text-neutral-600 hover:text-neutral-900"
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex flex-col md:flex-row md:items-baseline gap-0.5 md:gap-3 min-w-0">
          <span className="text-sm font-medium text-neutral-900 truncate">{title}</span>
          <span className="hidden md:inline text-xs text-neutral-500">Dashboard Administrasi 13 Desa</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="p-2 text-neutral-600 hover:text-neutral-900"
          aria-label="Info notifikasi"
          onClick={() =>
            toast.info('Belum ada daftar notifikasi', {
              description:
                'Notifikasi real-time di luar lingkup prototype; rekap & aktivitas terlampir di Dashboard.',
            })
          }
        >
          <Bell className="w-5 h-5" />
          <span className="sr-only">Tombol notifikasi (demo)</span>
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
          <User className="w-5 h-5 text-neutral-500" />
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium text-neutral-900">Administrator</span>
            <span className="text-xs text-neutral-500">Prototype Demo</span>
          </div>
        </div>
      </div>
    </header>
  )
}
