import { DokumenItem } from '@/types/index'

export const DOKUMEN_STORAGE_KEY = 'prototype-dokumen'

export const KATEGORI_DOKUMEN = [
  'Formulir',
  'Peraturan',
  'Laporan',
  'Surat',
] as const

export const INITIAL_DOKUMEN: DokumenItem[] = [
  {
    id: 'dok-001',
    nama: 'Formulir Penilaian IDM (demo)',
    kategori: 'Formulir',
    modulTerkait: 'IDM',
    format: 'XLSX',
    ukuran: '24 KB (perkiraan)',
    diperbarui: '2026-01-12',
    status: 'Tersedia',
  },
  {
    id: 'dok-002',
    nama: 'Formulir Pengajuan Dana Desa (demo)',
    kategori: 'Formulir',
    modulTerkait: 'Pengajuan Dana Desa (DD)',
    format: 'XLSX',
    ukuran: '18 KB (perkiraan)',
    diperbarui: '2026-01-15',
    status: 'Tersedia',
  },
  {
    id: 'dok-003',
    nama: 'Template Berita Acara Musrenbang (demo)',
    kategori: 'Formulir',
    modulTerkait: 'Berita Acara Musrenbang Desa',
    format: 'DOCX',
    ukuran: '12 KB (perkiraan)',
    diperbarui: '2026-02-03',
    status: 'Tersedia',
  },
  {
    id: 'dok-004',
    nama: 'Template Registrasi RTLH (demo)',
    kategori: 'Formulir',
    modulTerkait: 'RTLH',
    format: 'XLSX',
    ukuran: '-',
    diperbarui: '-',
    status: 'Menunggu Template',
  },
  {
    id: 'dok-005',
    nama: 'Template Data BUM Desa (demo)',
    kategori: 'Formulir',
    modulTerkait: 'BUM Desa & BUM Desa Bersama',
    format: 'XLSX',
    ukuran: '-',
    diperbarui: '-',
    status: 'Menunggu Template',
  },
  {
    id: 'dok-006',
    nama: 'Rekap Kelengkapan 13 Desa (demo)',
    kategori: 'Laporan',
    modulTerkait: 'Semua modul',
    format: 'CSV',
    ukuran: 'Dibangkitkan saat unduh',
    diperbarui: '2026-02-28',
    status: 'Tersedia',
  },
]