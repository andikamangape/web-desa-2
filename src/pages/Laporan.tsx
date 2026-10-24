import Button from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { downloadCsv } from '@/lib/csv'
import {
  LAPORAN_MODUL,
  modulCsv,
  profilCsv,
  readModulRecords,
  rekapPerDesaCsv,
  ringkasanCsv,
  rtlhCsv,
  readRtlhRecords,
} from '@/lib/reportData'
import { MODUL_RINGKASAN } from '@/data/mockData'
import { useToast } from '@/hooks/useToast'
import { Download, FileSpreadsheet, FileText, FolderOpen } from 'lucide-react'

const todayStr = () => new Date().toISOString().split('T')[0]

export default function LaporanPage() {
  const { success, error } = useToast()

  const unduh = (namaFile: string, headers: string[], rows: string[][], label: string) => {
    if (rows.length === 0) {
      error('Tidak ada baris data', `${label} tidak memiliki data untuk diekspor.`)
      return
    }
    downloadCsv(namaFile, headers, rows)
    success('CSV diunduh', `${label} — file demo berisi data demonstrasi (mock).`)
  }

  const unduhRekapModul = () => {
    const { headers, rows, namaFile } = ringkasanCsv()
    unduh(namaFile, headers, rows, 'Rekap per Modul')
  }

  const unduhRekapPerDesa = () => {
    const { headers, rows, namaFile } = rekapPerDesaCsv()
    unduh(namaFile, headers, rows, 'Rekap per Desa')
  }

  const eksporModul = (namaModul: string) => {
    if (namaModul === 'RTLH') {
      unduhRtlh()
      return
    }
    if (namaModul === 'Profil Desa') {
      unduhProfil()
      return
    }
    if (namaModul === 'BUM Desa & BUM Desa Bersama') {
      const bumd = LAPORAN_MODUL.find((c) => c.nama === 'BUM Desa')
      const bumb = LAPORAN_MODUL.find((c) => c.nama === 'BUM Desa Bersama')
      if (bumd) {
        const { headers, rows, namaFile } = modulCsv(bumd, readModulRecords(bumd))
        downloadCsv(namaFile, headers, rows)
      }
      if (bumb) {
        const { headers, rows, namaFile } = modulCsv(bumb, readModulRecords(bumb))
        downloadCsv(namaFile, headers, rows)
      }
      success('CSV diunduh', 'BUM Desa & BUM Desa Bersama — file demo berisi data demonstrasi (mock).')
      return
    }
    const config = LAPORAN_MODUL.find((c) => c.nama === namaModul)
    if (!config) {
      error('Ekspor belum tersedia', `Ekspor modul "${namaModul}" menunggu validasi dengan client.`)
      return
    }
    const { headers, rows, namaFile } = modulCsv(config, readModulRecords(config))
    unduh(namaFile, headers, rows, `Modul ${config.nama}`)
  }

  const unduhRtlh = () => {
    const { headers, rows, namaFile } = rtlhCsv(readRtlhRecords())
    unduh(namaFile, headers, rows, 'Modul RTLH')
  }

  const unduhProfil = () => {
    const { headers, rows, namaFile } = profilCsv()
    unduh(namaFile, headers, rows, 'Profil Desa')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Laporan</h1>
          <p className="page-subtitle">
            Rekap kelengkapan 13 desa dan ekspor CSV dari data demonstrasi (mock).
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={unduhRekapPerDesa}>
            <Download className="w-4 h-4 mr-2" />
            Rekap per Desa (CSV)
          </Button>
          <Button onClick={unduhRekapModul}>
            <Download className="w-4 h-4 mr-2" />
            Rekap per Modul (CSV)
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Rekap Kelengkapan per Modul</CardTitle>
            <span className="text-xs text-neutral-400">{MODUL_RINGKASAN.length} modul</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Modul</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Lengkap</TableHead>
                  <TableHead className="text-right">Dalam Proses</TableHead>
                  <TableHead className="text-right">Belum Diisi</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ekspor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MODUL_RINGKASAN.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium text-neutral-900">{m.nama}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{m.total}</TableCell>
                    <TableCell className="text-right font-mono text-sm text-success">{m.lengkap}</TableCell>
                    <TableCell className="text-right font-mono text-sm text-warning">{m.dalamProses}</TableCell>
                    <TableCell className="text-right font-mono text-sm text-danger">{m.belumDiisi}</TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={m.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => eksporModul(m.nama)}>
                        <Download className="w-4 h-4 mr-1" />
                        CSV
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-primary-500 text-white">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Ekspor semua data</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Ekspor CSV memakai pemisah titik koma agar terbuka rapi di Excel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-neutral-500 text-white">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Data demonstrasi</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Semua isi laporan berasal dari data mock; tidak ada koneksi ke backend.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-warning text-white">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Template resmi menunggu</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Struktur kolom mengikuti struktur awal dan harus divalidasi dengan client.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 text-sm text-neutral-500">
        File CSV yang diunduh dihasilkan langsung dari data demonstrasi (mock) di browser saat tombol diklik dan
        ditandai kolom <b>"Sumber Data"</b>. Jika sebuah modul sudah dimodifikasi pada demo (data di localStorage),
        ekspor mengikuti data demo terbaru per tanggal {todayStr()}.
      </div>
    </div>
  )
}
