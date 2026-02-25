'use client'

import { useSession } from 'next-auth/react'
import { getRoleLabel, getRoleColor } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Building2, Bell } from 'lucide-react'
import { useStore } from '@/lib/store'

export function Header() {
  const { data: session } = useSession()
  const { selectedStore } = useStore()

  const user = session?.user
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <header className="h-16 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {selectedStore && (
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Building2 className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <span className="font-semibold text-sm text-gray-900">{selectedStore.name}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full pulse-ring" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200" />

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 leading-tight">{user?.name}</p>
            <Badge className={getRoleColor(user?.role || '')}>
              {getRoleLabel(user?.role || '')}
            </Badge>
          </div>
          <Avatar className="h-9 w-9 shadow-soft">
            <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-xs font-semibold">
              {initials || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
