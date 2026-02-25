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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Store Management</h1>
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
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stores.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stores.filter((s) => s.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stores.reduce((acc, s) => acc + s._count.storeUsers, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipment</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stores.reduce((acc, s) => acc + s._count.equipment, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stores List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.length === 0 ? (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="py-12 text-center">
                <Store className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No stores found.</p>
              </CardContent>
            </Card>
          ) : (
            stores.map((store) => (
              <Card key={store.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <Badge className={store.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {store.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
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
                  <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
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
                    <Button variant="outline" className="flex-1" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" className="flex-1" size="sm">
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
