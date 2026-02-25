'use client'

import { useSession } from 'next-auth/react'
import { getRoleLabel, getRoleColor } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
    <header className="h-14 sm:h-16 border-b border-border bg-card/80 backdrop-blur-xl px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2.5 -ml-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {selectedStore && (
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="hidden sm:flex w-7 h-7 rounded-lg bg-primary/10 items-center justify-center">
              <Building2 className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-semibold text-sm text-foreground truncate max-w-[120px] sm:max-w-none">
              {selectedStore.name}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <ThemeToggle />

        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full pulse-ring" />
        </button>

        {/* Divider - hidden on mobile */}
        <div className="hidden sm:block w-px h-8 bg-border" />

        {/* User Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-foreground leading-tight">{user?.name}</p>
            <Badge className={getRoleColor(user?.role || '')}>
              {getRoleLabel(user?.role || '')}
            </Badge>
          </div>
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 shadow-soft">
            <AvatarFallback className="bg-[hsl(222,47%,20%)] text-amber-400 text-xs font-semibold">
              {initials || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
