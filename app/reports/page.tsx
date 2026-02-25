import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { ReportsContent } from '@/components/reports/reports-content'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns'

export default async function ReportsPage() {
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
  const thisMonthStart = startOfMonth(today)
  const thisMonthEnd = endOfMonth(today)

  // Get this month's stats
  const [
    thisMonthRecords,
    thisMonthTempRecords,
    thisMonthNonCompliantTemps,
    thisMonthTasks,
    thisMonthCompletedTasks,
    allRecords,
  ] = await Promise.all([
    prisma.record.count({
      where: {
        storeId,
        createdAt: { gte: thisMonthStart, lte: thisMonthEnd },
      },
    }),
    prisma.temperatureRecord.count({
      where: {
        equipment: { storeId },
        recordedAt: { gte: thisMonthStart, lte: thisMonthEnd },
      },
    }),
    prisma.temperatureRecord.count({
      where: {
        equipment: { storeId },
        recordedAt: { gte: thisMonthStart, lte: thisMonthEnd },
        isCompliant: false,
      },
    }),
    prisma.task.count({
      where: {
        storeId,
        createdAt: { gte: thisMonthStart, lte: thisMonthEnd },
      },
    }),
    prisma.task.count({
      where: {
        storeId,
        createdAt: { gte: thisMonthStart, lte: thisMonthEnd },
        isCompleted: true,
      },
    }),
    prisma.record.findMany({
      where: { storeId },
      include: {
        creator: { select: { name: true } },
        details: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
  ])

  return (
    <DashboardShell>
      <ReportsContent
        stats={{
          thisMonthRecords,
          thisMonthTempRecords,
          thisMonthNonCompliantTemps,
          thisMonthTasks,
          thisMonthCompletedTasks,
        }}
        records={allRecords}
        storeName={userStore.name}
      />
    </DashboardShell>
  )
}
