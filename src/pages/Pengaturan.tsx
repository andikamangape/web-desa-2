import { useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { ConfirmDialog } from '@/components/ui/Dialog'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useToast } from '@/hooks/useToast'
import { Info, RefreshCw, Save, Trash2 } from 'lucide-react'

const PENGATURAN_KEY = 'prototype-pengaturan'

interface AppSettings {
  namaAplikasi: string
  namaKecamatan: string
  tahunAktif: string
}

const DEFAULT_SETTINGS: AppSettings = {
  namaAplikasi: 'Dashboard Administrasi Desa',
  namaKecamatan: 'Kecamatan Lumbis Pansiangan (13 Desa)',
  tahunAktif: '2026',
}

export default function PengaturanPage() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(PENGATURAN_KEY, DEFAULT_SETTINGS)
  const [draft, setDraft] = useState<AppSettings>(settings)
  const { success, error } = useToast()
  const [resetOpen, setResetOpen] = useState(false)
  const [resetDone, setResetDone] = useState(false)

  const demoKeys = useMemo(() => {
    if (typeof window === 'undefined') return [] as string[]
    try {
      const keys: string[] = []
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i)
        if (k && k.startsWith('prototype-')) keys.push(k)
      }
      return keys
    } catch {
      return [] as string[]
    }
  }, [resetDone])

  const simpan = () => {
    if (!draft.namaAplikasi.trim()) {
      error('Nama aplikasi belum diisi', 'Input wajib diisi sebelum disimpan.')
      return
    }
    setSettings(draft)
    success('Pengaturan demo disimpan', 'Tersimpan di localStorage perangkat ini — tidak memengaruhi seluruh halaman pada tahap ini.')
  }

  const resetDemo = () => {
    try {
      const keys: string[] = []
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i)
        if (k && k.startsWith('prototype-')) keys.push(k)
      }
      keys.forEach((k) => window.localStorage.removeItem(k))
      setResetDone(true)
      setDraft(DEFAULT_SETTINGS)
      success('Data demo direset', `${keys.length} kunci data demo dibersihkan. Semua modul menampilkan data awal (mock).`)
    } catch {
      error('Reset gagal', 'Browser menolak akses localStorage.')
    }
    setResetOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Pengaturan</h1>
        <p className="page-subtitle">
          Profil aplikasi dan pengelolaan data demo. Tidak ada pengaturan akun — autentikasi di luar lingkup prototype.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profil Aplikasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="form-label">Nama Aplikasi</label>
                <Input
                  value={draft.namaAplikasi}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDraft({ ...draft, namaAplikasi: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label">Nama Kecamatan</label>
                <Input
                  value={draft.namaKecamatan}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDraft({ ...draft, namaKecamatan: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label">Tahun Anggaran Aktif</label>
                <Input
                  value={draft.tahunAktif}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDraft({ ...draft, tahunAktif: e.target.value })
                  }
                />
              </div>
              <Button onClick={simpan}>
                <Save className="w-4 h-4 mr-2" />
                Simpan Pengaturan
              </Button>
              <p className="text-xs text-neutral-500">
                Catatan: pada tahap prototype ini pengaturan hanya tersimpan di localStorage dan belum
                dipropagasi ke header atau halaman lain.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zona Reset Data Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600">
              Semua aksi demo (tambah, edit, hapus) tersimpan di localStorage dengan awalan{' '}
              <code className="text-xs">prototype-</code>. Reset akan mengembalikan semua modul ke data awal (mock).
            </p>
            <div className="mt-4 rounded-lg bg-neutral-50 border border-neutral-200 p-4">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                Kunci data demo terdeteksi: {demoKeys.length}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {demoKeys.length === 0 ? (
                  <span className="text-xs text-neutral-400">
                    Belum ada kunci demo (data belum dimodifikasi).
                  </span>
                ) : (
                  demoKeys.map((k) => (
                    <span key={k} className="text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                      {k}
                    </span>
                  ))
                )}
              </div>
            </div>
            <Button variant="destructive" className="mt-4" onClick={() => setResetOpen(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Reset Semua Data Demo
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Lingkup Prototype</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm text-neutral-600">
              <Info className="w-4 h-4 mt-0.5 text-primary-500" />
              <span>
                Aplikasi ini memakai data demonstrasi (mock) untuk 13 desa; tidak ada backend, database, atau
                autentikasi.
              </span>
            </div>
            <div className="flex items-start gap-3 text-sm text-neutral-600">
              <RefreshCw className="w-4 h-4 mt-0.5 text-warning" />
              <span>
                Template Excel/CSV resmi belum tersedia: struktur formulir masih struktur awal dan harus
                divalidasi dengan client sebelum disamakan.
              </span>
            </div>
            <div className="flex items-start gap-3 text-sm text-neutral-600">
              <Save className="w-4 h-4 mt-0.5 text-success" />
              <span>
                Halaman Laporan dapat mengunduh CSV dari data mock — dibangkitkan langsung di browser saat tombol diklik.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Reset semua data demo?"
        description="Semua perubahan pada modul (tambah, edit, hapus) akan dibuang dan kembali ke data awal (mock)."
        onConfirm={resetDemo}
      />
    </div>
  )
}
