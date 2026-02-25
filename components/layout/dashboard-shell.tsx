'use client'

import { Sidebar } from './sidebar'
import { Header } from './header'
import { StoreSelector } from './store-selector'

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-gray-50/50 dot-pattern flex">
      {/* Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidebar className="fixed inset-y-0 left-0 w-64 z-40" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <StoreSelector />
        <main className="flex-1 p-6 lg:p-8 animate-fade-in-up">
          {children}
        </main>
      </div>
    </div>
  )
}
