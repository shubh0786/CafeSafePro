import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Plus } from 'lucide-react'
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
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl italic text-foreground">Franchise Management</h1>
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
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Franchises</p>
              <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-1">{franchises.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Stores</p>
              <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-1">{totalStores}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Staff</p>
              <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-1">{totalUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Equipment</p>
              <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-1">{totalEquipment}</p>
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
                <div className="flex flex-col items-center justify-center py-12">
                  <Building2 className="h-6 w-6 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No franchises found.</p>
                </div>
              ) : (
                franchises.map((franchise) => (
                  <div
                    key={franchise.id}
                    className="flex items-center justify-between p-4 rounded-md hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center shrink-0">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{franchise.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {franchise._count.stores} stores
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <Badge className={franchise.isActive ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-border' : 'bg-muted/50 text-foreground border-border'}>
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
