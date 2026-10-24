import { useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Input, Select } from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/Dialog'
import { DESAS, INITIAL_PROFILES } from '@/data/mockData'
import { ProfilDesa, StatusKelengkapan } from '@/types/index'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useToast } from '@/hooks/useToast'
import {
  AlertTriangle,
  Clock,
  Eye,
  FileCheck,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react'

type ProfilFormData = Pick<
  ProfilDesa,
  | 'kepalaDesa'
  | 'sekretarisDesa'
  | 'alamatKantor'
  | 'luasWilayah'
  | 'jumlahDusun'
  | 'jumlahRT'
  | 'jumlahRW'
  | 'jumlahPenduduk'
  | 'jumlahKK'
  | 'jarakKeKecamatan'
  | 'jarakKeKabupaten'
  | 'status'
>

const EMPTY_FORM: ProfilFormData = {
  kepalaDesa: '',
  sekretarisDesa: '',
  alamatKantor: '',
  luasWilayah: '',
  jumlahDusun: '',
  jumlahRT: '',
  jumlahRW: '',
  jumlahPenduduk: '',
  jumlahKK: '',
  jarakKeKecamatan: '',
  jarakKeKabupaten: '',
  status: 'Dalam Proses',
}

const FORM_FIELDS: {
  key: Exclude<keyof ProfilFormData, 'status'>
  label: string
  required?: boolean
}[] = [
  { key: 'kepalaDesa', label: 'Kepala Desa', required: true },
  { key: 'sekretarisDesa', label: 'Sekretaris Desa' },
  { key: 'alamatKantor', label: 'Alamat Kantor Desa', required: true },
  { key: 'luasWilayah', label: 'Luas Wilayah (km²)' },
  { key: 'jumlahDusun', label: 'Jumlah Dusun' },
  { key: 'jumlahRT', label: 'Jumlah RT' },
  { key: 'jumlahRW', label: 'Jumlah RW' },
  { key: 'jumlahPenduduk', label: 'Jumlah Penduduk' },
  { key: 'jumlahKK', label: 'Jumlah KK' },
  { key: 'jarakKeKecamatan', label: 'Jarak ke Ibukota Kecamatan (km)' },
  { key: 'jarakKeKabupaten', label: 'Jarak ke Ibukota Kabupaten (km)' },
]

const STATUS_OPTIONS: StatusKelengkapan[] = ['Lengkap', 'Dalam Proses', 'Belum Diisi']

const today = () => new Date().toISOString().split('T')[0]

export default function ProfilDesaPage() {
  const [profiles, setProfiles] = useLocalStorage<ProfilDesa[]>(
    'prototype-profil-desa',
    INITIAL_PROFILES
  )
  const { success, error, info } = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | StatusKelengkapan>('all')
  const [formMode, setFormMode] = useState<'add' | 'edit' | null>(null)
  const [formDesaId, setFormDesaId] = useState('')
  const [form, setForm] = useState<ProfilFormData>(EMPTY_FORM)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const getProfile = (desaId: string) => profiles.find((p) => p.desaId === desaId)

  const rows = useMemo(() => {
    return DESAS.map((desa) => ({ desa, profil: getProfile(desa.id) ?? null })).filter(
      ({ desa, profil }) => {
        const matchSearch = desa.nama.toLowerCase().includes(search.toLowerCase())
        const status = profil ? profil.status : 'Belum Diisi'
        const matchStatus = statusFilter === 'all' || status === statusFilter
        return matchSearch && matchStatus
      }
    )
  }, [profiles, search, statusFilter])

  const stat = {
    lengkap: DESAS.filter((d) => getProfile(d.id)?.status === 'Lengkap').length,
    dalamProses: DESAS.filter((d) => getProfile(d.id)?.status === 'Dalam Proses').length,
    belumDiisi: DESAS.filter((d) => !getProfile(d.id) || getProfile(d.id)?.status === 'Belum Diisi')
      .length,
  }

  const desaTanpaProfil = DESAS.filter((d) => !getProfile(d.id))

  const openAdd = () => {
    const kandidat = desaTanpaProfil[0]
    if (!kandidat) {
      info('Semua desa memiliki data profil', 'Untuk mengubah data, gunakan tombol Edit pada desa terkait.')
      return
    }
    setFormMode('add')
    setFormDesaId(kandidat.id)
    setForm(EMPTY_FORM)
  }

  const openEdit = (desaId: string) => {
    const profil = getProfile(desaId)
    if (!profil) return
    setFormMode('edit')
    setFormDesaId(desaId)
    setForm({
      kepalaDesa: profil.kepalaDesa,
      sekretarisDesa: profil.sekretarisDesa,
      alamatKantor: profil.alamatKantor,
      luasWilayah: profil.luasWilayah,
      jumlahDusun: profil.jumlahDusun,
      jumlahRT: profil.jumlahRT,
      jumlahRW: profil.jumlahRW,
      jumlahPenduduk: profil.jumlahPenduduk,
      jumlahKK: profil.jumlahKK,
      jarakKeKecamatan: profil.jarakKeKecamatan,
      jarakKeKabupaten: profil.jarakKeKabupaten,
      status: profil.status,
    })
  }

  const closeModal = () => setFormMode(null)

  const handleSave = () => {
    if (!formDesaId) {
      error('Desa belum dipilih', 'Silakan pilih desa terlebih dahulu.')
      return
    }
    if (!form.kepalaDesa.trim() || !form.alamatKantor.trim()) {
      error('Data belum lengkap', 'Kepala Desa dan Alamat Kantor Desa wajib diisi.')
      return
    }
    const duplikat: ProfilDesa = {
      desaId: formDesaId,
      ...form,
      updatedAt: today(),
    }
    setProfiles((prev) => [
      ...prev.filter((p) => p.desaId !== formDesaId),
      duplikat,
    ])
    const namaDesa = DESAS.find((d) => d.id === formDesaId)?.nama ?? ''
    success(
      formMode === 'add' ? 'Data profil desa berhasil ditambahkan' : `Profil ${namaDesa} berhasil diperbarui`,
      'Data demo tersimpan di perangkat Anda (localStorage), bukan di database.'
    )
    closeModal()
  }

  const handleDelete = () => {
    if (!deleteId) return
    const namaDesa = DESAS.find((d) => d.id === deleteId)?.nama ?? ''
    setProfiles((prev) => prev.filter((p) => p.desaId !== deleteId))
    success('Data profil dihapus', `Profil ${namaDesa} dihapus dari data demo (localStorage).`)
    setDeleteId(null)
  }

  const detailProfil = detailId ? getProfile(detailId) : null
  const detailDesa = DESAS.find((d) => d.id === detailId)
  const deleteTarget = DESAS.find((d) => d.id === deleteId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Profil Desa</h1>
          <p className="page-subtitle">
            Informasi profil dan identitas 13 desa dalam cakupan aplikasi (data demonstrasi).
          </p>
        </div>
        <Button onClick={openAdd} disabled={desaTanpaProfil.length === 0}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Data
        </Button>
      </div>

      {/* Ringkasan status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Desa" value={DESAS.length} icon={<Users className="w-5 h-5" />} color="bg-primary-500" />
        <StatCard title="Lengkap" value={stat.lengkap} icon={<FileCheck className="w-5 h-5" />} color="bg-success" />
        <StatCard title="Dalam Proses" value={stat.dalamProses} icon={<Clock className="w-5 h-5" />} color="bg-warning" />
        <StatCard title="Belum Diisi" value={stat.belumDiisi} icon={<AlertTriangle className="w-5 h-5" />} color="bg-danger" />
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Cari nama desa..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as 'all' | StatusKelengkapan)}
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

      {/* Tabel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Profil Desa</CardTitle>
            <div className="text-xs text-neutral-400">{rows.length} desa</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Desa</TableHead>
                  <TableHead>Kecamatan</TableHead>
                  <TableHead>Kepala Desa</TableHead>
                  <TableHead className="text-right">Penduduk (KK)</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Diperbarui</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                      Tidak ada desa yang cocok dengan pencarian dan filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map(({ desa, profil }) => (
                    <TableRow key={desa.id}>
                      <TableCell className="font-medium text-neutral-900">{desa.nama}</TableCell>
                      <TableCell className="text-sm text-neutral-600">{desa.kecamatan}</TableCell>
                      <TableCell className="text-sm text-neutral-800">{profil ? profil.kepalaDesa : '-'}</TableCell>
                      <TableCell className="text-right text-sm text-neutral-800">
                        {profil ? profil.jumlahKK : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={profil ? profil.status : 'Belum Diisi'} />
                      </TableCell>
                      <TableCell className="text-right text-sm text-neutral-600">
                        {profil ? profil.updatedAt : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {profil ? (
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="ghost" onClick={() => setDetailId(desa.id)} aria-label="Detail">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => openEdit(desa.id)} aria-label="Edit">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setDeleteId(desa.id)} aria-label="Hapus">
                              <Trash2 className="w-4 h-4 text-danger" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (desaTanpaProfil.length === 0) return
                              setFormMode('add')
                              setFormDesaId(desa.id)
                              setForm(EMPTY_FORM)
                            }}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Tambah
                          </Button>
                        )}
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
        Data di atas adalah <b>data demonstrasi (mock)</b>. Perubahan (tambah, edit, hapus) hanya tersimpan di
        localStorage perangkat ini untuk keperluan demo dan tidak tersimpan di database.
      </div>

      {/* Modal: form tambah / edit */}
      <Modal
        open={formMode !== null}
        onClose={closeModal}
        title={formMode === 'add' ? 'Tambah Data Profil Desa' : 'Edit Data Profil Desa'}
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
        <div className="space-y-4">
          {formMode === 'add' ? (
            <div>
              <label className="form-label">Desa</label>
              <Select value={formDesaId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormDesaId(e.target.value)}>
                {desaTanpaProfil.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nama} — {d.kecamatan}
                  </option>
                ))}
              </Select>
            </div>
          ) : (
            <div>
              <label className="form-label">Desa</label>
              <Input value={DESAS.find((d) => d.id === formDesaId)?.nama ?? ''} readOnly={true} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FORM_FIELDS.map(({ key, label, required }) => (
              <div key={key}>
                <label className="form-label">
                  {label}
                  {required ? <span className="text-danger"> *</span> : null}
                </label>
                <Input
                  value={form[key]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
                {required ? <p className="form-hint">Field ini wajib diisi.</p> : null}
              </div>
            ))}
            <div>
              <label className="form-label">Status Kelengkapan</label>
              <Select
                value={form.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setForm((prev) => ({ ...prev, status: e.target.value as StatusKelengkapan }))
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
          <p className="form-hint">
            Field bertanda *) wajib diisi. Field lainnya bersifat opsional dan harus divalidasi dengan client.
          </p>
        </div>
      </Modal>

      {/* Modal: detail */}
      <Modal
        open={detailId !== null}
        onClose={() => setDetailId(null)}
        title={`Detail Profil ${detailDesa?.nama ?? ''}`}
        description={`${detailDesa?.kecamatan ?? ''} • Diperbarui ${detailProfil?.updatedAt ?? '-'}`}
        footer={
          <Button onClick={() => setDetailId(null)}>Tutup</Button>
        }
      >
        {detailProfil ? (
          <dl className="divide-y divide-neutral-100">
            {FORM_FIELDS.map(({ key, label }) => (
              <div key={key} className="py-2.5 grid grid-cols-2 gap-4">
                <dt className="text-sm text-neutral-500">{label}</dt>
                <dd className="text-sm font-medium text-neutral-900">
                  {detailProfil[key] ? detailProfil[key] : <span className="text-neutral-400">Belum diisi</span>}
                </dd>
              </div>
            ))}
            <div className="py-2.5 grid grid-cols-2 gap-4">
              <dt className="text-sm text-neutral-500">Status Kelengkapan</dt>
              <dd className="text-sm">
                <StatusBadge status={detailProfil.status} />
              </dd>
            </div>
          </dl>
        ) : null}
      </Modal>

      {/* Dialog: konfirmasi hapus */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
        title={`Hapus profil ${deleteTarget?.nama ?? ''}?`}
        description="Data profil demo akan dihapus dari localStorage. Tindakan ini tidak dapat dibatalkan."
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
