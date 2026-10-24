import { DESAS, MODUL_RINGKASAN } from './mockData'
import { RTLHRecord, StatusVerifikasi } from '@/types/index'

const date = (offset: number) => {
  const d = new Date()
  d.setDate(d.getDate() - offset)
  return d.toISOString().split('T')[0]
}

const FIELD_KEYS = [
  'namaPenerima',
  'alamatRumah',
  'luasRumah',
  'jumlahPenghuni',
  'kategoriKerusakan',
  'sumberDana',
  'tahun',
  'verifikasi',
  'catatan',
] as const

export const RTLH_STORAGE_KEY = 'prototype-modul-rtlh'

export const KATEGORI_KERUSAKAN: RTLHRecord['kategoriKerusakan'][] = ['Berat', 'Sedang', 'Ringan']

export const STATUS_VERIFIKASI: StatusVerifikasi[] = [
  'Terverifikasi',
  'Menunggu Verifikasi',
  'Belum Diajukan',
]

export const RTLH_FIELDS: {
  key: Exclude<(typeof FIELD_KEYS)[number], 'verifikasi' | 'tahun'>
  label: string
  required?: boolean
}[] = [
  { key: 'namaPenerima', label: 'Nama Penerima / Calon Penerima', required: true },
  { key: 'alamatRumah', label: 'Alamat Rumah', required: true },
  { key: 'luasRumah', label: 'Luas Rumah (m²)' },
  { key: 'jumlahPenghuni', label: 'Jumlah Penghuni (orang)' },
  { key: 'kategoriKerusakan', label: 'Kategori Kerusakan (Berat/Sedang/Ringan)' },
  { key: 'sumberDana', label: 'Sumber Dana (contoh: APBN/APBD/Dana Desa)' },
  { key: 'catatan', label: 'Catatan Verifikasi' },
]

const statusUntukDesa = (() => {
  const mod = MODUL_RINGKASAN.find((m) => m.nama === 'RTLH')
  const arr: StatusVerifikasi[] = []
  if (mod) {
    for (let i = 0; i < mod.lengkap; i++) arr.push('Terverifikasi')
    for (let i = 0; i < mod.dalamProses; i++) arr.push('Menunggu Verifikasi')
    for (let i = 0; i < mod.belumDiisi; i++) arr.push('Belum Diajukan')
  }
  return arr
})()

const pemilikDemo = [
  'Sukarman (demo)',
  'Jamaluddin (demo)',
  'Marni Lubis (demo)',
  'Asmuni Situmorang (demo)',
  'Tulihati Siregar (demo)',
  'Budiman Haloho (demo)',
  'Sugianto Partait (demo)',
  'Wagimin Sutrisno (demo)',
  'Asminah Simmental (demo)',
]

const alamatDemo = [
  'Dusun I, RT 03 RW 01',
  'Dusun II, RT 01 RW 02',
  'Dusun III, RT 05 RW 02',
  'Dusun I, RT 02 RW 03',
  'Dusun IV, RT 04 RW 01',
]

export const INITIAL_RTLH: RTLHRecord[] = DESAS.flatMap((desa, i): RTLHRecord[] => {
  const verifikasi = statusUntukDesa[(i + 5) % statusUntukDesa.length]
  if (verifikasi === 'Belum Diajukan') return []
  const cats = i % 3 === 0 ? 'Berat' : i % 3 === 1 ? 'Sedang' : 'Ringan'
  return [
    {
      id: `RTLH-${desa.id}`,
      desaId: desa.id,
      namaPenerima: pemilikDemo[i % pemilikDemo.length],
      alamatRumah: alamatDemo[i % alamatDemo.length],
      luasRumah: String(32 + (i % 4) * 6),
      jumlahPenghuni: String(3 + (i % 4)),
      kategoriKerusakan: cats as RTLHRecord['kategoriKerusakan'],
      sumberDana: daftarSumber(i),
      tahun: '2026',
      verifikasi,
      updatedAt: date((i % 10) + 1),
      catatan: '',
    },
  ]
})

function daftarSumber(i: number): string {
  return ['APBN', 'APBD', 'Dana Desa'][i % 3]
}
