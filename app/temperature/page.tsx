import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { TemperatureContent } from '@/components/temperature/temperature-content'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay } from 'date-fns'

export default async function TemperaturePage() {
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
  const today = new Date()
  const todayStart = startOfDay(today)
  const todayEnd = endOfDay(today)

  // Get all equipment for this store
  const equipment = await prisma.equipment.findMany({
    where: { storeId, isActive: true },
    orderBy: { category: 'asc' },
  })

  // Get today's temperature records
  const todayRecords = await prisma.temperatureRecord.findMany({
    where: {
      equipment: { storeId },
      recordedAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
    include: {
      equipment: true,
      user: { select: { name: true } },
    },
    orderBy: { recordedAt: 'desc' },
  })

  // Get recent records (last 7 days)
  const recentRecords = await prisma.temperatureRecord.findMany({
    where: {
      equipment: { storeId },
      recordedAt: {
        gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    include: {
      equipment: true,
      user: { select: { name: true } },
    },
    orderBy: { recordedAt: 'desc' },
    take: 50,
  })

  return (
    <DashboardShell>
      <TemperatureContent
        equipment={equipment}
        todayRecords={todayRecords}
        recentRecords={recentRecords}
        storeId={storeId}
        userId={session.user.id}
      />
    </DashboardShell>
  )
}
