import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Plus, Store, Users, TrendingUp } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export default async function FranchisePage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'FRANCHISE_ADMIN') {
    redirect('/dashboard')
  }

  // Get all franchises
  const franchises = await prisma.franchise.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          stores: true,
        },
      },
    },
  })

  // Get total stats across all stores
  const totalStores = await prisma.store.count()
  const totalUsers = await prisma.storeUser.count()
  const totalEquipment = await prisma.equipment.count()

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Franchise Management</h1>
            <p className="text-gray-500 mt-1">
              Manage multiple stores across your franchise group
            </p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Add Franchise
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
            <CardContent className="p-5 flex items-start justify-between">
              <div>
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Franchises</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">{franchises.length}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Building2 className="h-5 w-5 text-rose-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
            <CardContent className="p-5 flex items-start justify-between">
              <div>
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Stores</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">{totalStores}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Store className="h-5 w-5 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
            <CardContent className="p-5 flex items-start justify-between">
              <div>
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Staff</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">{totalUsers}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="h-5 w-5 text-sky-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
            <CardContent className="p-5 flex items-start justify-between">
              <div>
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Equipment</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">{totalEquipment}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-5 w-5 text-violet-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Franchises List */}
        <Card className="border-0 shadow-soft bg-white">
          <CardHeader>
            <CardTitle>Franchise Groups</CardTitle>
            <CardDescription>
              Manage your franchise organizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {franchises.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No franchises found.</p>
                </div>
              ) : (
                franchises.map((franchise) => (
                  <div
                    key={franchise.id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{franchise.name}</p>
                        <p className="text-sm text-gray-500">
                          {franchise._count.stores} stores
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={franchise.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-600 border-gray-100'}>
                        {franchise.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Franchise-wide Features */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-0 shadow-soft bg-white">
            <CardHeader>
              <CardTitle>Franchise-wide Reports</CardTitle>
              <CardDescription>
                View consolidated reports across all stores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Generate reports that aggregate data from all stores in your franchise.
                Compare compliance metrics and identify trends across locations.
              </p>
              <Button variant="outline" className="w-full rounded-xl border-gray-200">
                View Franchise Reports
              </Button>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft bg-white">
            <CardHeader>
              <CardTitle>Standard Templates</CardTitle>
              <CardDescription>
                Manage task schedules and checklists for all stores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Create standardized schedules and checklists that can be applied to
                multiple stores. Ensure consistent compliance practices.
              </p>
              <Button variant="outline" className="w-full rounded-xl border-gray-200">
                Manage Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
