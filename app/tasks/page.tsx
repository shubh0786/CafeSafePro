import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { TasksContent } from '@/components/tasks/tasks-content'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay } from 'date-fns'

export default async function TasksPage() {
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

  // Get today's tasks
  const tasks = await prisma.task.findMany({
    where: {
      storeId,
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
    include: {
      assignee: { select: { id: true, name: true } },
    },
    orderBy: [
      { isCompleted: 'asc' },
      { dueTime: 'asc' },
    ],
  })

  // Get store staff for assignment
  const storeUsers = await prisma.storeUser.findMany({
    where: { storeId },
    include: {
      user: { select: { id: true, name: true, role: true } },
    },
  })

  // Get schedules for creating new tasks
  const schedules = await prisma.schedule.findMany({
    where: { storeId, isActive: true },
    include: {
      items: { orderBy: { order: 'asc' } },
    },
  })

  return (
    <DashboardShell>
      <TasksContent
        tasks={tasks}
        storeUsers={storeUsers.map((su) => su.user)}
        schedules={schedules}
        storeId={storeId}
        userId={session.user.id}
        userRole={session.user.role}
      />
    </DashboardShell>
  )
}
