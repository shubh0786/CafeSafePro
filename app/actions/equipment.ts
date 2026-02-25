'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { TemperatureCategory } from '@prisma/client'

interface CreateEquipmentInput {
  storeId: string
  name: string
  category: string
  location?: string
  minTemp?: number
  maxTemp?: number
  serialNumber?: string
}

export async function createEquipment(input: CreateEquipmentInput) {
  try {
    const equipment = await prisma.equipment.create({
      data: {
        storeId: input.storeId,
        name: input.name,
        category: input.category as TemperatureCategory,
        location: input.location,
        minTemp: input.minTemp,
        maxTemp: input.maxTemp,
        serialNumber: input.serialNumber,
        isActive: true,
      },
    })

    await prisma.auditLog.create({
      data: {
        action: 'EQUIPMENT_CREATED',
        entityType: 'Equipment',
        entityId: equipment.id,
        storeId: input.storeId,
        details: JSON.stringify({
          name: input.name,
          category: input.category,
        }),
      },
    })

    revalidatePath('/equipment')

    return { success: true, data: equipment }
  } catch (error) {
    console.error('Failed to create equipment:', error)
    return { success: false, error: 'Failed to create equipment' }
  }
}

export async function updateEquipment(
  equipmentId: string,
  data: Partial<CreateEquipmentInput>
) {
  try {
    const equipment = await prisma.equipment.update({
      where: { id: equipmentId },
      data: {
        ...data,
        category: data.category as TemperatureCategory,
      },
    })

    await prisma.auditLog.create({
      data: {
        action: 'EQUIPMENT_UPDATED',
        entityType: 'Equipment',
        entityId: equipmentId,
        storeId: equipment.storeId,
        details: JSON.stringify(data),
      },
    })

    revalidatePath('/equipment')

    return { success: true, data: equipment }
  } catch (error) {
    console.error('Failed to update equipment:', error)
    return { success: false, error: 'Failed to update equipment' }
  }
}

export async function scheduleMaintenance(
  equipmentId: string,
  nextServiceDate: Date
) {
  try {
    const equipment = await prisma.equipment.update({
      where: { id: equipmentId },
      data: {
        lastServiced: new Date(),
        nextService: nextServiceDate,
      },
    })

    await prisma.auditLog.create({
      data: {
        action: 'MAINTENANCE_SCHEDULED',
        entityType: 'Equipment',
        entityId: equipmentId,
        storeId: equipment.storeId,
        details: JSON.stringify({ nextService: nextServiceDate }),
      },
    })

    revalidatePath('/equipment')

    return { success: true, data: equipment }
  } catch (error) {
    console.error('Failed to schedule maintenance:', error)
    return { success: false, error: 'Failed to schedule maintenance' }
  }
}
