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
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  roles: string[]
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-[18px] w-[18px]" />,
    roles: ['STAFF', 'MANAGER', 'OWNER', 'FRANCHISE_ADMIN'],
  },
  {
    title: 'Daily Tasks',
    href: '/tasks',
    icon: <ClipboardList className="h-[18px] w-[18px]" />,
    roles: ['STAFF', 'MANAGER'],
  },
  {
    title: 'Temperature',
    href: '/temperature',
    icon: <Thermometer className="h-[18px] w-[18px]" />,
    roles: ['STAFF', 'MANAGER'],
  },
  {
    title: 'Records',
    href: '/records',
    icon: <FileText className="h-[18px] w-[18px]" />,
    roles: ['STAFF', 'MANAGER'],
  },
  {
    title: 'Stock & Traceability',
    href: '/stock',
    icon: <Package className="h-[18px] w-[18px]" />,
    roles: ['STAFF', 'MANAGER'],
  },
  {
    title: 'Pest Control',
    href: '/pest-control',
    icon: <Bug className="h-[18px] w-[18px]" />,
    roles: ['STAFF', 'MANAGER'],
  },
  {
    title: 'Equipment',
    href: '/equipment',
    icon: <Wrench className="h-[18px] w-[18px]" />,
    roles: ['MANAGER', 'OWNER'],
  },
  {
    title: 'Staff',
    href: '/staff',
    icon: <Users className="h-[18px] w-[18px]" />,
    roles: ['MANAGER', 'OWNER', 'FRANCHISE_ADMIN'],
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: <FileText className="h-[18px] w-[18px]" />,
    roles: ['MANAGER', 'OWNER', 'FRANCHISE_ADMIN'],
  },
  {
    title: 'Stores',
    href: '/stores',
    icon: <Store className="h-[18px] w-[18px]" />,
    roles: ['OWNER', 'FRANCHISE_ADMIN'],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="h-[18px] w-[18px]" />,
    roles: ['OWNER', 'FRANCHISE_ADMIN'],
  },
  {
    title: 'Franchise',
    href: '/franchise',
    icon: <Building2 className="h-[18px] w-[18px]" />,
    roles: ['FRANCHISE_ADMIN'],
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = session?.user?.role || 'STAFF'

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  )

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-white/80 backdrop-blur-xl border-r border-gray-200/60',
        className
      )}
    >
      {/* Logo */}
      <div className="p-5 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-[15px] text-gray-900 tracking-tight">
              CafeSafe Pro
            </span>
            <span className="block text-[10px] text-emerald-600 font-medium -mt-0.5">
              MPI Compliance
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative group',
                isActive
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-500 rounded-r-full" />
              )}
              <span
                className={cn(
                  'transition-colors duration-200',
                  isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'
                )}
              >
                {item.icon}
              </span>
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-3 border-t border-gray-100">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl h-10 text-[13px] font-medium transition-all duration-200"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="h-[18px] w-[18px] mr-2.5" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
