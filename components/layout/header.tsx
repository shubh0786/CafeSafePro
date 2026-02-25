'use client'

import { useSession } from 'next-auth/react'
import { getRoleLabel } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Building2, Bell, Menu } from 'lucide-react'
import { useStore } from '@/lib/store'
import { ThemeToggle } from './theme-toggle'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession()
  const { selectedStore } = useStore()

  const user = session?.user
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <header className="h-14 sm:h-16 border-b border-border bg-background px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {selectedStore && (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <span className="text-sm font-medium text-foreground truncate max-w-[140px] sm:max-w-none">
              {selectedStore.name}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        <button className="relative p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        <div className="hidden sm:block w-px h-6 bg-border mx-1" />

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-foreground leading-tight">{user?.name}</p>
            <p className="text-[11px] text-muted-foreground">{getRoleLabel(user?.role || '')}</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
              {initials || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
