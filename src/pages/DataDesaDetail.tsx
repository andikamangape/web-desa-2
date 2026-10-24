import { useParams, useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { DESAS, getDesaDetailModulStatus } from '@/data/mockData'
import { ChevronLeft, Activity } from 'lucide-react'

export default function DataDesaDetailPage() {
  const { desaId } = useParams()
  const navigate = useNavigate()

  const desa = DESAS.find((d) => d.id === desaId)
  if (!desa) {
    return (
      <div className="py-10 text-center">
        <h2 className="text-lg font-semibold text-neutral-900">Desa tidak ditemukan</h2>
        <p className="text-sm text-neutral-500">Data desa yang Anda cari tidak tersedia.</p>
        <Button onClick={() => navigate('/data-desa')} variant="outline">
          Kembali ke Daftar Desa
        </Button>
      </div>
    )
  }

  const modulStatus = getDesaDetailModulStatus(desa.id)
  const lengkapCount = modulStatus.filter((m) => m.status === 'Lengkap').length
  const dalamProsesCount = modulStatus.filter((m) => m.status === 'Dalam Proses').length
  const belumDiisiCount = modulStatus.filter((m) => m.status === 'Belum Diisi').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/data-desa')}
            className="flex items-center gap-1.5"
          >
            <ChevronLeft className="w-3 h-3" /> Kembali
          </Button>
          <div>
            <h1 className="page-title">{desa.nama}</h1>
            <p className="page-subtitle">
              {desa.kecamatan} • Terakhir diperbarui {desa.updatedAt}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Kembali ke Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info desa */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Desa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 bg-neutral-50">
                <div className="w-6 h-6 rounded bg-primary-100 text-primary-600 flex items-center justify-center">
                  <span className="text-xs font-bold">{desa.nama[0]}</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-900">{desa.nama}</div>
                  <div className="text-xs text-neutral-500">{desa.kecamatan}</div>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                <span className="text-sm text-neutral-600">Status pengisian</span>
                <StatusBadge status={desa.status} />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                <span className="text-sm text-neutral-600">Progres kelengkapan</span>
                <span className="text-sm font-medium text-neutral-900">{desa.progres}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Pembaruan terakhir</span>
                <span className="text-sm text-neutral-600">{desa.updatedAt}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ringkasan modul */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ringkasan Status per Modul</CardTitle>
                <div className="flex gap-1 text-xs">
                  <span className="px-2 py-0.5 rounded bg-success/10 text-success">{lengkapCount} Lengkap</span>
                  <span className="px-2 py-0.5 rounded bg-warning/10 text-warning">{dalamProsesCount} Proses</span>
                  <span className="px-2 py-0.5 rounded bg-danger/10 text-danger">{belumDiisiCount} Belum</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Modul</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Progres</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modulStatus.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="text-sm text-neutral-900">{m.nama}</TableCell>
                        <TableCell className="text-center">{<StatusBadge status={m.status} />}</TableCell>
                        <TableCell className="text-right font-mono text-sm">{m.progres}%</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" disabled className="opacity-50 cursor-not-allowed">
                            Lihat Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="mt-3 text-xs text-neutral-500">
                Struktur modul akan disesuaikan dengan template resmi setelah divalidasi dengan client.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 text-sm text-neutral-500">
        <Activity className="w-4 h-4 mr-2 inline" /> Data di atas adalah <b>data demonstrasi (mock)</b> untuk
        keperluan prototype dan tidak tersimpan di database.
      </div>
    </div>
  )
}
