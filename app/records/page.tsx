import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { RecordsContent } from '@/components/records/records-content'
import { prisma } from '@/lib/prisma'

export default async function RecordsPage() {
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

  // Get recent records
  const records = await prisma.record.findMany({
    where: { storeId },
    include: {
      creator: { select: { name: true } },
      details: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  // Get corrective actions
  const correctiveActions = await prisma.correctiveAction.findMany({
    where: {
      record: { storeId },
      status: { in: ['PENDING', 'OVERDUE'] },
    },
    include: {
      record: {
        include: {
          creator: { select: { name: true } },
          details: true,
        },
      },
      assignee: { select: { name: true } },
    },
    orderBy: { dueDate: 'asc' },
  })

  const serializedRecords = JSON.parse(JSON.stringify(records))
  const serializedActions = JSON.parse(JSON.stringify(correctiveActions))

  return (
    <DashboardShell>
      <RecordsContent
        records={serializedRecords}
        correctiveActions={serializedActions}
        storeId={storeId}
        userId={session.user.id}
        userRole={session.user.role}
      />
    </DashboardShell>
  )
}
