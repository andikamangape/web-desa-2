export function Toast() {
  // sonner handles its own toaster; this is a placeholder kept for API consistency
  return null
}

export function ToastContainer() {
  return null
}

export function useToast() {
  return {
    success: () => {},
    error: () => {},
    info: () => {},
    toast: () => {},
  }
}
