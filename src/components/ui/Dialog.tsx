import * as React from 'react'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title?: string
  description?: string
}

export function Dialog({ open, onOpenChange, children, title, description }: DialogProps) {
  return (
    <>
      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
              <div className="relative w-full max-w-2xl">
                <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xl">
                  {title && <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>}
                  {description && <p className="text-sm text-neutral-500">{description}</p>}
                  <div className="mt-4">{children}</div>
                  <div className="mt-6 flex flex-row-reverse gap-3">
                    <button
                      onClick={() => onOpenChange(false)}
                      className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-100 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => onOpenChange(false)}
                      className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 transition-colors"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = 'Hapus data?',
  description = 'Data yang dihapus tidak dapat dikembalikan.',
  onConfirm,
  onCancel,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  onConfirm?: () => void
  onCancel?: () => void
}) {
  return (
    <>
      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
              <div className="relative w-full max-w-md">
                <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xl">
                  <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
                  <p className="mt-2 text-sm text-neutral-500">{description}</p>
                  <div className="mt-6 flex flex-row-reverse gap-3">
                    <button
                      onClick={() => {
                        onCancel?.()
                        onOpenChange(false)
                      }}
                      className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-100 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => onConfirm?.()}
                      className="inline-flex items-center gap-2 rounded-md bg-danger px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-danger/90 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
