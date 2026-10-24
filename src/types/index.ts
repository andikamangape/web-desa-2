export type StatusKelengkapan = 'Lengkap' | 'Dalam Proses' | 'Belum Diisi'

export interface Desa {
  id: string
  nama: string
  kecamatan: string
  status: StatusKelengkapan
  progres: number
  updatedAt: string
}

export interface ProfilDesa {
  desaId: string
  kepalaDesa: string
  sekretarisDesa: string
  alamatKantor: string
  luasWilayah: string
  jumlahDusun: string
  jumlahRT: string
  jumlahRW: string
  jumlahPenduduk: string
  jumlahKK: string
  jarakKeKecamatan: string
  jarakKeKabupaten: string
  status: StatusKelengkapan
  updatedAt: string
}

export interface ModulRingkasan {
  id: string
  nama: string
  total: number
  lengkap: number
  dalamProses: number
  belumDiisi: number
  status: StatusKelengkapan
}

export interface Aktivitas {
  id: string
  desa: string
  modul: string
  aksi: string
  waktu: string
}

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  active?: boolean
}

export interface MenuGroup {
  label: string
  items: NavItem[]
}

export interface ModulRecord {
  id: string
  desaId: string
  judul: string
  tahun: string
  status: StatusKelengkapan
  updatedAt: string
  data: Record<string, string>
}

export interface ModulFieldDef {
  key: string
  label: string
  required?: boolean
}

export interface ModulColumnDef {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  mono?: boolean
}

export interface ModulConfig {
  nama: string
  code: string
  judulLabel: string
  description: string
  storageKey: string
  initialData: ModulRecord[]
  fields: ModulFieldDef[]
  columns: ModulColumnDef[]
  requiredFieldKeys?: string[]
}

export type StatusVerifikasi = 'Terverifikasi' | 'Menunggu Verifikasi' | 'Belum Diajukan'

export interface RTLHRecord {
  id: string
  desaId: string
  namaPenerima: string
  alamatRumah: string
  luasRumah: string
  jumlahPenghuni: string
  kategoriKerusakan: 'Berat' | 'Sedang' | 'Ringan'
  sumberDana: string
  tahun: string
  verifikasi: StatusVerifikasi
  updatedAt: string
  catatan: string
}

export interface DokumenItem {
  id: string
  nama: string
  kategori: string
  modulTerkait: string
  format: 'PDF' | 'XLSX' | 'DOCX' | 'CSV'
  ukuran: string
  diperbarui: string
  status: 'Tersedia' | 'Menunggu Template'
}
