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
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ['STAFF', 'MANAGER', 'OWNER', 'FRANCHISE_ADMIN'],
  },
  {
    title: 'Daily Tasks',
    href: '/tasks',
    icon: <ClipboardList className="h-5 w-5" />,
    roles: ['STAFF', 'MANAGER', 'OWNER'],
  },
  {
    title: 'Temperature',
    href: '/temperature',
    icon: <Thermometer className="h-5 w-5" />,
    roles: ['STAFF', 'MANAGER', 'OWNER'],
  },
  {
    title: 'Records',
    href: '/records',
    icon: <FileText className="h-5 w-5" />,
    roles: ['STAFF', 'MANAGER', 'OWNER'],
  },
  {
    title: 'Stock & Traceability',
    href: '/stock',
    icon: <Package className="h-5 w-5" />,
    roles: ['STAFF', 'MANAGER', 'OWNER'],
  },
  {
    title: 'Pest Control',
    href: '/pest-control',
    icon: <Bug className="h-5 w-5" />,
    roles: ['STAFF', 'MANAGER', 'OWNER'],
  },
  {
    title: 'Equipment',
    href: '/equipment',
    icon: <Wrench className="h-5 w-5" />,
    roles: ['MANAGER', 'OWNER'],
  },
  {
    title: 'Staff',
    href: '/staff',
    icon: <Users className="h-5 w-5" />,
    roles: ['MANAGER', 'OWNER', 'FRANCHISE_ADMIN'],
  },
  {
    title: 'Stores',
    href: '/stores',
    icon: <Store className="h-5 w-5" />,
    roles: ['OWNER', 'FRANCHISE_ADMIN'],
  },
  {
    title: 'Franchise',
    href: '/franchise',
    icon: <Building2 className="h-5 w-5" />,
    roles: ['FRANCHISE_ADMIN'],
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: <FileText className="h-5 w-5" />,
    roles: ['MANAGER', 'OWNER', 'FRANCHISE_ADMIN'],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
    roles: ['OWNER', 'FRANCHISE_ADMIN'],
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
    <div className={cn('flex flex-col h-full bg-card border-r', className)}>
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">C</span>
          </div>
          <span className="font-bold text-lg">CafeSafe Pro</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
