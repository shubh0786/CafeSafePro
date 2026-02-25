'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { StoreSelector } from './store-selector'
import { MobileSidebar } from './mobile-sidebar'

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background dot-pattern flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidebar className="fixed inset-y-0 left-0 w-64 z-40" />
      </div>

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <StoreSelector />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in-up">
          {children}
        </main>
      </div>
    </div>
  )
}
