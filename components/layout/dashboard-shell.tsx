'use client'

import { Sidebar } from './sidebar'
import { Header } from './header'
import { StoreSelector } from './store-selector'

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidebar className="fixed inset-y-0 left-0 w-64" />
      </div>
      <div className="flex-1 md:ml-64">
        <Header />
        <StoreSelector />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
