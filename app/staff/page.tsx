import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Plus, Mail, Phone, UserCheck, UserCog, UserPlus } from 'lucide-react'
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Store Access</h2>
          <p className="text-gray-500">
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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Staff Management</h1>
            <p className="text-gray-500 mt-1">
              Manage staff members and their access levels
            </p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Add Staff Member
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Staff</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{storeUsers.length}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Active</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-2">
                    {storeUsers.filter((su) => su.user.isActive).length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UserCheck className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Managers</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {storeUsers.filter((su) => su.role === 'MANAGER').length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UserCog className="h-5 w-5 text-violet-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Staff</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {storeUsers.filter((su) => su.role === 'STAFF').length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UserPlus className="h-5 w-5 text-sky-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff List */}
        <Card className="border-0 shadow-soft bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-gray-900">Staff Members</CardTitle>
            <CardDescription>
              All staff with access to this store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {storeUsers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No staff members found</p>
                </div>
              ) : (
                storeUsers.map((storeUser) => (
                  <div
                    key={storeUser.id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm">
                        <span className="text-white font-semibold text-sm">
                          {storeUser.user.name
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{storeUser.user.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                          <Mail className="h-3 w-3" />
                          {storeUser.user.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleColor(storeUser.role)}>
                        {getRoleLabel(storeUser.role)}
                      </Badge>
                      <Badge
                        className={
                          storeUser.user.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-gray-50 text-gray-600 border-gray-100'
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
