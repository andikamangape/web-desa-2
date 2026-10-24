import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Input, Select } from '@/components/ui/Input'
import { DESAS } from '@/data/mockData'
import { Search, ArrowUpDown, ChevronLeft, FileText } from 'lucide-react'

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Lengkap', value: 'Lengkap' },
  { label: 'Dalam Proses', value: 'Dalam Proses' },
  { label: 'Belum Diisi', value: 'Belum Diisi' },
]

export default function DataDesaPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortKey, setSortKey] = useState<'nama' | 'kecamatan' | 'progres' | 'updatedAt'>('nama')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const filtered = useMemo(() => {
    return DESAS.filter((d) => {
      const matchSearch = d.nama.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || d.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      return Number(av) - Number(bv)
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Data Desa</h1>
          <p className="page-subtitle">
            Daftar 13 desa dengan status pengisian data dan progres kelengkapan (data demonstrasi).
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </Button>
        </div>
      </div>

      {/* Toolbar: search + filter */}
      <Card>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Cari nama desa..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-10"
              />
            </div>
              <Select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
              >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <div className="flex items-end gap-2">
              <span className="text-sm text-neutral-500">Diurutkan: </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSort('nama')}
                className="flex items-center gap-1 px-3"
              >
                <ArrowUpDown className="w-3 h-3" /> Nama
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabel */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Desa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Nama Desa</TableHead>
                  <TableHead className="w-40">Kecamatan</TableHead>
                  <TableHead className="text-center w-20">Status</TableHead>
                  <TableHead className="text-right w-20">Progres</TableHead>
                  <TableHead className="text-right">Terakhir Diperbarui</TableHead>
                  <TableHead className="text-right w-24">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPageItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                      Tidak ada desa yang cocok dengan pencarian dan filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentPageItems.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium text-neutral-900">{d.nama}</TableCell>
                      <TableCell className="text-sm text-neutral-600">{d.kecamatan}</TableCell>
                      <TableCell className="text-center">{<StatusBadge status={d.status} />}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{d.progres}%</TableCell>
                      <TableCell className="text-right text-sm text-neutral-600">{d.updatedAt}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/data-desa/${d.id}`)}
                          className="flex items-center gap-1.5"
                        >
                          <ChevronLeft className="w-3 h-3" /> Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-600">
            Menampilkan {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} dari{' '}
            {sorted.length} desa
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Sebelumnya
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Selanjutnya
            </Button>
            <span className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
              Halaman {page} dari {totalPages}
            </span>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 text-sm text-neutral-500">
        Data di atas adalah <b>data demonstrasi (mock)</b> untuk keperluan prototype dan tidak tersimpan di
        database.
      </div>
    </div>
  )
}
