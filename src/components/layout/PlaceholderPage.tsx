import { PageShell } from '@/components/layout/PageShell'
import { EmptyState } from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'

export { PageShell }

interface PlaceholderProps {
  judul: string
  deskripsi: string
  catatan?: string
  children?: React.ReactNode
}

export default function PlaceholderPage({ judul, deskripsi, catatan }: PlaceholderProps) {
  return (
    <PageShell title={judul} subtitle={deskripsi}>
      <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <EmptyState
          title="Modul dalam pengembangan"
          description={
            catatan ??
            'Halaman ini masih dalam tahap pengembangan prototype. Fitur akan tersedia pada fase berikutnya.'
          }
          action={
            <Button variant="outline" size="sm">
              Kembali ke Dashboard
            </Button>
          }
        />
      </div>
    </PageShell>
  )
}
