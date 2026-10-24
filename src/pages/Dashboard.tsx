import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { DESAS, MODUL_RINGKASAN, AKTIVITAS } from '@/data/mockData'
import { Desa } from '@/types/index'
import { Activity, AlertTriangle, BarChart3, Clock, FileCheck, Users } from 'lucide-react'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [sortKey, setSortKey] = useState<keyof Desa>('nama')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const totalDesa = DESAS.length
  const lengkapDesa = DESAS.filter((d) => d.status === 'Lengkap').length
  const dalamProsesDesa = DESAS.filter((d) => d.status === 'Dalam Proses').length
  const belumDiisiDesa = DESAS.filter((d) => d.status === 'Belum Diisi').length

  const sortedDesa = [...DESAS].sort((a, b) => {
    const av = a[sortKey]
    const bv = b[sortKey]
    if (typeof av === 'string' && typeof bv === 'string') {
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    }
    return Number(av) - Number(bv)
  })

  const handleSort = (key: keyof Desa) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const quickNav = [
    { label: 'Lihat Data Desa', href: '/data-desa', icon: Users, color: 'bg-primary-600' },
    { label: 'IDM', href: '/idm', icon: BarChart3, color: 'bg-primary-600' },
    { label: 'RTLH', href: '/rtlh', icon: FileCheck, color: 'bg-primary-600' },
    { label: 'Laporan', href: '/laporan', icon: Activity, color: 'bg-primary-600' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Ringkasan progres pengisian data 13 desa (data demonstrasi).
          </p>
        </div>
        <div className="flex gap-2">
          {quickNav.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`${item.color} text-white`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Desa"
          value={totalDesa}
          icon={<Users className="w-5 h-5" />}
          color="bg-primary-500"
          subtitle="13 desa targets"
        />
        <StatCard
          title="Lengkap"
          value={lengkapDesa}
          icon={<FileCheck className="w-5 h-5" />}
          color="bg-success-500"
          subtitle={`${Math.round((lengkapDesa / totalDesa) * 100)}% dari total`}
        />
        <StatCard
          title="Dalam Proses"
          value={dalamProsesDesa}
          icon={<Clock className="w-5 h-5" />}
          color="bg-warning-500"
          subtitle={`${Math.round((dalamProsesDesa / totalDesa) * 100)}% dari total`}
        />
        <StatCard
          title="Belum Diisi"
          value={belumDiisiDesa}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="bg-danger-500"
          subtitle={`${Math.round((belumDiisiDesa / totalDesa) * 100)}% dari total`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart: progres per desa */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Progres Pengisian Data per Desa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sortedDesa} layout="vertical" margin={{ left: 120, right: 20, top: 20, bottom: 20 }}>
                    <CartesianGrid horizontal stroke="#e5e5e5" />
                    <YAxis dataKey="nama" width={110} tick={{ fontSize: 12 }} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Bar dataKey="progres" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-3 text-xs text-neutral-500">
                Skor progres adalah data demonstrasi. Angka akan diubah saat integrasi backend.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ringkasan modul */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Rekap per Modul</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="space-y-3">
                {MODUL_RINGKASAN.map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-neutral-900">{m.nama}</div>
                      <div className="text-xs text-neutral-500">
                        {m.lengkap} lengkap • {m.dalamProses} proses • {m.belumDiisi} belum
                      </div>
                    </div>
                    <StatusBadge status={m.status} className="text-xs" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabel status desa */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tabel Kelengkapan Data per Desa</CardTitle>
            <div className="text-xs text-neutral-400">{totalDesa} desa</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('nama')} className="cursor-pointer select-none">
                    Nama Desa{' '}
                    {sortKey === 'nama' && (sortDir === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Kecamatan</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Progres</TableHead>
                  <TableHead className="text-right">Terakhir Diperbarui</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedDesa.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium text-neutral-900">{d.nama}</TableCell>
                    <TableCell className="text-sm text-neutral-600">{d.kecamatan}</TableCell>
                    <TableCell className="text-center">{<StatusBadge status={d.status} />}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{d.progres}%</TableCell>
                    <TableCell className="text-right text-sm text-neutral-600">{d.updatedAt}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/data-desa/${d.id}`)}>
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Aktivitas terbaru */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {AKTIVITAS.map((a) => (
              <div key={a.id} className="flex items-center gap-3 py-2 border-b border-neutral-50 last:border-0">
                <Activity className="w-5 h-5 text-neutral-400 shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-900">{a.desa}</div>
                  <div className="text-xs text-neutral-500">
                    {a.modul} — {a.aksi}
                  </div>
                </div>
                <div className="text-xs text-neutral-400">{a.waktu}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 text-sm text-neutral-500">
        <AlertTriangle className="w-4 h-4 mr-2 inline" /> Data di atas adalah <b>data demonstrasi (mock)</b> untuk
        keperluan prototype dan tidak tersimpan di database.
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: {
  title: string
  value: number | string
  icon: React.ReactNode
  color: string
  subtitle: string
}) {
  return (
    <Card>
      <CardContent className="pt-6 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{title}</p>
            <div className="text-2xl font-bold text-neutral-900 mt-1">{value}</div>
            <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-lg ${color} text-white`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
