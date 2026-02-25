'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface RecordTemperatureInput {
  equipmentId: string
  temperature: number
  notes?: string
  recordedBy: string
}

export async function recordTemperature(input: RecordTemperatureInput) {
  try {
    // Get equipment details
    const equipment = await prisma.equipment.findUnique({
      where: { id: input.equipmentId },
    })

    if (!equipment) {
      return { success: false, error: 'Equipment not found' }
    }

    // Check if temperature is compliant
    const isCompliant =
      input.temperature >= (equipment.minTemp || 0) &&
      input.temperature <= (equipment.maxTemp || 100)

    // Create the temperature record
    const record = await prisma.temperatureRecord.create({
      data: {
        equipmentId: input.equipmentId,
        recordedBy: input.recordedBy,
        temperature: input.temperature,
        notes: input.notes,
        isCompliant,
      },
    })

    // If non-compliant, create a corrective action task
    if (!isCompliant) {
      await prisma.correctiveAction.create({
        data: {
          recordId: record.id,
          assignedTo: input.recordedBy,
          description: `Temperature out of range for ${equipment.name}: ${input.temperature}°C (expected: ${equipment.minTemp}°C - ${equipment.maxTemp}°C)`,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Due in 24 hours
          status: 'PENDING',
        },
      })

      // Create notification for managers
      const storeUsers = await prisma.storeUser.findMany({
        where: {
          storeId: equipment.storeId,
          role: { in: ['MANAGER', 'OWNER'] },
        },
      })

      await prisma.notification.createMany({
        data: storeUsers.map((user) => ({
          userId: user.userId,
          type: 'TEMP_ALERT',
          title: 'Temperature Alert',
          message: `${equipment.name} recorded at ${input.temperature}°C (outside acceptable range)`,
          actionUrl: `/temperature`,
        })),
      })
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'TEMP_RECORD_CREATED',
        entityType: 'TemperatureRecord',
        entityId: record.id,
        userId: input.recordedBy,
        details: JSON.stringify({
          equipmentId: input.equipmentId,
          temperature: input.temperature,
          isCompliant,
        }),
      },
    })

    revalidatePath('/temperature')
    revalidatePath('/dashboard')

    return { success: true, data: record }
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
