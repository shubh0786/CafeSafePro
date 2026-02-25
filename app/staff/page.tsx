import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Plus, Mail } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getRoleLabel, getRoleColor } from '@/lib/utils'

export default async function StaffPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const userStore = session.user.stores?.[0]
  if (!userStore) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">No Store Access</h2>
          <p className="text-muted-foreground">
            You don&apos;t have access to any stores.
          </p>
        </div>
      </DashboardShell>
    )
  }

  const storeId = userStore.id

  const storeUsers = await prisma.storeUser.findMany({
    where: { storeId },
    include: {
      user: true,
    },
  })

  return (
    <DashboardShell>
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl italic text-foreground">Staff Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage staff members and their access levels
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Staff Member
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Staff</p>
              <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-1">{storeUsers.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Active</p>
              <p className="text-2xl sm:text-3xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                {storeUsers.filter((su) => su.user.isActive).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Managers</p>
              <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-1">
                {storeUsers.filter((su) => su.role === 'MANAGER').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Staff</p>
              <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-1">
                {storeUsers.filter((su) => su.role === 'STAFF').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Staff List */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-foreground">Staff Members</CardTitle>
            <CardDescription>
              All staff with access to this store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {storeUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-6 w-6 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">No staff members found</p>
                </div>
              ) : (
                storeUsers.map((storeUser) => (
                  <div
                    key={storeUser.id}
                    className="flex items-center justify-between p-4 rounded-md hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {storeUser.user.name
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{storeUser.user.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{storeUser.user.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={getRoleColor(storeUser.role)}>
                        {getRoleLabel(storeUser.role)}
                      </Badge>
                      <Badge
                        className={
                          storeUser.user.isActive
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-border'
                            : 'bg-muted/50 text-foreground border-border'
                        }
                      >
                        {storeUser.user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
