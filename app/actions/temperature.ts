'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ComplianceStatus, RecordType } from '@prisma/client'

interface RecordTemperatureInput {
  equipmentId: string
  temperature: number
  notes?: string
  recordedBy: string
}

export async function recordTemperature(input: RecordTemperatureInput) {
  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id: input.equipmentId },
      include: { store: { select: { name: true } } },
    })

    if (!equipment) {
      return { success: false, error: 'Equipment not found' }
    }

    const isCompliant =
      input.temperature >= (equipment.minTemp || 0) &&
      input.temperature <= (equipment.maxTemp || 100)

    const tempRecord = await prisma.temperatureRecord.create({
      data: {
        equipmentId: input.equipmentId,
        recordedBy: input.recordedBy,
        temperature: input.temperature,
        notes: input.notes,
        isCompliant,
      },
    })

    if (!isCompliant) {
      const complianceRecord = await prisma.record.create({
        data: {
          storeId: equipment.storeId,
          type: RecordType.TEMPERATURE,
          createdBy: input.recordedBy,
          status: ComplianceStatus.NON_COMPLIANT,
          notes: `Non-compliant temperature: ${equipment.name} recorded at ${input.temperature}°C (acceptable: ${equipment.minTemp}°C – ${equipment.maxTemp}°C)`,
          details: {
            create: [
              { key: 'Equipment', value: equipment.name },
              { key: 'Temperature', value: `${input.temperature}°C` },
              { key: 'Acceptable Range', value: `${equipment.minTemp}°C – ${equipment.maxTemp}°C` },
              { key: 'Location', value: equipment.location || 'N/A' },
            ],
          },
        },
      })

      await prisma.correctiveAction.create({
        data: {
          recordId: complianceRecord.id,
          assignedTo: input.recordedBy,
          description: `Temperature out of range for ${equipment.name}: ${input.temperature}°C (expected: ${equipment.minTemp}°C – ${equipment.maxTemp}°C). Check equipment and take corrective action.`,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: 'PENDING',
        },
      })

      const managementUsers = await prisma.storeUser.findMany({
        where: {
          storeId: equipment.storeId,
          role: { in: ['MANAGER', 'OWNER', 'FRANCHISE_ADMIN'] },
        },
      })

      if (managementUsers.length > 0) {
        await prisma.notification.createMany({
          data: managementUsers.map((su) => ({
            userId: su.userId,
            type: 'TEMP_ALERT',
            title: `Temperature Alert – ${equipment.store.name}`,
            message: `${equipment.name} recorded at ${input.temperature}°C (outside ${equipment.minTemp}°C – ${equipment.maxTemp}°C range). Corrective action required.`,
            actionUrl: '/temperature',
          })),
        })
      }
    }

    await prisma.auditLog.create({
      data: {
        action: 'TEMP_RECORD_CREATED',
        entityType: 'TemperatureRecord',
        entityId: tempRecord.id,
        userId: input.recordedBy,
        storeId: equipment.storeId,
        details: JSON.stringify({
          equipmentId: input.equipmentId,
          equipmentName: equipment.name,
          temperature: input.temperature,
          isCompliant,
        }),
      },
    })

    revalidatePath('/temperature')
    revalidatePath('/dashboard')

    return { success: true, data: tempRecord }
  } catch (error) {
    console.error('Failed to record temperature:', error)
    return { success: false, error: 'Failed to record temperature' }
  }
}

export async function getTemperatureStats(storeId: string) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [totalRecords, nonCompliantRecords, equipmentCount] = await Promise.all([
      prisma.temperatureRecord.count({
        where: {
          equipment: { storeId },
          recordedAt: { gte: today },
        },
      }),
      prisma.temperatureRecord.count({
        where: {
          equipment: { storeId },
          recordedAt: { gte: today },
          isCompliant: false,
        },
      }),
      prisma.equipment.count({
        where: { storeId, isActive: true },
      }),
    ])

    return {
      success: true,
      data: {
        totalRecords,
        nonCompliantRecords,
        equipmentCount,
        complianceRate:
          totalRecords > 0
            ? Math.round(((totalRecords - nonCompliantRecords) / totalRecords) * 100)
            : 100,
      },
    }
  } catch (error) {
    console.error('Failed to get temperature stats:', error)
    return { success: false, error: 'Failed to get statistics' }
  }
}
