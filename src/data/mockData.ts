import { Desa, ModulRingkasan, Aktivitas, ProfilDesa } from '@/types/index'

const now = new Date()
const formatDate = (offsetDays: number) => {
  const d = new Date(now)
  d.setDate(d.getDate() - offsetDays)
  return d.toISOString().split('T')[0]
}

export const DESAS: Desa[] = [
  {
    id: 'desa-001',
    nama: 'Desa Sumentobol',
    kecamatan: 'Lumbis Pansiangan',
    status: 'Lengkap',
    progres: 100,
    updatedAt: formatDate(1),
  },
  {
    id: 'desa-002',
    nama: 'Desa Nantukidan',
    kecamatan: 'Lumbis Pansiangan',
    status: 'Lengkap',
    progres: 95,
    updatedAt: formatDate(2),
  },
  {
    id: 'desa-003',
    nama: 'Desa Labang',
    kecamatan: 'Lumbis Pansiangan',
    status: 'Dalam Proses',
    progres: 75,
    updatedAt: formatDate(3),
  },
  {
    id: 'desa-004',
    nama: 'Desa Sumantipal',
    kecamatan: 'Lumbis Pansiangan',
    status: 'Dalam Proses',
    progres: 60,
    updatedAt: formatDate(4),
  },
  {
    id: 'desa-005',
    nama: 'Desa Ngawol',
    kecamatan: 'Lumbis Pansiangan',
    status: 'Dalam Proses',
    progres: 55,
    updatedAt: formatDate(5),
  },
  {
    id: 'desa-006',
    nama: 'Desa Lagas',
    kecamatan: 'Lumbis Pansiangan',
    status: 'Belum Diisi',
    progres: 30,
    updatedAt: formatDate(6),
  },
  {
    id: 'desa-007',
    nama: 'Desa Bululaun Hilir',
    kecamatan: 'Lumbis Pansiangan',
    status: 'Belum Diisi',
    progres: 20,
    updatedAt: formatDate(7),
  },
  {
    id: 'desa-008',
    nama: 'Desa Panas',
    kecamatan: 'Lumbis Pansiangan',
    status: 'Dalam Proses',
    progres: 80,
    updatedAt: formatDate(2),
  },
  {
    id: 'desa-009',
    nama: 'Desa Tambalang Hulu',
    kecamatan: 'Lumbis Pansiangan',
    status: 'Lengkap',
    progres: 90,
    updatedAt: formatDate(1),
  },
  {
    id: 'desa-010',
    nama: 'Desa Kuyo',
    kecamatan: 'Lumbis Pansiangan',
    status: 'Belum Diisi',
    progres: 10,
    updatedAt: formatDate(14),
  },
  {
    id: 'desa-011',
    nama: 'Desa Bokok',
    kecamatan: 'Lumbis Pansiangan',
    status: 'Dalam Proses',
    progres: 65,
    updatedAt: formatDate(3),
  },
  {
    id: 'desa-012',
    nama: 'Desa Tantalujuk',
    kecamatan: 'Lumbis Pansiangan',
    status: 'Lengkap',
    progres: 88,
    updatedAt: formatDate(5),
  },
  {
    id: 'desa-013',
    nama: 'Desa Langgason',
    kecamatan: 'Lumbis Pansiangan',
    status: 'Dalam Proses',
    progres: 70,
    updatedAt: formatDate(4),
  },
]

export const MODUL_RINGKASAN: ModulRingkasan[] = [
  { id: 'mod-01', nama: 'IDM', total: 13, lengkap: 4, dalamProses: 6, belumDiisi: 3, status: 'Dalam Proses' },
  { id: 'mod-02', nama: 'Pengajuan Dana Desa (DD)', total: 13, lengkap: 3, dalamProses: 5, belumDiisi: 5, status: 'Dalam Proses' },
  { id: 'mod-03', nama: 'Pengajuan ADD', total: 13, lengkap: 2, dalamProses: 4, belumDiisi: 7, status: 'Belum Diisi' },
  { id: 'mod-04', nama: 'APBDes', total: 13, lengkap: 5, dalamProses: 4, belumDiisi: 4, status: 'Dalam Proses' },
  { id: 'mod-05', nama: 'SK Aparat Desa', total: 13, lengkap: 4, dalamProses: 5, belumDiisi: 4, status: 'Dalam Proses' },
  { id: 'mod-06', nama: 'SK BPD', total: 13, lengkap: 3, dalamProses: 6, belumDiisi: 4, status: 'Dalam Proses' },
  { id: 'mod-07', nama: 'Profil Desa', total: 13, lengkap: 6, dalamProses: 4, belumDiisi: 3, status: 'Dalam Proses' },
  { id: 'mod-08', nama: 'Berita Acara Musrenbang Desa', total: 13, lengkap: 2, dalamProses: 5, belumDiisi: 6, status: 'Belum Diisi' },
  { id: 'mod-09', nama: 'SK Kader Posyandu Desa', total: 13, lengkap: 3, dalamProses: 4, belumDiisi: 6, status: 'Belum Diisi' },
  { id: 'mod-10', nama: 'RTLH', total: 13, lengkap: 4, dalamProses: 5, belumDiisi: 4, status: 'Dalam Proses' },
  { id: 'mod-11', nama: 'BUM Desa & BUM Desa Bersama', total: 13, lengkap: 1, dalamProses: 3, belumDiisi: 9, status: 'Belum Diisi' },
]

export const AKTIVITAS: Aktivitas[] = [
  { id: 'act-01', desa: 'Desa Sumentobol', modul: 'Profil Desa', aksi: 'Data diperbarui', waktu: '2 jam lalu' },
  { id: 'act-02', desa: 'Desa Nantukidan', modul: 'IDM', aksi: 'Verifikasi selesai', waktu: '5 jam lalu' },
  { id: 'act-03', desa: 'Desa Labang', modul: 'APBDes', aksi: 'Draft disimpan', waktu: '1 hari lalu' },
  { id: 'act-04', desa: 'Desa Tantalujuk', modul: 'RTLH', aksi: 'Diajukan verifikasi', waktu: '1 hari lalu' },
  { id: 'act-05', desa: 'Desa Panas', modul: 'SK Aparat Desa', aksi: 'Data diperbarui', waktu: '2 hari lalu' },
  { id: 'act-06', desa: 'Desa Tambalang Hulu', modul: 'Pengajuan Dana Desa (DD)', aksi: 'Diajuinkan', waktu: '3 hari lalu' },
  { id: 'act-07', desa: 'Desa Lagas', modul: 'Profil Desa', aksi: 'Dibuat', waktu: '4 hari lalu' },
]

export const MODULES_FOR_DETAIL = [
  { id: 'mod-01', nama: 'IDM', status: 'Lengkap' as const },
  { id: 'mod-02', nama: 'Pengajuan Dana Desa (DD)', status: 'Dalam Proses' as const },
  { id: 'mod-03', nama: 'Pengajuan ADD', status: 'Belum Diisi' as const },
  { id: 'mod-04', nama: 'APBDes', status: 'Lengkap' as const },
  { id: 'mod-05', nama: 'SK Aparat Desa', status: 'Dalam Proses' as const },
  { id: 'mod-06', nama: 'SK BPD', status: 'Belum Diisi' as const },
  { id: 'mod-07', nama: 'Profil Desa', status: 'Lengkap' as const },
  { id: 'mod-08', nama: 'Berita Acara Musrenbang Desa', status: 'Belum Diisi' as const },
  { id: 'mod-09', nama: 'SK Kader Posyandu Desa', status: 'Dalam Proses' as const },
  { id: 'mod-10', nama: 'RTLH', status: 'Belum Diisi' as const },
  { id: 'mod-11', nama: 'BUM Desa & BUM Desa Bersama', status: 'Belum Diisi' as const },
]

export function getDesaDetailModulStatus(desaId: string) {
  const index = DESAS.findIndex((d) => d.id === desaId)
  if (index === -1) return []
  const base = MODULES_FOR_DETAIL
  return base.map((m, i) => ({
    ...m,
    progres: Math.min(100, Math.max(0, ((index + i) % 4) * 25 + (index % 3) * 10)),
  }))
}

// Data profil desa awal (demonstrasi). Struktur field masih struktur awal
// dan harus divalidasi dengan client sebelum disamakan dengan formulir resmi.
export const INITIAL_PROFILES: ProfilDesa[] = [
  {
    desaId: 'desa-001',
    kepalaDesa: 'Ahmad Saputra',
    sekretarisDesa: 'Rudi Hartono',
    alamatKantor: 'Jl. Raya Desa Demo No. 1',
    luasWilayah: '450',
    jumlahDusun: '4',
    jumlahRT: '18',
    jumlahRW: '5',
    jumlahPenduduk: '3250',
    jumlahKK: '980',
    jarakKeKecamatan: '5',
    jarakKeKabupaten: '25',
    status: 'Lengkap',
    updatedAt: formatDate(1),
  },
  {
    desaId: 'desa-002',
    kepalaDesa: 'Bambang Wijaya',
    sekretarisDesa: 'Siti Rohmah',
    alamatKantor: 'Jl. Merdeka Desa No. 8',
    luasWilayah: '320',
    jumlahDusun: '3',
    jumlahRT: '14',
    jumlahRW: '4',
    jumlahPenduduk: '2100',
    jumlahKK: '640',
    jarakKeKecamatan: '8',
    jarakKeKabupaten: '30',
    status: 'Lengkap',
    updatedAt: formatDate(2),
  },
  {
    desaId: 'desa-003',
    kepalaDesa: 'Dedi Kurniawan',
    sekretarisDesa: '',
    alamatKantor: 'Jl. Desa Demo Indah No. 3',
    luasWilayah: '510',
    jumlahDusun: '5',
    jumlahRT: '20',
    jumlahRW: '6',
    jumlahPenduduk: '',
    jumlahKK: '',
    jarakKeKecamatan: '12',
    jarakKeKabupaten: '',
    status: 'Dalam Proses',
    updatedAt: formatDate(3),
  },
  {
    desaId: 'desa-008',
    kepalaDesa: 'Eko Prasetyo',
    sekretarisDesa: 'Wiwi Widianti',
    alamatKantor: 'Jl. Bougenville No. 12',
    luasWilayah: '280',
    jumlahDusun: '3',
    jumlahRT: '12',
    jumlahRW: '3',
    jumlahPenduduk: '1850',
    jumlahKK: '520',
    jarakKeKecamatan: '6',
    jarakKeKabupaten: '18',
    status: 'Lengkap',
    updatedAt: formatDate(2),
  },
  {
    desaId: 'desa-011',
    kepalaDesa: 'Fajar Nugroho',
    sekretarisDesa: '',
    alamatKantor: '',
    luasWilayah: '390',
    jumlahDusun: '4',
    jumlahRT: '',
    jumlahRW: '',
    jumlahPenduduk: '2760',
    jumlahKK: '',
    jarakKeKecamatan: '',
    jarakKeKabupaten: '22',
    status: 'Dalam Proses',
    updatedAt: formatDate(3),
  },
  {
    desaId: 'desa-012',
    kepalaDesa: 'Gunawan Saputra',
    sekretarisDesa: 'Lestari Ningsih',
    alamatKantor: 'Jl. Raya Barat No. 45',
    luasWilayah: '620',
    jumlahDusun: '6',
    jumlahRT: '24',
    jumlahRW: '7',
    jumlahPenduduk: '4100',
    jumlahKK: '1150',
    jarakKeKecamatan: '9',
    jarakKeKabupaten: '35',
    status: 'Lengkap',
    updatedAt: formatDate(5),
  },
]
