import { DESAS, MODUL_RINGKASAN } from './mockData'
import {
  ModulConfig,
  ModulColumnDef,
  ModulFieldDef,
  ModulRecord,
  StatusKelengkapan,
} from '@/types/index'

const date = (offset: number) => {
  const d = new Date()
  d.setDate(d.getDate() - offset)
  return d.toISOString().split('T')[0]
}

const seq = (i: number) => String(i + 1).padStart(3, '0')

interface ModulDef {
  nama: string
  code: string
  judulLabel: string
  description: string
  storageKey: string
  fields: ModulFieldDef[]
  columns: ModulColumnDef[]
  rotateOffset: number
  tahun?: string
  statusRefNama?: string
  makeJudul: (i: number, tahun: string) => string
  makeData: (k: number, i: number) => Record<string, string>
}

export function buildModulConfig(def: ModulDef): ModulConfig {
  const mod = MODUL_RINGKASAN.find((m) => m.nama === (def.statusRefNama ?? def.nama))
  const tahun = def.tahun ?? '2026'
  const statuses: StatusKelengkapan[] = mod
    ? [
        ...Array<StatusKelengkapan>(mod.lengkap).fill('Lengkap'),
        ...Array<StatusKelengkapan>(mod.dalamProses).fill('Dalam Proses'),
        ...Array<StatusKelengkapan>(mod.belumDiisi).fill('Belum Diisi'),
      ]
    : []

  const initialData: ModulRecord[] = DESAS.map((desa, i) => {
    const status = statuses.length
      ? statuses[(i + def.rotateOffset) % statuses.length]
      : 'Belum Diisi'
    const k = statuses.length ? (i + def.rotateOffset) % statuses.length : i
    return {
      id: `${def.code}-${desa.id}`,
      desaId: desa.id,
      judul: status === 'Belum Diisi' ? '' : def.makeJudul(k, tahun),
      tahun,
      status,
      updatedAt: date(((i + def.rotateOffset) % 12) + 1),
      data: status === 'Belum Diisi' ? kosongkan(def.fields) : def.makeData(k, i),
    }
  })

  return {
    nama: def.nama,
    code: def.code,
    judulLabel: def.judulLabel,
    description: def.description,
    storageKey: def.storageKey,
    initialData,
    fields: def.fields,
    columns: def.columns,
  }
}

function kosongkan(fields: ModulFieldDef[]): Record<string, string> {
  return fields.reduce<Record<string, string>>((acc, f) => {
    acc[f.key] = ''
    return acc
  }, {})
}

const daftar = <T,>(arr: T[], i: number) => arr[i % arr.length]

export const IDM_CONFIG = buildModulConfig({
  nama: 'IDM',
  code: 'IDM',
  judulLabel: 'Judul Penilaian',
  description:
    'Indeks Desa Membangun: skor 3 ketahanan dan status IDM per desa. Bersifat struktur awal, menunggu validasi dengan client.',
  storageKey: 'prototype-modul-idm',
  rotateOffset: 0,
  fields: [
    { key: 'skorSosialBudaya', label: 'Skor Ketahanan Sosial, Budaya & Ekologi (0–100)', required: true },
    { key: 'skorEkonomi', label: 'Skor Ketahanan Ekonomi (0–100)', required: true },
    { key: 'skorInfrastruktur', label: 'Skor Ketahanan Infrastruktur (0–100)', required: true },
    { key: 'statusIdm', label: 'Status IDM (Sangat Tertinggal/Tertinggal/Berkembang/Maju/Sentris)' },
    { key: 'catatan', label: 'Catatan Verifikasi' },
  ],
  columns: [
    { key: 'skorSosialBudaya', label: 'Sosial, Budaya & Ekologi', align: 'right', mono: true },
    { key: 'skorEkonomi', label: 'Ekonomi', align: 'right', mono: true },
    { key: 'statusIdm', label: 'Status IDM' },
  ],
  makeJudul: (i, tahun) => `Penilaian IDM ${tahun} — Batch ${seq(i)}`,
  makeData: (k) => {
    const pasangan = [
      { soc: '72', eco: '65', inf: '78', st: 'Berkembang' },
      { soc: '64', eco: '58', inf: '70', st: 'Berkembang' },
      { soc: '58', eco: '52', inf: '61', st: 'Tertinggal' },
      { soc: '80', eco: '74', inf: '85', st: 'Maju' },
    ][k % 4]
    return {
      skorSosialBudaya: pasangan.soc,
      skorEkonomi: pasangan.eco,
      skorInfrastruktur: pasangan.inf,
      statusIdm: pasangan.st,
      catatan: '',
    }
  },
})

export const DANA_DESA_CONFIG = buildModulConfig({
  nama: 'Pengajuan Dana Desa (DD)',
  code: 'PDD',
  judulLabel: 'Nomor Pengajuan',
  description:
    'Daftar pengajuan Dana Desa per tahun anggaran. Struktur masih awal, menunggu validasi formulir resmi dengan client.',
  storageKey: 'prototype-modul-dana-desa',
  rotateOffset: 3,
  fields: [
    { key: 'jumlahDiajukan', label: 'Jumlah yang Diajukan (Rp)', required: true },
    { key: 'jumlahDiterima', label: 'Jumlah yang Diterima (Rp)' },
    { key: 'tanggalPengajuan', label: 'Tanggal Pengajuan (YYYY-MM-DD)', required: true },
    { key: 'keterangan', label: 'Keterangan' },
  ],
  columns: [
    { key: 'jumlahDiajukan', label: 'Diajukan (Rp)', align: 'right', mono: true },
    { key: 'tanggalPengajuan', label: 'Tanggal Pengajuan' },
  ],
  makeJudul: (i, tahun) => `PDD/${tahun}/${seq(i)}`,
  makeData: (k) => ({
    jumlahDiajukan: ['750.000.000', '620.000.000', '980.000.000'][k % 3],
    jumlahDiterima: k % 3 === 0 ? '750.000.000' : '',
    tanggalPengajuan: `2026-0${(k % 9) + 1}-1${k % 9}`,
    keterangan: '',
  }),
})

export const ADD_CONFIG = buildModulConfig({
  nama: 'Pengajuan ADD',
  code: 'ADD',
  judulLabel: 'Nomor Pengajuan',
  description:
    'Daftar pengajuan Alokasi Dana Desa (ADD). Struktur masih awal, menunggu validasi formulir resmi dengan client.',
  storageKey: 'prototype-modul-add',
  rotateOffset: 6,
  fields: [
    { key: 'jumlahDiajukan', label: 'Jumlah yang Diajukan (Rp)', required: true },
    { key: 'tanggalPengajuan', label: 'Tanggal Pengajuan (YYYY-MM-DD)', required: true },
    { key: 'keterangan', label: 'Keterangan' },
  ],
  columns: [
    { key: 'jumlahDiajukan', label: 'Diajukan (Rp)', align: 'right', mono: true },
    { key: 'tanggalPengajuan', label: 'Tanggal Pengajuan' },
  ],
  makeJudul: (i, tahun) => `ADD/${tahun}/${seq(i)}`,
  makeData: (k) => ({
    jumlahDiajukan: ['410.000.000', '355.000.000', '530.000.000'][k % 3],
    tanggalPengajuan: `2026-0${(k % 9) + 1}-0${(k % 9) + 1}`,
    keterangan: '',
  }),
})

export const APBDES_CONFIG = buildModulConfig({
  nama: 'APBDes',
  code: 'APBDES',
  judulLabel: 'Judul Dokumen Anggaran',
  description:
    'Anggaran Pendapatan dan Belanja Desa. Struktur masih awal: rincian rekening mengikuti Permendagri dan akan disesuaikan setelah validasi dengan client.',
  storageKey: 'prototype-modul-apbdes',
  rotateOffset: 9,
  fields: [
    { key: 'totalPendapatan', label: 'Total Pendapatan (Rp)', required: true },
    { key: 'totalBelanja', label: 'Total Belanja (Rp)', required: true },
    { key: 'surplusDefisit', label: 'Surplus / Defisit (Rp)' },
    { key: 'tanggalPenetapan', label: 'Tanggal Penetapan (YYYY-MM-DD)' },
    { key: 'noSkPenetapan', label: 'Nomor SK Penetapan' },
  ],
  columns: [
    { key: 'totalPendapatan', label: 'Pendapatan (Rp)', align: 'right', mono: true },
    { key: 'totalBelanja', label: 'Belanja (Rp)', align: 'right', mono: true },
    { key: 'surplusDefisit', label: 'Surplus/Defisit', align: 'right' },
  ],
  makeJudul: (i, tahun) => `APBDes ${tahun} — ${seq(i)}`,
  makeData: (k) => {
    const pend = ['2.450.000.000', '1.870.000.000', '3.120.000.000'][k % 3]
    const bel = ['2.380.000.000', '1.900.000.000', '3.020.000.000'][k % 3]
    return {
      totalPendapatan: pend,
      totalBelanja: bel,
      surplusDefisit: '',
      tanggalPenetapan: `2026-01-0${(k % 9) + 1}`,
      noSkPenetapan: `800/${k + 1}/DEMO/2026`,
    }
  },
})

export const SK_APARAT_CONFIG = buildModulConfig({
  nama: 'SK Aparat Desa',
  code: 'SKAPPARAT',
  judulLabel: 'Nomor SK',
  description:
    'Surat Keputusan pengangkatan/pemberhentian aparat desa. Struktur masih awal, menunggu validasi dengan client.',
  storageKey: 'prototype-modul-sk-aparat',
  rotateOffset: 1,
  fields: [
    { key: 'tanggalSk', label: 'Tanggal SK (YYYY-MM-DD)', required: true },
    { key: 'jumlahAparat', label: 'Jumlah Aparat dalam SK' },
    { key: 'penetap', label: 'Yang Menetapkan' },
    { key: 'keterangan', label: 'Keterangan' },
  ],
  columns: [
    { key: 'tanggalSk', label: 'Tanggal SK' },
    { key: 'jumlahAparat', label: 'Jumlah Aparat', align: 'right', mono: true },
  ],
  makeJudul: (i, tahun) => `SK/${seq(i)}/DEMO/${tahun}`,
  makeData: (k) => ({
    tanggalSk: `2026-0${(k % 9) + 1}-05`,
    jumlahAparat: String(5 + (k % 4)),
    penetap: 'Kepala Desa',
    keterangan: '',
  }),
})

export const SK_BPD_CONFIG = buildModulConfig({
  nama: 'SK BPD',
  code: 'SKBPD',
  judulLabel: 'Nomor SK',
  description:
    'Surat Keputusan Badan Permusyawaratan Desa. Struktur masih awal, menunggu validasi dengan client.',
  storageKey: 'prototype-modul-sk-bpd',
  rotateOffset: 4,
  fields: [
    { key: 'tanggalSk', label: 'Tanggal SK (YYYY-MM-DD)', required: true },
    { key: 'jumlahAnggota', label: 'Jumlah Anggota BPD' },
    { key: 'ketuaBpd', label: 'Ketua BPD' },
    { key: 'keterangan', label: 'Keterangan' },
  ],
  columns: [
    { key: 'tanggalSk', label: 'Tanggal SK' },
    { key: 'jumlahAnggota', label: 'Anggota BPD', align: 'right', mono: true },
    { key: 'ketuaBpd', label: 'Ketua BPD' },
  ],
  makeJudul: (i, tahun) => `SK/${seq(i)}/BPD/${tahun}`,
  makeData: (k) => ({
    tanggalSk: `2026-02-1${k % 9}`,
    jumlahAnggota: '7',
    ketuaBpd: daftar(['S. Pranoto (demo)', 'H. Basuki (demo)'], k),
    keterangan: '',
  }),
})

export const MUSRENBANG_CONFIG = buildModulConfig({
  nama: 'Berita Acara Musrenbang Desa',
  code: 'BA-MUSRENBANG',
  judulLabel: 'Nomor Berita Acara',
  description:
    'Dokumentasi berita acara Musyawarah Perencanaan Pembangunan Desa. Struktur masih awal, menunggu validasi dengan client.',
  storageKey: 'prototype-modul-musrenbang',
  rotateOffset: 7,
  fields: [
    { key: 'tanggalMusrenbang', label: 'Tanggal Musrenbang (YYYY-MM-DD)', required: true },
    { key: 'tempat', label: 'Tempat Pelaksanaan' },
    { key: 'jumlahPeserta', label: 'Jumlah Peserta' },
    { key: 'ringkasanUsulan', label: 'Ringkasan Usulan Utama' },
  ],
  columns: [
    { key: 'tanggalMusrenbang', label: 'Tanggal' },
    { key: 'jumlahPeserta', label: 'Peserta', align: 'right', mono: true },
  ],
  makeJudul: (i, tahun) => `BA/MSRB/${seq(i)}/${tahun}`,
  makeData: (k) => ({
    tanggalMusrenbang: `2026-03-2${k % 9}`,
    tempat: 'Balai Desa',
    jumlahPeserta: String(80 + (k % 5) * 7),
    ringkasanUsulan: '',
  }),
})

export const SK_POSYANDU_CONFIG = buildModulConfig({
  nama: 'SK Kader Posyandu Desa',
  code: 'SKPOSYANDU',
  judulLabel: 'Nomor SK',
  description:
    'Surat Keputusan pengangkatan kader Posyandu desa. Struktur masih awal, menunggu validasi dengan client.',
  storageKey: 'prototype-modul-sk-posyandu',
  rotateOffset: 2,
  fields: [
    { key: 'tanggalSk', label: 'Tanggal SK (YYYY-MM-DD)', required: true },
    { key: 'jumlahKader', label: 'Jumlah Kader yang Diangkat' },
    { key: 'ketuaTim', label: 'Ketua Tim Posyandu' },
    { key: 'keterangan', label: 'Keterangan' },
  ],
  columns: [
    { key: 'tanggalSk', label: 'Tanggal SK' },
    { key: 'jumlahKader', label: 'Kader', align: 'right', mono: true },
  ],
  makeJudul: (i, tahun) => `SK/${seq(i)}/PSY/${tahun}`,
  makeData: (k) => ({
    tanggalSk: `2026-04-1${k % 9}`,
    jumlahKader: String(6 + (k % 3)),
    ketuaTim: '',
    keterangan: '',
  }),
})

export const BUM_DESA_CONFIG = buildModulConfig({
  nama: 'BUM Desa',
  code: 'BUMD',
  judulLabel: 'Nama BUM Desa',
  description:
    'Badan Usaha Milik Desa per desa. Struktur masih awal, menunggu validasi formulir resmi dengan client.',
  storageKey: 'prototype-modul-bum-desa',
  rotateOffset: 11,
  statusRefNama: 'BUM Desa & BUM Desa Bersama',
  fields: [
    { key: 'jenisUsaha', label: 'Jenis Usaha Utama', required: true },
    { key: 'modalAwal', label: 'Modal Awal (Rp)' },
    { key: 'legalitas', label: 'Legalitas (Akta/NIB/CBS)' },
    { key: 'kondisiOperasional', label: 'Kondisi Operasional (Aktif/Tidak Aktif/Masih Tahap Persiapan)' },
  ],
  columns: [
    { key: 'jenisUsaha', label: 'Jenis Usaha' },
    { key: 'legalitas', label: 'Legalitas' },
    { key: 'kondisiOperasional', label: 'Kondisi Operasional' },
  ],
  makeJudul: (i) => `BUM Desa ${seq(i)}`,
  makeData: (k) => ({
    jenisUsaha: ['Simpan Pinjam', 'Perdagangan & Persebayaan', 'Pertanian & Peternakan', 'Pariwisata Desa'][k % 4],
    modalAwal: ['150.000.000', '85.000.000', '220.000.000'][k % 3],
    legalitas: k % 3 === 0 ? 'Lengkap (Akta + NIB)' : k % 3 === 1 ? 'NIB saja' : 'Proses pengurusan',
    kondisiOperasional: ['Aktif', 'Masih Tahap Persiapan', 'Aktif'][k % 3],
  }),
})

export const BUM_BERSAMA_CONFIG: ModulConfig = {
  nama: 'BUM Desa Bersama',
  code: 'BUMB',
  judulLabel: 'Nama BUM Bersama',
  description:
    'Badan Usaha Milik Desa bersama (kemitraan antar desa). Data masih awal: struktur keanggotaan kelembagaan dan bidang usaha menunggu validasi dengan client.',
  storageKey: 'prototype-modul-bum-bersama',
  initialData: [
    {
      id: 'BUMB-001',
      desaId: DESAS[0].id,
      judul: 'Koperasi Digital Kreatif (demo)',
      tahun: '2026',
      status: 'Lengkap',
      updatedAt: date(2),
      data: {
        desaPeserta: 'Desa Sumentobol, Desa Nantukidan, Desa Labang, Desa Sumantipal (demo)',
        jenisUsaha: 'Pemasaran produk UMKM desa',
        modalAwal: '75.000.000',
        legalitas: 'Proses akta koperasi',
        jumlahDesaPeserta: '4',
      },
    },
    {
      id: 'BUMB-002',
      desaId: DESAS[1].id,
      judul: 'Kemitraan Wisata Bersama (demo)',
      tahun: '2026',
      status: 'Lengkap',
      updatedAt: date(5),
      data: {
        desaPeserta: 'Desa Nantukidan, Desa Ngawol, Desa Sumantipal (demo)',
        jenisUsaha: 'Homestay & paket wisata',
        modalAwal: '120.000.000',
        legalitas: 'Akta + NIB',
        jumlahDesaPeserta: '3',
      },
    },
    {
      id: 'BUMB-003',
      desaId: DESAS[2].id,
      judul: 'Agro Industri Bersama (demo)',
      tahun: '2026',
      status: 'Dalam Proses',
      updatedAt: date(8),
      data: {
        desaPeserta: 'Desa Labang, Desa Lagas (demo)',
        jenisUsaha: 'Pengolahan hasil pertanian',
        modalAwal: '60.000.000',
        legalitas: 'Belum ada',
        jumlahDesaPeserta: '2',
      },
    },
    {
      id: 'BUMB-004',
      desaId: DESAS[3].id,
      judul: 'Unit Usaha Air Bersih (demo)',
      tahun: '2026',
      status: 'Dalam Proses',
      updatedAt: date(11),
      data: {
        desaPeserta: 'Desa Sumantipal, Desa Bululaun Hilir (demo)',
        jenisUsaha: 'Jaringan air bersih',
        modalAwal: '200.000.000',
        legalitas: 'Proses NIB',
        jumlahDesaPeserta: '2',
      },
    },
  ],
  fields: [
    { key: 'desaPeserta', label: 'Daftar Desa Peserta', required: true },
    { key: 'jenisUsaha', label: 'Jenis Usaha Utama', required: true },
    { key: 'modalAwal', label: 'Modal Awal (Rp)' },
    { key: 'legalitas', label: 'Legalitas (Akta/NIB/CBS)' },
    { key: 'jumlahDesaPeserta', label: 'Jumlah Desa Peserta' },
  ],
  columns: [
    { key: 'desaPeserta', label: 'Desa Peserta' },
    { key: 'jenisUsaha', label: 'Jenis Usaha' },
    { key: 'jumlahDesaPeserta', label: 'Jumlah Desa', align: 'right', mono: true },
  ],
}
