export interface LayoutContextType {
  location: { pathname: string }
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

import { createContext, useContext, ReactNode } from 'react'

const LayoutContext = createContext<LayoutContextType | null>(null)

export function LayoutProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function useLayoutContext(): LayoutContextType {
  const ctx = useContext(LayoutContext)
  if (!ctx) throw new Error('useLayoutContext must be used within LayoutProvider')
  return ctx
}

export default LayoutContext
