'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface AddStockItemInput {
  storeId: string
  supplierId?: string
  name: string
  batchNumber?: string
  quantity: number
  unit: string
  expiryDate?: string
}

export async function addStockItem(input: AddStockItemInput) {
  try {
    const stockItem = await prisma.stockItem.create({
      data: {
        storeId: input.storeId,
        supplierId: input.supplierId,
        name: input.name,
        batchNumber: input.batchNumber,
        quantity: input.quantity,
        unit: input.unit,
        expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'STOCK_ITEM_ADDED',
        entityType: 'StockItem',
        entityId: stockItem.id,
        storeId: input.storeId,
        details: JSON.stringify({
          name: input.name,
          quantity: input.quantity,
          supplierId: input.supplierId,
        }),
      },
    })

    revalidatePath('/stock')
    revalidatePath('/dashboard')

    return { success: true, data: stockItem }
  } catch (error) {
    console.error('Failed to add stock item:', error)
    return { success: false, error: 'Failed to add stock item' }
  }
}

export async function markStockAsUsed(stockItemId: string, userId: string) {
  try {
    const stockItem = await prisma.stockItem.update({
      where: { id: stockItemId },
      data: {
        isUsed: true,
        usedDate: new Date(),
      },
    })

    await prisma.auditLog.create({
      data: {
        action: 'STOCK_ITEM_USED',
        entityType: 'StockItem',
        entityId: stockItemId,
        userId,
        storeId: stockItem.storeId,
        details: JSON.stringify({ name: stockItem.name }),
      },
    })

    revalidatePath('/stock')

    return { success: true, data: stockItem }
  } catch (error) {
    console.error('Failed to mark stock as used:', error)
    return { success: false, error: 'Failed to update stock item' }
  }
}

export async function getStockStats(storeId: string) {
  try {
    const today = new Date()
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)

    const [totalItems, activeItems, expiringSoon] = await Promise.all([
      prisma.stockItem.count({ where: { storeId } }),
      prisma.stockItem.count({ where: { storeId, isUsed: false } }),
      prisma.stockItem.count({
        where: {
          storeId,
          isUsed: false,
          expiryDate: {
            lte: threeDaysFromNow,
            gte: today,
          },
        },
      }),
    ])

    return {
      success: true,
      data: {
        totalItems,
        activeItems,
        expiringSoon,
      },
    }
  } catch (error) {
    console.error('Failed to get stock stats:', error)
    return { success: false, error: 'Failed to get statistics' }
  }
}
