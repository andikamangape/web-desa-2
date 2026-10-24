import { EmptyState } from '@/components/ui/Spinner'
import PlaceholderPage from '@/components/layout/PlaceholderPage'
import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <PlaceholderPage judul="Halaman tidak ditemukan" deskripsi="Halaman yang Anda cari tidak tersedia.">
      <EmptyState
        title="404 — Halaman tidak ditemukan"
        description="Alamat ini tidak dikenali pada prototype. Kembali ke Dashboard untuk melanjutkan demo."
        action={
          <Button onClick={() => navigate('/dashboard')}>Kembali ke Dashboard</Button>
        }
      />
    </PlaceholderPage>
  )
}
