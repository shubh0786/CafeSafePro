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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Store Management</h1>
            <p className="text-gray-500 mt-1">
              Manage your cafe locations and their settings
            </p>
          </div>
          {userRole === 'FRANCHISE_ADMIN' && (
            <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Add New Store
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Stores</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stores.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Store className="h-5 w-5 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Active</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">
                  {stores.filter((s) => s.isActive).length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Store className="h-5 w-5 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Staff</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stores.reduce((acc, s) => acc + s._count.storeUsers, 0)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Store className="h-5 w-5 text-sky-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Equipment</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stores.reduce((acc, s) => acc + s._count.equipment, 0)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Store className="h-5 w-5 text-violet-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stores List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.length === 0 ? (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Store className="h-6 w-6 text-gray-500" />
                </div>
                <p className="text-gray-500 font-medium">No stores found.</p>
              </CardContent>
            </Card>
          ) : (
            stores.map((store) => (
              <Card key={store.id} className="border-0 shadow-soft bg-white hover:shadow-soft-md transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <Badge className={store.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-50 text-gray-600 border border-gray-100'}>
                      {store.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1 text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {store.address}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Phone className="h-4 w-4" />
                      {store.phone || 'No phone'}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Mail className="h-4 w-4" />
                      {store.email || 'No email'}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <FileText className="h-4 w-4" />
                      {store.registrationNumber || 'No registration'}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{store._count.storeUsers}</p>
                      <p className="text-xs text-gray-400">Staff</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{store._count.equipment}</p>
                      <p className="text-xs text-gray-400">Equipment</p>
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
