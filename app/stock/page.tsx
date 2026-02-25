import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { StockContent } from '@/components/stock/stock-content'
import { prisma } from '@/lib/prisma'

export default async function StockPage() {
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

  // Get stock items
  const stockItems = await prisma.stockItem.findMany({
    where: { storeId },
    include: {
      supplier: true,
    },
    orderBy: { receivedDate: 'desc' },
  })

  // Get suppliers
  const suppliers = await prisma.supplier.findMany({
    where: { storeId },
    orderBy: { name: 'asc' },
  })

  return (
    <DashboardShell>
      <StockContent
        stockItems={stockItems}
        suppliers={suppliers}
        storeId={storeId}
        userId={session.user.id}
      />
    </DashboardShell>
  )
}
