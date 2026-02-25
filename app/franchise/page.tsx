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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Franchise Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage multiple stores across your franchise group
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Franchise
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Franchises</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{franchises.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStores}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipment</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEquipment}</div>
            </CardContent>
          </Card>
        </div>

        {/* Franchises List */}
        <Card>
          <CardHeader>
            <CardTitle>Franchise Groups</CardTitle>
            <CardDescription>
              Manage your franchise organizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {franchises.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No franchises found.
                </p>
              ) : (
                franchises.map((franchise) => (
                  <div
                    key={franchise.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{franchise.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {franchise._count.stores} stores
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={franchise.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {franchise.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button variant="outline" size="sm">
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
          <Card>
            <CardHeader>
              <CardTitle>Franchise-wide Reports</CardTitle>
              <CardDescription>
                View consolidated reports across all stores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Generate reports that aggregate data from all stores in your franchise.
                Compare compliance metrics and identify trends across locations.
              </p>
              <Button variant="outline" className="w-full">
                View Franchise Reports
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Standard Templates</CardTitle>
              <CardDescription>
                Manage task schedules and checklists for all stores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create standardized schedules and checklists that can be applied to
                multiple stores. Ensure consistent compliance practices.
              </p>
              <Button variant="outline" className="w-full">
                Manage Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
