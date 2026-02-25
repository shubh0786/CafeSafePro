import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Store, Plus, MapPin, Phone, Mail, FileText } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export default async function StoresPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  // Only owners and franchise admins can see all stores
  const userRole = session.user.role
  const canManageAll = ['OWNER', 'FRANCHISE_ADMIN'].includes(userRole)

  if (!canManageAll) {
    redirect('/dashboard')
  }

  // Get stores based on role
  let stores
  if (userRole === 'FRANCHISE_ADMIN') {
    // Get all stores in the franchise
    stores = await prisma.store.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            storeUsers: true,
            equipment: true,
          },
        },
      },
    })
  } else {
    // Get stores where user is owner
    const userStores = session.user.stores?.filter((s) => s.role === 'OWNER') || []
    stores = await prisma.store.findMany({
      where: {
        id: { in: userStores.map((s) => s.id) },
        isActive: true,
      },
      include: {
        _count: {
          select: {
            storeUsers: true,
            equipment: true,
          },
        },
      },
    })
  }

  return (
    <DashboardShell>
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl italic text-foreground">Store Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage your cafe locations and their settings
            </p>
          </div>
          {userRole === 'FRANCHISE_ADMIN' && (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Store
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Stores</p>
              <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-1">{stores.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Active</p>
              <p className="text-2xl sm:text-3xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                {stores.filter((s) => s.isActive).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Staff</p>
              <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-1">
                {stores.reduce((acc, s) => acc + s._count.storeUsers, 0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Equipment</p>
              <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-1">
                {stores.reduce((acc, s) => acc + s._count.equipment, 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stores List */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {stores.length === 0 ? (
            <Card className="sm:col-span-2 lg:col-span-3">
              <CardContent className="py-12 text-center">
                <Store className="h-6 w-6 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No stores found.</p>
              </CardContent>
            </Card>
          ) : (
            stores.map((store) => (
              <Card key={store.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <Badge className={store.isActive ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-border' : 'bg-muted/50 text-foreground border border-border'}>
                      {store.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {store.address}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {store.phone || 'No phone'}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {store.email || 'No email'}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {store.registrationNumber || 'No registration'}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{store._count.storeUsers}</p>
                      <p className="text-xs text-muted-foreground">Staff</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{store._count.equipment}</p>
                      <p className="text-xs text-muted-foreground">Equipment</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-lg" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-lg" size="sm">
                      Edit Store
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
