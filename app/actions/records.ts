'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { RecordType, ComplianceStatus } from '@prisma/client'

interface CreateRecordInput {
  storeId: string
  type: string
  notes?: string
  createdBy: string
  details: { key: string; value: string }[]
}

export async function createRecord(input: CreateRecordInput) {
  try {
    const record = await prisma.record.create({
      data: {
        storeId: input.storeId,
        type: input.type as RecordType,
        notes: input.notes,
        createdBy: input.createdBy,
        status: 'COMPLIANT',
        details: {
          create: input.details.map((detail) => ({
            key: detail.key,
            value: detail.value,
          })),
        },
      },
      include: {
        details: true,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'RECORD_CREATED',
        entityType: 'Record',
        entityId: record.id,
        userId: input.createdBy,
        storeId: input.storeId,
        details: JSON.stringify({
          type: input.type,
          detailsCount: input.details.length,
        }),
      },
    })

    revalidatePath('/records')
    revalidatePath('/dashboard')

    return { success: true, data: record }
  } catch (error) {
    console.error('Failed to create record:', error)
    return { success: false, error: 'Failed to create record' }
  }
}

export async function getRecordsByStore(storeId: string) {
  try {
    const records = await prisma.record.findMany({
      where: { storeId },
      include: {
        creator: { select: { name: true } },
        details: true,
        correctiveActions: {
          include: {
            assignee: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, data: records }
  } catch (error) {
    console.error('Failed to get records:', error)
    return { success: false, error: 'Failed to get records' }
  }
}

export async function updateRecordStatus(
  recordId: string,
  status: ComplianceStatus,
  userId: string
) {
  try {
    const record = await prisma.record.update({
      where: { id: recordId },
      data: {
        status,
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
    })

    await prisma.auditLog.create({
      data: {
        action: 'RECORD_REVIEWED',
        entityType: 'Record',
        entityId: recordId,
        userId,
        storeId: record.storeId,
        details: JSON.stringify({ newStatus: status }),
      },
    })

    revalidatePath('/records')

    return { success: true, data: record }
  } catch (error) {
    console.error('Failed to update record:', error)
    return { success: false, error: 'Failed to update record' }
  }
}
