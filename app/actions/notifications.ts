'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getUnreadNotifications(userId: string) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return { success: true, data: notifications }
  } catch (error) {
    console.error('Failed to get notifications:', error)
    return { success: false, error: 'Failed to get notifications' }
  }
}

export async function getUnreadCount(userId: string) {
  try {
    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    })

    return { success: true, data: count }
  } catch (error) {
    console.error('Failed to get notification count:', error)
    return { success: false, error: 'Failed to get count' }
  }
}

export async function markNotificationRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
    return { success: false, error: 'Failed to update notification' }
  }
}

export async function markAllRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
    return { success: false, error: 'Failed to update notifications' }
  }
}
