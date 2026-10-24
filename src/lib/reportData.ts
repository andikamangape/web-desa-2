import { DESAS, MODUL_RINGKASAN, INITIAL_PROFILES, getDesaDetailModulStatus } from '@/data/mockData'
import {
  ADD_CONFIG,
  APBDES_CONFIG,
  BUM_BERSAMA_CONFIG,
  BUM_DESA_CONFIG,
  DANA_DESA_CONFIG,
  IDM_CONFIG,
  MUSRENBANG_CONFIG,
  SK_APARAT_CONFIG,
  SK_BPD_CONFIG,
  SK_POSYANDU_CONFIG,
} from '@/data/modulConfigs'
import { INITIAL_RTLH, RTLH_STORAGE_KEY } from '@/data/rtlhData'
import { ModulConfig, ModulRecord, ProfilDesa, RTLHRecord } from '@/types/index'

export const LAPORAN_MODUL: ModulConfig[] = [
  IDM_CONFIG,
  DANA_DESA_CONFIG,
  ADD_CONFIG,
  APBDES_CONFIG,
  SK_APARAT_CONFIG,
  SK_BPD_CONFIG,
  MUSRENBANG_CONFIG,
  SK_POSYANDU_CONFIG,
  BUM_DESA_CONFIG,
  BUM_BERSAMA_CONFIG,
]

export function readModulRecords(config: ModulConfig): ModulRecord[] {
  try {
    const stored = window.localStorage.getItem(config.storageKey)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed as ModulRecord[]
    }
  } catch {
    // abaikan: gunakan data awal
  }
  return config.initialData
}

export function readRtlhRecords(): RTLHRecord[] {
  try {
    const stored = window.localStorage.getItem(RTLH_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed as RTLHRecord[]
    }
  } catch {
    // abaikan: gunakan data awal
  }
  return INITIAL_RTLH
}

export function getDesaNama(desaId: string): string {
  return DESAS.find((d) => d.id === desaId)?.nama ?? '-'
}

export function modulCsv(config: ModulConfig, records: ModulRecord[]) {
  const headers = [
    'Nama Desa',
    config.judulLabel,
    ...config.fields.map((f) => f.label),
    'Tahun',
    'Status Kelengkapan',
    'Diperbarui',
    'Sumber Data',
  ]
  const rows = records.map((r) => [
    getDesaNama(r.desaId),
    r.judul,
    ...config.fields.map((f) => r.data[f.key] ?? ''),
    r.tahun,
    r.status,
    r.updatedAt,
    'Data demonstrasi (mock)',
  ])
  return { headers, rows, namaFile: `laporan-${config.code.toLocaleLowerCase('id')}.csv` }
}

export function rtlhCsv(records: RTLHRecord[]) {
  const headers = [
    'Nama Desa',
    'Nama Penerima',
    'Alamat Rumah',
    'Luas Rumah (m2)',
    'Jumlah Penghuni',
    'Kategori Kerusakan',
    'Sumber Dana',
    'Tahun',
    'Status Verifikasi',
    'Diperbarui',
    'Sumber Data',
  ]
  const rows = records.map((r) => [
    getDesaNama(r.desaId),
    r.namaPenerima,
    r.alamatRumah,
    r.luasRumah,
    r.jumlahPenghuni,
    r.kategoriKerusakan,
    r.sumberDana,
    r.tahun,
    r.verifikasi,
    r.updatedAt,
    'Data demonstrasi (mock)',
  ])
  return { headers, rows, namaFile: 'laporan-rtlh.csv' }
}

export const PROFIL_CSV_HEADERS = [
  'Nama Desa',
  'Kepala Desa',
  'Sekretaris Desa',
  'Alamat Kantor',
  'Luas Wilayah (Ha)',
  'Jumlah Dusun',
  'Jumlah RT',
  'Jumlah RW',
  'Jumlah Penduduk',
  'Jumlah KK',
  'Jarak ke Kecamatan (Km)',
  'Jarak ke Kabupaten (Km)',
  'Status Kelengkapan',
  'Diperbarui',
  'Sumber Data',
]

export function profilCsv(): { headers: string[]; rows: string[][]; namaFile: string } {
  const rows = INITIAL_PROFILES.map((p: ProfilDesa) => [
    getDesaNama(p.desaId),
    p.kepalaDesa,
    p.sekretarisDesa,
    p.alamatKantor,
    p.luasWilayah,
    p.jumlahDusun,
    p.jumlahRT,
    p.jumlahRW,
    p.jumlahPenduduk,
    p.jumlahKK,
    p.jarakKeKecamatan,
    p.jarakKeKabupaten,
    p.status,
    p.updatedAt,
    'Data demonstrasi (mock)',
  ])
  return { headers: PROFIL_CSV_HEADERS, rows, namaFile: 'laporan-profil-desa.csv' }
}

export function ringkasanCsv() {
  const headers = ['Modul', 'Total', 'Lengkap', 'Dalam Proses', 'Belum Diisi', 'Sumber Data']
  const rows = MODUL_RINGKASAN.map((m) => [
    m.nama,
    String(m.total),
    String(m.lengkap),
    String(m.dalamProses),
    String(m.belumDiisi),
    'Data demonstrasi (mock)',
  ])
  return { headers, rows, namaFile: 'laporan-rekap-modul.csv' }
}

export function rekapPerDesaCsv() {
  const headers = [
    'Nama Desa',
    'Kecamatan',
    'Status Kelengkapan',
    'Progres (%)',
    'Modul Lengkap',
    'Modul Dalam Proses',
    'Modul Belum Diisi',
    'Sumber Data',
  ]
  const rows = DESAS.map((d) => {
    const modul = getDesaDetailModulStatus(d.id)
    const no = (status: string) => modul.filter((m) => m.status === status).length
    return [
      d.nama,
      d.kecamatan,
      d.status,
      `${d.progres}%`,
      String(no('Lengkap')),
      String(no('Dalam Proses')),
      String(no('Belum Diisi')),
      'Data demonstrasi (mock)',
    ]
  })
  return { headers, rows, namaFile: 'laporan-rekap-per-desa.csv' }
}
