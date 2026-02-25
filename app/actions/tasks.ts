'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { TaskType } from '@prisma/client'

interface CompleteTaskInput {
  taskId: string
  completedBy: string
}

interface CreateTaskInput {
  storeId: string
  type: string
  title: string
  description?: string | null
  assignedTo?: string
  dueTime?: string | null
  priority?: string
  isRecurring?: boolean
  recurrence?: string | null
}

export async function completeTask(input: CompleteTaskInput) {
  try {
    const task = await prisma.task.update({
      where: { id: input.taskId },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        completedBy: input.completedBy,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'TASK_COMPLETED',
        entityType: 'Task',
        entityId: task.id,
        userId: input.completedBy,
        storeId: task.storeId,
        details: JSON.stringify({ taskTitle: task.title }),
      },
    })

    revalidatePath('/tasks')
    revalidatePath('/dashboard')

    return { success: true, data: task }
  } catch (error) {
    console.error('Failed to complete task:', error)
    return { success: false, error: 'Failed to complete task' }
  }
}

export async function createTask(input: CreateTaskInput) {
  try {
    const task = await prisma.task.create({
      data: {
        storeId: input.storeId,
        type: input.type as TaskType,
        title: input.title,
        description: input.description,
        assignedTo: input.assignedTo,
        dueTime: input.dueTime,
        priority: input.priority || 'NORMAL',
        isRecurring: input.isRecurring || false,
        recurrence: input.recurrence,
      },
    })

    revalidatePath('/tasks')

    return { success: true, data: task }
  } catch (error) {
    console.error('Failed to create task:', error)
    return { success: false, error: 'Failed to create task' }
  }
}

export async function getTasksByStore(storeId: string) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tasks = await prisma.task.findMany({
      where: {
        storeId,
        createdAt: {
          gte: today,
        },
      },
      include: {
        assignee: { select: { name: true } },
      },
      orderBy: [
        { isCompleted: 'asc' },
        { dueTime: 'asc' },
      ],
    })

    return { success: true, data: tasks }
  } catch (error) {
    console.error('Failed to get tasks:', error)
    return { success: false, error: 'Failed to get tasks' }
  }
}
