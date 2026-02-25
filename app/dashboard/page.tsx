import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { FranchiseAdminDashboard } from '@/components/dashboard/franchise-admin-dashboard'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay } from 'date-fns'

async function getFranchiseAdminData(userId: string) {
  const today = new Date()
  const todayStart = startOfDay(today)
  const todayEnd = endOfDay(today)

  const storeUsers = await prisma.storeUser.findMany({
    where: { userId },
    include: { store: true },
  })

  const storeIds = storeUsers.map((su) => su.store.id)

  const stores = await Promise.all(
    storeUsers.map(async (su) => {
      const storeId = su.store.id

      const [pendingTasks, completedTasks, todayTempRecords, nonCompliantTemps, equipmentCount, staffCount, recentRecordCount] =
        await Promise.all([
          prisma.task.count({ where: { storeId, isCompleted: false } }),
          prisma.task.count({ where: { storeId, isCompleted: true, completedAt: { gte: todayStart, lte: todayEnd } } }),
          prisma.temperatureRecord.count({ where: { equipment: { storeId }, recordedAt: { gte: todayStart, lte: todayEnd } } }),
          prisma.temperatureRecord.count({ where: { equipment: { storeId }, recordedAt: { gte: todayStart, lte: todayEnd }, isCompliant: false } }),
          prisma.equipment.count({ where: { storeId, isActive: true } }),
          prisma.storeUser.count({ where: { storeId } }),
          prisma.record.count({ where: { storeId, createdAt: { gte: todayStart, lte: todayEnd } } }),
        ])

      return {
        id: storeId,
        name: su.store.name,
        address: su.store.address,
        staffCount,
        pendingTasks,
        completedTasks,
        todayTempRecords,
        nonCompliantTemps,
        equipmentCount,
        recentRecordCount,
      }
    })
  )

  const franchise = storeUsers[0]?.store.franchiseId
    ? await prisma.franchise.findUnique({ where: { id: storeUsers[0].store.franchiseId } })
    : null

  const totalStaff = await prisma.storeUser.count({ where: { storeId: { in: storeIds } } })

  const totalCompleted = stores.reduce((sum, s) => sum + s.completedTasks, 0)
  const totalTasks = stores.reduce((sum, s) => sum + s.completedTasks + s.pendingTasks, 0)
  const overallTaskCompletion = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0

  const totalTempRecords = stores.reduce((sum, s) => sum + s.todayTempRecords, 0)
  const totalNonCompliant = stores.reduce((sum, s) => sum + s.nonCompliantTemps, 0)
  const overallComplianceRate = totalTempRecords > 0
    ? Math.round(((totalTempRecords - totalNonCompliant) / totalTempRecords) * 100)
    : 100

  const alerts: { id: string; type: 'temperature' | 'task' | 'compliance'; message: string; storeName: string; createdAt: Date }[] = []

  stores.forEach((store) => {
    if (store.nonCompliantTemps > 0) {
      alerts.push({
        id: `temp-${store.id}`,
        type: 'temperature',
        message: `${store.nonCompliantTemps} non-compliant temperature reading${store.nonCompliantTemps > 1 ? 's' : ''} today`,
        storeName: store.name,
        createdAt: new Date(),
      })
    }
    const total = store.completedTasks + store.pendingTasks
    const rate = total > 0 ? (store.completedTasks / total) * 100 : 100
    if (rate < 50 && total > 0) {
      alerts.push({
        id: `task-${store.id}`,
        type: 'task',
        message: `Task completion below 50% (${Math.round(rate)}%)`,
        storeName: store.name,
        createdAt: new Date(),
      })
    }
  })

  return {
    franchiseName: franchise?.name || 'Your Franchise',
    stores,
    alerts,
    totalStores: stores.length,
    totalStaff,
    overallComplianceRate,
    overallTaskCompletion,
  }
}

async function getStoreDashboardData(storeId: string) {
  const today = new Date()
  const todayStart = startOfDay(today)
  const todayEnd = endOfDay(today)

  const [pendingTasks, completedTasks, todayTempRecords, recentRecords, equipmentCount, staffCount] =
    await Promise.all([
      prisma.task.count({ where: { storeId, isCompleted: false, createdAt: { gte: todayStart, lte: todayEnd } } }),
      prisma.task.count({ where: { storeId, isCompleted: true, completedAt: { gte: todayStart, lte: todayEnd } } }),
      prisma.temperatureRecord.count({ where: { equipment: { storeId }, recordedAt: { gte: todayStart, lte: todayEnd } } }),
      prisma.record.findMany({ where: { storeId }, orderBy: { createdAt: 'desc' }, take: 5, include: { creator: { select: { name: true } } } }),
      prisma.equipment.count({ where: { storeId, isActive: true } }),
      prisma.storeUser.count({ where: { storeId } }),
    ])

  const nonCompliantTemps = await prisma.temperatureRecord.count({
    where: { equipment: { storeId }, recordedAt: { gte: todayStart, lte: todayEnd }, isCompliant: false },
  })

  return { pendingTasks, completedTasks, todayTempRecords, nonCompliantTemps, equipmentCount, staffCount, recentRecords }
}

export default async function DashboardPage() {
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
            You don&apos;t have access to any stores. Please contact your administrator.
          </p>
        </div>
      </DashboardShell>
    )
  }

  if (session.user.role === 'FRANCHISE_ADMIN') {
    const data = await getFranchiseAdminData(session.user.id)
    return (
      <DashboardShell>
        <FranchiseAdminDashboard {...data} />
      </DashboardShell>
    )
  }

  const storeId = userStore.id
  const data = await getStoreDashboardData(storeId)

  return (
    <DashboardShell>
      <DashboardContent
        stats={{
          pendingTasks: data.pendingTasks,
          completedTasks: data.completedTasks,
          todayTempRecords: data.todayTempRecords,
          nonCompliantTemps: data.nonCompliantTemps,
          equipmentCount: data.equipmentCount,
          staffCount: data.staffCount,
        }}
        recentRecords={data.recentRecords}
        userRole={session.user.role}
        storeName={userStore.name}
      />
    </DashboardShell>
  )
}
