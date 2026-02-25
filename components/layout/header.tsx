'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { getRoleLabel, getRoleColor } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, Bell, Check, AlertTriangle, Thermometer, ClipboardList, X } from 'lucide-react'
import { useStore } from '@/lib/store'
import {
  getUnreadNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllRead,
} from '@/app/actions/notifications'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  actionUrl: string | null
  createdAt: Date
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'TEMP_ALERT':
      return <Thermometer className="h-4 w-4 text-red-500 flex-shrink-0" />
    case 'TASK_OVERDUE':
      return <ClipboardList className="h-4 w-4 text-yellow-500 flex-shrink-0" />
    default:
      return <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
  }
}

function timeAgo(date: Date) {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

export function Header() {
  const { data: session } = useSession()
  const { selectedStore } = useStore()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const user = session?.user
  const userId = user?.id
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  useEffect(() => {
    if (!userId) return
    getUnreadCount(userId).then((res) => {
      if (res.success) setUnreadCount(res.data ?? 0)
    })
  }, [userId])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleOpen() {
    if (!userId) return
    setIsOpen(!isOpen)
    if (!isOpen) {
      setLoading(true)
      const res = await getUnreadNotifications(userId)
      if (res.success) setNotifications(res.data ?? [])
      setLoading(false)
    }
  }

  async function handleMarkRead(notificationId: string, actionUrl: string | null) {
    await markNotificationRead(notificationId)
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    setUnreadCount((prev) => Math.max(0, prev - 1))
    if (actionUrl) {
      setIsOpen(false)
      router.push(actionUrl)
    }
  }

  async function handleMarkAllRead() {
    if (!userId) return
    await markAllRead(userId)
    setNotifications([])
    setUnreadCount(0)
  }

  return (
    <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {selectedStore && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span className="font-medium text-foreground">{selectedStore.name}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleOpen}
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-card border rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                <h3 className="font-semibold text-sm">Notifications</h3>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto py-1 px-2 text-xs"
                    onClick={handleMarkAllRead}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No unread notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0 transition-colors"
                      onClick={() => handleMarkRead(notification.id, notification.actionUrl)}
                    >
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {timeAgo(notification.createdAt)}
                        </p>
                      </div>
                      <button
                        className="p-1 text-muted-foreground hover:text-foreground flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkRead(notification.id, null)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name}</p>
            <Badge className={getRoleColor(user?.role || '')}>
              {getRoleLabel(user?.role || '')}
            </Badge>
          </div>
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
