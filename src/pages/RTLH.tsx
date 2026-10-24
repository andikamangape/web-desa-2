import { useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Input, Select } from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/Dialog'
import { DESAS } from '@/data/mockData'
import {
  INITIAL_RTLH,
  KATEGORI_KERUSAKAN,
  RTLH_FIELDS,
  RTLH_STORAGE_KEY,
  STATUS_VERIFIKASI,
} from '@/data/rtlhData'
import { RTLHRecord, StatusVerifikasi } from '@/types/index'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useToast } from '@/hooks/useToast'
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  Home,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'

const today = () => new Date().toISOString().split('T')[0]

const newId = () => 'rtlh-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)

interface FormState {
  desaId: string
  namaPenerima: string
  alamatRumah: string
  luasRumah: string
  jumlahPenghuni: string
  kategoriKerusakan: RTLHRecord['kategoriKerusakan']
  sumberDana: string
  tahun: string
  verifikasi: StatusVerifikasi
  catatan: string
}

function VerifikasiBadge({ status }: { status: string }) {
  const map: Record<string, 'success' | 'warning' | 'outline' | 'danger'> = {
    'Terverifikasi': 'success',
    'Menunggu Verifikasi': 'warning',
    'Belum Diajukan': 'outline',
    'Belum Diisi': 'danger',
  }
  const variant = map[status] ?? 'outline'
  return <Badge variant={variant}>{status}</Badge>
}

const emptyForm = (desaId: string): FormState => ({
  desaId,
  namaPenerima: '',
  alamatRumah: '',
  luasRumah: '',
  jumlahPenghuni: '',
  kategoriKerusakan: 'Berat',
  sumberDana: '',
  tahun: '2026',
  verifikasi: 'Belum Diajukan',
  catatan: '',
})

export default function RTLHPage() {
  const [records, setRecords] = useLocalStorage<RTLHRecord[]>(RTLH_STORAGE_KEY, INITIAL_RTLH)
  const { success, error } = useToast()
  const [search, setSearch] = useState('')
  const [verifikasiFilter, setVerifikasiFilter] = useState<'all' | StatusVerifikasi>('all')
  const [formMode, setFormMode] = useState<'add' | 'edit' | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const getDesaNama = (desaId: string) => DESAS.find((d) => d.id === desaId)?.nama ?? '-'
  const getRecord = (desaId: string) => records.find((r) => r.desaId === desaId) ?? null

  const desaTanpaData = DESAS.filter((d) => !records.some((r) => r.desaId === d.id))

  const rows = useMemo(() => {
    const q = search.toLowerCase()
    return DESAS.map((desa) => ({ desa, record: getRecord(desa.id) })).filter(({ desa, record }) => {
      const matchSearch =
        desa.nama.toLowerCase().includes(q) ||
        (record?.namaPenerima.toLowerCase().includes(q) ?? false) ||
        (record?.alamatRumah.toLowerCase().includes(q) ?? false)
      const rowStatus = record ? record.verifikasi : 'Belum Diisi'
      const matchFilter =
        verifikasiFilter === 'all'
          ? true
          : verifikasiFilter !== 'Belum Diajukan'
            ? rowStatus === verifikasiFilter
            : (record?.verifikasi ?? 'Belum Diajukan') === verifikasiFilter
      return matchSearch && matchFilter
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, search, verifikasiFilter])

  const stat = {
    total: records.length,
    terverifikasi: records.filter((r) => r.verifikasi === 'Terverifikasi').length,
    menunggu: records.filter((r) => r.verifikasi === 'Menunggu Verifikasi').length,
    belumDiajukan: records.filter((r) => r.verifikasi === 'Belum Diajukan').length,
  }

  const openAdd = (desaId?: string) => {
    const target = desaId ?? desaTanpaData[0]?.id
    if (!target) {
      error('Tidak ada desa tanpa data RTLH', 'Semua desa sudah memiliki data. Gunakan Edit untuk mengubah.')
      return
    }
    setFormMode('add')
    setEditingId(null)
    setForm(emptyForm(target))
  }

  const openEdit = (record: RTLHRecord) => {
    setFormMode('edit')
    setEditingId(record.id)
    setForm({
      desaId: record.desaId,
      namaPenerima: record.namaPenerima,
      alamatRumah: record.alamatRumah,
      luasRumah: record.luasRumah,
      jumlahPenghuni: record.jumlahPenghuni,
      kategoriKerusakan: record.kategoriKerusakan,
      sumberDana: record.sumberDana,
      tahun: record.tahun,
      verifikasi: record.verifikasi,
      catatan: record.catatan,
    })
  }

  const closeModal = () => {
    setFormMode(null)
    setEditingId(null)
    setForm(null)
  }

  const handleSave = () => {
    if (!form) return
    if (!form.namaPenerima.trim() || !form.alamatRumah.trim()) {
      error('Data belum lengkap', 'Nama Penerima dan Alamat Rumah wajib diisi.')
      return
    }
    if (formMode === 'add') {
      const duplikat: RTLHRecord = {
        id: newId(),
        desaId: form.desaId,
        namaPenerima: form.namaPenerima.trim(),
        alamatRumah: form.alamatRumah.trim(),
        luasRumah: form.luasRumah,
        jumlahPenghuni: form.jumlahPenghuni,
        kategoriKerusakan: form.kategoriKerusakan,
        sumberDana: form.sumberDana,
        tahun: form.tahun.trim() || '2026',
        verifikasi: form.verifikasi,
        updatedAt: today(),
        catatan: form.catatan,
      }
      setRecords((prev) => [duplikat, ...prev])
      success('Data RTLH berhasil ditambahkan', 'Data demo tersimpan di localStorage perangkat ini.')
    } else if (editingId) {
      setRecords((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, ...form, updatedAt: today() } : r))
      )
      success('Data RTLH berhasil diperbarui', 'Data demo tersimpan di localStorage perangkat ini.')
    }
    closeModal()
  }

  const tandaiTerverifikasi = (record: RTLHRecord) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === record.id
          ? { ...r, verifikasi: 'Terverifikasi', updatedAt: today() }
          : r
      )
    )
    success('Ditandai Terverifikasi', `${getDesaNama(record.desaId)} — verifikasi demo selesai.`)
  }

  const handleDelete = () => {
    if (!deleteId) return
    const target = records.find((r) => r.id === deleteId)
    setRecords((prev) => prev.filter((r) => r.id !== deleteId))
    success(
      'Data RTLH dihapus',
      target ? `Data ${target.namaPenerima} dihapus dari data demo (localStorage).` : undefined
    )
    setDeleteId(null)
  }

  const detailRecord = records.find((r) => r.id === detailId) ?? null
  const detailDesa = detailRecord ? DESAS.find((d) => d.id === detailRecord.desaId) : null
  const deleteTarget = records.find((r) => r.id === deleteId) ?? null
  const editDesaNama = form && formMode === 'edit' ? getDesaNama(form.desaId) : ''

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Rumah Tidak Layak Huni (RTLH)</h1>
          <p className="page-subtitle">
            Daftar penerima dan calon penerima bantuan perbaikan/persegsian rumah per desa (data demonstrasi).
          </p>
        </div>
        <Button onClick={() => openAdd()}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Data Rumah" value={stat.total} icon={<Home className="w-5 h-5" />} color="bg-primary-500" />
        <StatCard title="Terverifikasi" value={stat.terverifikasi} icon={<CheckCircle2 className="w-5 h-5" />} color="bg-success" />
        <StatCard title="Menunggu Verifikasi" value={stat.menunggu} icon={<ClipboardCheck className="w-5 h-5" />} color="bg-warning" />
        <StatCard title="Belum Diajukan" value={stat.belumDiajukan} icon={<AlertTriangle className="w-5 h-5" />} color="bg-danger" />
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Cari nama penerima, alamat, atau desa..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={verifikasiFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setVerifikasiFilter(e.target.value as 'all' | StatusVerifikasi)
              }
            >
              <option value="all">Semua Status Verifikasi</option>
              {STATUS_VERIFIKASI.map((s) => (
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
            <CardTitle>Daftar Calon/Penerima Bantuan Rumah</CardTitle>
            <div className="text-xs text-neutral-400">{rows.length} baris</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Desa</TableHead>
                  <TableHead>Nama Penerima</TableHead>
                  <TableHead>Kategori Kerusakan</TableHead>
                  <TableHead className="text-right">Luas Rumah (m²)</TableHead>
                  <TableHead className="text-center">Status Verifikasi</TableHead>
                  <TableHead className="text-right">Diperbarui</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                      Tidak ada data yang cocok dengan pencarian dan filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map(({ desa, record }) => (
                    <TableRow key={desa.id}>
                      <TableCell className="font-medium text-neutral-900">{desa.nama}</TableCell>
                      {record ? (
                        <>
                          <TableCell className="text-sm text-neutral-800">
                            {record.namaPenerima}
                            <span className="block text-xs text-neutral-400">{record.alamatRumah}</span>
                          </TableCell>
                          <TableCell className="text-sm text-neutral-800">{record.kategoriKerusakan}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{record.luasRumah}</TableCell>
                          <TableCell className="text-center">
                            <VerifikasiBadge status={record.verifikasi} />
                          </TableCell>
                          <TableCell className="text-right text-sm text-neutral-600">{record.updatedAt}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              {record.verifikasi !== 'Terverifikasi' ? (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => tandaiTerverifikasi(record)}
                                  aria-label="Tandai Terverifikasi"
                                  title="Tandai Terverifikasi"
                                >
                                  <ClipboardCheck className="w-4 h-4 text-success" />
                                </Button>
                              ) : null}
                              <Button size="sm" variant="ghost" onClick={() => setDetailId(record.id)} aria-label="Detail">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => openEdit(record)} aria-label="Edit">
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setDeleteId(record.id)} aria-label="Hapus">
                                <Trash2 className="w-4 h-4 text-danger" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell colSpan={4} className="text-sm text-neutral-400">
                            Belum ada data rumah untuk desa ini
                          </TableCell>
                          <TableCell className="text-center">
                            <StatusBadge status="Belum Diisi" />
                          </TableCell>
                          <TableCell className="text-sm text-neutral-600">-</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline" onClick={() => openAdd(desa.id)}>
                              <Plus className="w-4 h-4 mr-1" />
                              Tambah
                            </Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 text-sm text-neutral-500">
        Data di atas adalah <b>data demonstrasi (mock)</b>. Tindakan hanya tersimpan di localStorage perangkat ini.
        Template Excel RTLH resmi belum tersedia, sehingga struktur field masih awal dan harus di-validasi dengan
        client sebelum disamakan dengan formulir resmi.
      </div>

      {/* Modal: form */}
      <Modal
        open={formMode !== null && form !== null}
        onClose={closeModal}
        title={formMode === 'add' ? 'Tambah Data RTLH' : 'Edit Data RTLH'}
        description="Struktur form masih struktur awal dan akan disesuaikan dengan template resmi setelah dibersihkan dengan client."
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
                  {(desaTanpaData.length > 0 ? desaTanpaData : DESAS.filter((d) => d.id === form.desaId)).map((d) => (
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
              {RTLH_FIELDS.map(({ key, label, required }) => (
                <div
                  key={key}
                  className={key === 'alamatRumah' || key === 'catatan' ? 'md:col-span-2' : undefined}
                >
                  <label className="form-label">
                    {label}
                    {required ? <span className="text-danger"> *</span> : null}
                  </label>
                  {key === 'kategoriKerusakan' ? (
                    <Select
                      value={form.kategoriKerusakan}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setForm({
                          ...form,
                          kategoriKerusakan: e.target.value as RTLHRecord['kategoriKerusakan'],
                        })
                      }
                    >
                      {KATEGORI_KERUSAKAN.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Input
                      value={form[key]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                    />
                  )}
                </div>
              ))}
              <div>
                <label className="form-label">Tahun Bantuan</label>
                <Input
                  value={form.tahun}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, tahun: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label">Status Verifikasi</label>
                <Select
                  value={form.verifikasi}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setForm({ ...form, verifikasi: e.target.value as StatusVerifikasi })
                  }
                >
                  {STATUS_VERIFIKASI.map((s) => (
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

      {/* Modal: detail */}
      <Modal
        open={detailId !== null}
        onClose={() => setDetailId(null)}
        title={`Detail RTLH — ${detailDesa?.nama ?? ''}`}
        description={detailRecord ? `${detailRecord.namaPenerima} • ${detailRecord.alamatRumah}` : undefined}
        footer={<Button onClick={() => setDetailId(null)}>Tutup</Button>}
      >
        {detailRecord ? (
          <dl className="divide-y divide-neutral-100">
            {RTLH_FIELDS.map(({ key, label }) => (
              <div key={key} className="py-2.5 grid grid-cols-2 gap-4">
                <dt className="text-sm text-neutral-500">{label}</dt>
                <dd className="text-sm font-medium text-neutral-900">
                  {detailRecord[key] ? detailRecord[key] : <span className="text-neutral-400">Belum diisi</span>}
                </dd>
              </div>
            ))}
            <div className="py-2.5 grid grid-cols-2 gap-4">
              <dt className="text-sm text-neutral-500">Tahun Bantuan</dt>
              <dd className="text-sm font-medium text-neutral-900">{detailRecord.tahun}</dd>
            </div>
            <div className="py-2.5 grid grid-cols-2 gap-4">
              <dt className="text-sm text-neutral-500">Status Verifikasi</dt>
              <dd className="text-sm">
                <VerifikasiBadge status={detailRecord.verifikasi} />
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
        title="Hapus data RTLH ini?"
        description={
          deleteTarget
            ? `Data ${deleteTarget.namaPenerima} (${getDesaNama(deleteTarget.desaId)}) akan dihapus dari data demo localStorage.`
            : undefined
        }
        onConfirm={handleDelete}
      />
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
