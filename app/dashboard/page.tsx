import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay } from 'date-fns'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  // Get the first store for the user if none selected
  const userStore = session.user.stores?.[0]
  if (!userStore) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold mb-2">No Store Access</h2>
          <p className="text-muted-foreground">
            You don&apos;t have access to any stores. Please contact your administrator.
          </p>
        </div>
      </DashboardShell>
    )
  }

  const storeId = userStore.id
  const today = new Date()
  const todayStart = startOfDay(today)
  const todayEnd = endOfDay(today)

  // Fetch dashboard data
  const [
    pendingTasks,
    completedTasks,
    todayTempRecords,
    recentRecords,
    equipmentCount,
    staffCount,
  ] = await Promise.all([
    // Pending tasks
    prisma.task.count({
      where: {
        storeId,
        isCompleted: false,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),
    // Completed tasks
    prisma.task.count({
      where: {
        storeId,
        isCompleted: true,
        completedAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),
    // Today's temperature records
    prisma.temperatureRecord.count({
      where: {
        equipment: { storeId },
        recordedAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),
    // Recent records
    prisma.record.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        creator: { select: { name: true } },
      },
    }),
    // Equipment count
    prisma.equipment.count({
      where: { storeId, isActive: true },
    }),
    // Staff count
    prisma.storeUser.count({
      where: { storeId },
    }),
  ])

  // Get non-compliant temperature records
  const nonCompliantTemps = await prisma.temperatureRecord.count({
    where: {
      equipment: { storeId },
      recordedAt: {
        gte: todayStart,
        lte: todayEnd,
      },
      isCompliant: false,
    },
  })

  return (
    <DashboardShell>
      <DashboardContent
        stats={{
          pendingTasks,
          completedTasks,
          todayTempRecords,
          nonCompliantTemps,
          equipmentCount,
          staffCount,
        }}
        recentRecords={recentRecords}
        userRole={session.user.role}
        storeName={userStore.name}
      />
    </DashboardShell>
  )
}
