import { useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Input, Select } from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/Dialog'
import { DESAS } from '@/data/mockData'
import type { ModulConfig, ModulRecord, StatusKelengkapan } from '@/types/index'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useToast } from '@/hooks/useToast'
import {
  AlertTriangle,
  Clock,
  Eye,
  FileCheck,
  Paperclip,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'

const STATUS_OPTIONS: StatusKelengkapan[] = ['Lengkap', 'Dalam Proses', 'Belum Diisi']

const today = () => new Date().toISOString().split('T')[0]

const newId = () => 'rec-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)

interface FormState {
  desaId: string
  judul: string
  tahun: string
  status: StatusKelengkapan
  data: Record<string, string>
}

interface ContentProps {
  config: ModulConfig
}

export default function ModulCrudPage({ config }: { config: ModulConfig }) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">{config.nama}</h1>
          <p className="page-subtitle">{config.description}</p>
        </div>
      </div>
      <ModulContent config={config} />
    </>
  )
}

export function ModulContent({ config }: ContentProps) {
  const [records, setRecords] = useLocalStorage<ModulRecord[]>(config.storageKey, config.initialData)
  const { success, error } = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | StatusKelengkapan>('all')
  const [formMode, setFormMode] = useState<'add' | 'edit' | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const getDesaNama = (desaId: string) => DESAS.find((d) => d.id === desaId)?.nama ?? '-'

  const rows = useMemo(() => {
    const q = search.toLowerCase()
    return records.filter((r) => {
      const matchSearch =
        r.judul.toLowerCase().includes(q) || getDesaNama(r.desaId).toLowerCase().includes(q)
      const matchStatus = statusFilter === 'all' || r.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [records, search, statusFilter])

  const stat = {
    total: records.length,
    lengkap: records.filter((r) => r.status === 'Lengkap').length,
    dalamProses: records.filter((r) => r.status === 'Dalam Proses').length,
    belumDiisi: records.filter((r) => r.status === 'Belum Diisi').length,
  }

  const openAdd = () => {
    setFormMode('add')
    setEditingId(null)
    setForm({
      desaId: DESAS[0]?.id ?? '',
      judul: '',
      tahun: '2026',
      status: 'Dalam Proses',
      data: Object.fromEntries(config.fields.map((f) => [f.key, ''])),
    })
  }

  const openEdit = (record: ModulRecord) => {
    setFormMode('edit')
    setEditingId(record.id)
    setForm({
      desaId: record.desaId,
      judul: record.judul,
      tahun: record.tahun,
      status: record.status,
      data: { ...record.data },
    })
  }

  const closeModal = () => {
    setFormMode(null)
    setEditingId(null)
    setForm(null)
  }

  const handleSave = () => {
    if (!form) return
    if (!form.desaId) {
      error('Desa belum dipilih', 'Silakan pilih desa terlebih dahulu.')
      return
    }
    if (!form.judul.trim()) {
      error(`${config.judulLabel} belum diisi`, 'Input wajib diisi sebelum data disimpan.')
      return
    }
    const fieldRequired = config.fields.find((f) => f.required && !form.data[f.key]?.trim())
    if (fieldRequired) {
      error('Data belum lengkap', `${fieldRequired.label} wajib diisi.`)
      return
    }
    if (formMode === 'add') {
      const duplikat: ModulRecord = {
        id: newId(),
        desaId: form.desaId,
        judul: form.judul.trim(),
        tahun: form.tahun.trim() || '2026',
        status: form.status,
        updatedAt: today(),
        data: form.data,
      }
      setRecords((prev) => [duplikat, ...prev])
      success('Data berhasil ditambahkan', 'Data demo tersimpan di localStorage perangkat ini.')
    } else if (editingId) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                desaId: form.desaId,
                judul: form.judul.trim(),
                tahun: form.tahun.trim() || '2026',
                status: form.status,
                updatedAt: today(),
                data: form.data,
              }
            : r
        )
      )
      success('Data berhasil diperbarui', 'Data demo tersimpan di localStorage perangkat ini.')
    }
    closeModal()
  }

  const handleDelete = () => {
    if (!deleteId) return
    const target = records.find((r) => r.id === deleteId)
    setRecords((prev) => prev.filter((r) => r.id !== deleteId))
    success(
      'Data berhasil dihapus',
      target ? `${getDesaNama(target.desaId)} — dihapus dari data demo (localStorage).` : undefined
    )
    setDeleteId(null)
  }

  const detailRecord = records.find((r) => r.id === detailId) ?? null
  const deleteTarget = records.find((r) => r.id === deleteId) ?? null
  const editDesaNama = form && formMode === 'edit' ? getDesaNama(form.desaId) : ''

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Data" value={stat.total} icon={<Paperclip className="w-5 h-5" />} color="bg-primary-500" />
        <StatCard title="Lengkap" value={stat.lengkap} icon={<FileCheck className="w-5 h-5" />} color="bg-success" />
        <StatCard title="Dalam Proses" value={stat.dalamProses} icon={<Clock className="w-5 h-5" />} color="bg-warning" />
        <StatCard title="Belum Diisi" value={stat.belumDiisi} icon={<AlertTriangle className="w-5 h-5" />} color="bg-danger" />
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Cari judul atau nama desa..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setStatusFilter(e.target.value as 'all' | StatusKelengkapan)
              }
            >
              <option value="all">Semua Status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar {config.nama}</CardTitle>
            <div className="text-xs text-neutral-400">{rows.length} data</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Desa</TableHead>
                  <TableHead>{config.judulLabel}</TableHead>
                  {config.columns.map((c) => (
                    <TableHead
                      key={c.key}
                      className={
                        c.align === 'right'
                          ? 'text-right'
                          : c.align === 'center'
                            ? 'text-center'
                            : undefined
                      }
                    >
                      {c.label}
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Tahun</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Diperbarui</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6 + config.columns.length} className="text-center py-8 text-neutral-500">
                      Belum ada data. Klik "Tambah Data" untuk membuat data demo pertama.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium text-neutral-900">{getDesaNama(r.desaId)}</TableCell>
                      <TableCell className="text-sm text-neutral-800">
                        {r.judul || <span className="text-neutral-400">—</span>}
                      </TableCell>
                      {config.columns.map((c) => (
                        <TableCell
                          key={c.key}
                          className={
                            c.align === 'right'
                              ? `text-right text-sm ${c.mono ? 'font-mono' : ''} text-neutral-800`
                              : c.align === 'center'
                                ? 'text-center text-sm text-neutral-800'
                                : 'text-sm text-neutral-800'
                          }
                        >
                          {r.data[c.key] || <span className="text-neutral-400">—</span>}
                        </TableCell>
                      ))}
                      <TableCell className="text-center text-sm text-neutral-800">{r.tahun}</TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={r.status} />
                      </TableCell>
                      <TableCell className="text-right text-sm text-neutral-600">{r.updatedAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => setDetailId(r.id)} aria-label="Detail">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => openEdit(r)} aria-label="Edit">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setDeleteId(r.id)} aria-label="Hapus">
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
        Data di atas adalah <b>data demonstrasi (mock)</b>. Tindakan (tambah, edit, hapus) hanya tersimpan di
        localStorage perangkat ini untuk keperluan demo dan tidak tersimpan di database. Struktur field masih
        awal dan akan disesuaikan dengan formulir resmi setelah divalidasi dengan client.
      </div>

      <Modal
        open={formMode !== null && form !== null}
        onClose={closeModal}
        title={formMode === 'add' ? `Tambah Data — ${config.nama}` : `Edit Data — ${config.nama}`}
        description="Struktur form masih struktur awal dan akan disesuaikan dengan formulir resmi setelah divalidasi dengan client."
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button onClick={handleSave}>Simpan</Button>
          </>
        }
      >
        {form ? (
          <div className="space-y-4">
            {formMode === 'add' ? (
              <div>
                <label className="form-label">Desa</label>
                <Select
                  value={form.desaId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setForm({ ...form, desaId: e.target.value })
                  }
                >
                  {DESAS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nama} — {d.kecamatan}
                    </option>
                  ))}
                </Select>
              </div>
            ) : (
              <div>
                <label className="form-label">Desa</label>
                <Input value={editDesaNama} readOnly={true} />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="form-label">
                  {config.judulLabel}
                  <span className="text-danger"> *</span>
                </label>
                <Input
                  value={form.judul}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, judul: e.target.value })
                  }
                />
              </div>
              {config.fields.map(({ key, label, required }) => (
                <div key={key}>
                  <label className="form-label">
                    {label}
                    {required ? <span className="text-danger"> *</span> : null}
                  </label>
                  <Input
                    value={form.data[key] ?? ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setForm({
                        ...form,
                        data: { ...form.data, [key]: e.target.value },
                      })
                    }
                  />
                </div>
              ))}
              <div>
                <label className="form-label">Tahun</label>
                <Input
                  value={form.tahun}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, tahun: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label">Status Kelengkapan</label>
                <Select
                  value={form.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setForm({ ...form, status: e.target.value as StatusKelengkapan })
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={detailId !== null}
        onClose={() => setDetailId(null)}
        title={`Detail Data — ${detailRecord ? getDesaNama(detailRecord.desaId) : ''}`}
        description={detailRecord ? `${detailRecord.judul} • Tahun ${detailRecord.tahun}` : undefined}
        footer={<Button onClick={() => setDetailId(null)}>Tutup</Button>}
      >
        {detailRecord ? (
          <dl className="divide-y divide-neutral-100">
            <div className="py-2.5 grid grid-cols-2 gap-4">
              <dt className="text-sm text-neutral-500">Nama Desa</dt>
              <dd className="text-sm font-medium text-neutral-900">{getDesaNama(detailRecord.desaId)}</dd>
            </div>
            <div className="py-2.5 grid grid-cols-2 gap-4">
              <dt className="text-sm text-neutral-500">{config.judulLabel}</dt>
              <dd className="text-sm font-medium text-neutral-900">{detailRecord.judul || '—'}</dd>
            </div>
            {config.fields.map(({ key, label }) => (
              <div key={key} className="py-2.5 grid grid-cols-2 gap-4">
                <dt className="text-sm text-neutral-500">{label}</dt>
                <dd className="text-sm font-medium text-neutral-900">
                  {detailRecord.data[key] ? detailRecord.data[key] : (
                    <span className="text-neutral-400">Belum diisi</span>
                  )}
                </dd>
              </div>
            ))}
            <div className="py-2.5 grid grid-cols-2 gap-4">
              <dt className="text-sm text-neutral-500">Tahun</dt>
              <dd className="text-sm font-medium text-neutral-900">{detailRecord.tahun}</dd>
            </div>
            <div className="py-2.5 grid grid-cols-2 gap-4">
              <dt className="text-sm text-neutral-500">Status Kelengkapan</dt>
              <dd className="text-sm">
                <StatusBadge status={detailRecord.status} />
              </dd>
            </div>
            <div className="py-2.5 grid grid-cols-2 gap-4">
              <dt className="text-sm text-neutral-500">Diperbarui</dt>
              <dd className="text-sm font-medium text-neutral-900">{detailRecord.updatedAt}</dd>
            </div>
          </dl>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
        title="Hapus data ini?"
        description={
          deleteTarget
            ? `${deleteTarget.judul} (${getDesaNama(deleteTarget.desaId)}) akan dihapus dari data demo localStorage. Tindakan ini tidak dapat dibatalkan.`
            : undefined
        }
        onConfirm={handleDelete}
      />
    </>
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
