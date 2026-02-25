'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ClipboardList,
  Thermometer,
  Package,
  Bug,
  Wrench,
  Users,
  Settings,
  FileText,
  Building2,
  LogOut,
  Store,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  roles: string[]
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" />, roles: ['STAFF', 'MANAGER', 'OWNER', 'FRANCHISE_ADMIN'] },
  { title: 'Daily Tasks', href: '/tasks', icon: <ClipboardList className="h-4 w-4" />, roles: ['STAFF', 'MANAGER'] },
  { title: 'Temperature', href: '/temperature', icon: <Thermometer className="h-4 w-4" />, roles: ['STAFF', 'MANAGER'] },
  { title: 'Records', href: '/records', icon: <FileText className="h-4 w-4" />, roles: ['STAFF', 'MANAGER'] },
  { title: 'Stock & Traceability', href: '/stock', icon: <Package className="h-4 w-4" />, roles: ['STAFF', 'MANAGER'] },
  { title: 'Pest Control', href: '/pest-control', icon: <Bug className="h-4 w-4" />, roles: ['STAFF', 'MANAGER'] },
  { title: 'Equipment', href: '/equipment', icon: <Wrench className="h-4 w-4" />, roles: ['MANAGER', 'OWNER'] },
  { title: 'Staff', href: '/staff', icon: <Users className="h-4 w-4" />, roles: ['MANAGER', 'OWNER', 'FRANCHISE_ADMIN'] },
  { title: 'Reports', href: '/reports', icon: <FileText className="h-4 w-4" />, roles: ['MANAGER', 'OWNER', 'FRANCHISE_ADMIN'] },
  { title: 'Stores', href: '/stores', icon: <Store className="h-4 w-4" />, roles: ['OWNER', 'FRANCHISE_ADMIN'] },
  { title: 'Settings', href: '/settings', icon: <Settings className="h-4 w-4" />, roles: ['OWNER', 'FRANCHISE_ADMIN'] },
  { title: 'Franchise', href: '/franchise', icon: <Building2 className="h-4 w-4" />, roles: ['FRANCHISE_ADMIN'] },
]

interface SidebarProps {
  className?: string
  onNavigate?: () => void
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = session?.user?.role || 'STAFF'

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  )

  return (
    <div className={cn('flex flex-col h-full bg-[hsl(228,45%,13%)]', className)}>
      {/* Logo */}
      <div className="px-6 py-6">
        <Link href="/dashboard" className="block" onClick={onNavigate}>
          <span className="font-serif text-xl text-white tracking-wide italic">
            In Control
          </span>
          <span className="block text-[11px] text-white/40 tracking-[0.15em] uppercase mt-0.5">
            MPI Compliance
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-colors duration-150',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              <span className={isActive ? 'text-white' : 'text-white/40'}>
                {item.icon}
              </span>
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium text-white/40 hover:text-white/70 transition-colors duration-150 w-full"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
