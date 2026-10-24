import { useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Input, Select } from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/Dialog'
import { INITIAL_DOKUMEN, KATEGORI_DOKUMEN, DOKUMEN_STORAGE_KEY } from '@/data/dokumenData'
import { downloadText } from '@/lib/csv'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useToast } from '@/hooks/useToast'
import { DokumenItem } from '@/types/index'
import {
  Download,
  Eye,
  FileJson,
  FilePlus2,
  FileText,
  FileWarning,
  Search,
  Trash2,
  Upload,
} from 'lucide-react'

const formatIcon = (format: DokumenItem['format']) => {
  const cls = 'w-4 h-4 mr-2 inline'
  if (format === 'XLSX') return <FileJson className={cls} />
  if (format === 'DOCX') return <FileText className={cls} />
  return <FileJson className={cls} />
}

export default function DokumenPage() {
  const [dokumen, setDokumen] = useLocalStorage<DokumenItem[]>(DOKUMEN_STORAGE_KEY, INITIAL_DOKUMEN)
  const { success, error } = useToast()
  const [search, setSearch] = useState('')
  const [kategoriFilter, setKategoriFilter] = useState<'all' | string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | DokumenItem['status']>('all')
  const [detailId, setDetailId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const rows = useMemo(() => {
    const q = search.toLowerCase()
    return dokumen.filter((d) => {
      const matchSearch =
        d.nama.toLowerCase().includes(q) ||
        d.modulTerkait.toLowerCase().includes(q) ||
        d.kategori.toLowerCase().includes(q)
      const matchKategori = kategoriFilter === 'all' || d.kategori === kategoriFilter
      const matchStatus = statusFilter === 'all' || d.status === statusFilter
      return matchSearch && matchKategori && matchStatus
    })
  }, [dokumen, search, kategoriFilter, statusFilter])

  const stat = {
    total: dokumen.length,
    tersedia: dokumen.filter((d) => d.status === 'Tersedia').length,
    menunggu: dokumen.filter((d) => d.status === 'Menunggu Template').length,
  }

  const unduhDemo = (d: DokumenItem) => {
    downloadText(
      `DEMO-${d.nama.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}.txt`,
      [
        `DEMONSTRASI — ${d.nama}`,
        '',
        `Modul terkait  : ${d.modulTerkait}`,
        `Kategori       : ${d.kategori}`,
        `Format target  : ${d.format}`,
        '',
        'Isi file asli BELUM tersedia pada tahap prototype. File ini hanya',
        'menunjukkan bahwa tombol unduh berfungsi. Template resmi menunggu',
        'validasi dengan client.',
        '',
        'Sumber data : data demonstrasi (mock)',
      ].join('\r\n')
    )
    success('File demo diunduh', `${d.nama} — file .txt demonstrasi, bukan template resmi.`)
  }

  const tandaiTersedia = (d: DokumenItem) => {
    setDokumen((prev) =>
      prev.map((item) =>
        item.id === d.id
          ? { ...item, status: 'Tersedia', ukuran: 'file demo', diperbarui: new Date().toISOString().split('T')[0] }
          : item
      )
    )
    success('Ditandai Tersedia', `${d.nama} — status demo diperbarui (localStorage).`)
  }

  const handleDelete = () => {
    if (!deleteId) return
    const target = dokumen.find((d) => d.id === deleteId)
    setDokumen((prev) => prev.filter((d) => d.id !== deleteId))
    success('Dokumen demo dihapus', target ? `${target.nama} dihapus dari data demo (localStorage).` : undefined)
    setDeleteId(null)
  }

  const detail = dokumen.find((d) => d.id === detailId) ?? null
  const deleteTarget = dokumen.find((d) => d.id === deleteId) ?? null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Dokumen</h1>
          <p className="page-subtitle">
            Katalog dokumen dan template yang terkait modul (data demonstrasi).
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            error(
              'Upload belum tersedia',
              'Upload file sungguhan di luar lingkup prototype saat ini — menunggu keputusan client.'
            )
          }
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Dokumen
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Dokumen" value={stat.total} icon={<FileText className="w-5 h-5" />} color="bg-primary-500" />
        <StatCard title="Tersedia" value={stat.tersedia} icon={<FilePlus2 className="w-5 h-5" />} color="bg-success" />
        <StatCard title="Menunggu Template" value={stat.menunggu} icon={<FileWarning className="w-5 h-5" />} color="bg-warning" />
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Cari nama dokumen atau modul terkait..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={kategoriFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setKategoriFilter(e.target.value)}
              >
                <option value="all">Semua Kategori</option>
                {KATEGORI_DOKUMEN.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </Select>
              <Select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setStatusFilter(e.target.value as 'all' | DokumenItem['status'])
                }
              >
                <option value="all">Semua Status</option>
                <option value="Tersedia">Tersedia</option>
                <option value="Menunggu Template">Menunggu Template</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Dokumen</CardTitle>
            <div className="text-xs text-neutral-400">{rows.length} dokumen</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Dokumen</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Modul Terkait</TableHead>
                  <TableHead className="text-center">Format</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Diperbarui</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                      Tidak ada dokumen yang cocok dengan pencarian dan filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium text-neutral-900">
                        {formatIcon(d.format)}
                        {d.nama}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-800">{d.kategori}</TableCell>
                      <TableCell className="text-sm text-neutral-800">{d.modulTerkait}</TableCell>
                      <TableCell className="text-center text-sm text-neutral-800">{d.format}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={d.status === 'Tersedia' ? 'success' : 'warning'}>{d.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-neutral-600">{d.diperbarui}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => setDetailId(d.id)} aria-label="Detail">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {d.status === 'Tersedia' ? (
                            <Button size="sm" variant="ghost" onClick={() => unduhDemo(d)} aria-label="Unduh file demo">
                              <Download className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => tandaiTersedia(d)}
                              aria-label="Tandai Tersedia (demo)"
                              title="Tandai Tersedia (demo)"
                            >
                              <FilePlus2 className="w-4 h-4 text-success" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => setDeleteId(d.id)} aria-label="Hapus">
                            <Trash2 className="w-4 h-4 text-danger" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 text-sm text-neutral-500">
        Catatan demo: tombol <b>Upload</b> sengaja dinonaktifkan dengan penjelasan (di luar lingkup prototype).
        Tombol <b>Unduh</b> benar-benar berfungsi namun mengunduh file .txt berketerangan demo, bukan template
        resmi — template asli menunggu validasi dengan client. Semua perubahan tersimpan di localStorage.
      </div>

      <Modal
        open={detailId !== null}
        onClose={() => setDetailId(null)}
        title={`Detail Dokumen — ${detail?.nama ?? ''}`}
        description={detail ? `${detail.kategori} • ${detail.format}` : undefined}
        footer={<Button onClick={() => setDetailId(null)}>Tutup</Button>}
      >
        {detail ? (
          <dl className="divide-y divide-neutral-100">
            <RowDetail label="Nama Dokumen" value={detail.nama} />
            <RowDetail label="Kategori" value={detail.kategori} />
            <RowDetail label="Modul Terkait" value={detail.modulTerkait} />
            <RowDetail label="Format Target" value={detail.format} />
            <RowDetail label="Ukuran" value={detail.ukuran} />
            <RowDetail label="Diperbarui" value={detail.diperbarui} />
            <div className="py-2.5 grid grid-cols-2 gap-4">
              <dt className="text-sm text-neutral-500">Status</dt>
              <dd className="text-sm">
                <Badge variant={detail.status === 'Tersedia' ? 'success' : 'warning'}>{detail.status}</Badge>
              </dd>
            </div>
          </dl>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
        title="Hapus dokumen demo ini?"
        description={
          deleteTarget
            ? `${deleteTarget.nama} akan dihapus dari data demo localStorage. Tindakan ini tidak dapat dibatalkan.`
            : undefined
        }
        onConfirm={handleDelete}
      />
    </div>
  )
}

function RowDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-2.5 grid grid-cols-2 gap-4">
      <dt className="text-sm text-neutral-500">{label}</dt>
      <dd className="text-sm font-medium text-neutral-900">{value || <span className="text-neutral-400">-</span>}</dd>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: number
  icon: React.ReactNode
  color: string
}) {
  return (
    <Card>
      <CardContent className="pt-6 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{title}</p>
            <div className="text-2xl font-bold text-neutral-900 mt-1">{value}</div>
          </div>
          <div className={`p-3 rounded-lg ${color} text-white`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
