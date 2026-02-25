import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { EquipmentContent } from '@/components/equipment/equipment-content'
import { prisma } from '@/lib/prisma'

export default async function EquipmentPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const userStore = session.user.stores?.[0]
  if (!userStore) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold mb-2">No Store Access</h2>
          <p className="text-muted-foreground">
            You don&apos;t have access to any stores.
          </p>
        </div>
      </DashboardShell>
    )
  }

  const storeId = userStore.id

  // Get all equipment
  const equipment = await prisma.equipment.findMany({
    where: { storeId },
    include: {
      tempRecords: {
        orderBy: { recordedAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <DashboardShell>
      <EquipmentContent
        equipment={equipment}
        storeId={storeId}
        userRole={session.user.role}
      />
    </DashboardShell>
  )
}
