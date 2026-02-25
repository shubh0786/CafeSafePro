'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getStatusColor, formatDateTime } from '@/lib/utils'
import {
  ClipboardList,
  Thermometer,
  CheckCircle,
  AlertCircle,
  Users,
  Wrench,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import Link from 'next/link'

interface DashboardContentProps {
  stats: {
    pendingTasks: number
    completedTasks: number
    todayTempRecords: number
    nonCompliantTemps: number
    equipmentCount: number
    staffCount: number
  }
  recentRecords: any[]
  userRole: string
  storeName: string
}

export function DashboardContent({
  stats,
  recentRecords,
  userRole,
  storeName,
}: DashboardContentProps) {
  const taskCompletionRate =
    stats.completedTasks + stats.pendingTasks > 0
      ? Math.round(
          (stats.completedTasks / (stats.completedTasks + stats.pendingTasks)) * 100
        )
      : 0

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-serif text-xl sm:text-2xl italic text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening at {storeName} today
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending Tasks</p>
            <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-1">{stats.pendingTasks}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{stats.completedTasks} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Temp Checks</p>
            <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-1">{stats.todayTempRecords}</p>
            <div className="flex items-center gap-1 mt-1">
              {stats.nonCompliantTemps > 0 ? (
                <span className="text-[10px] sm:text-xs text-red-500 font-medium">{stats.nonCompliantTemps} non-compliant</span>
              ) : (
                <span className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-medium">All compliant</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Equipment</p>
            <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-1">{stats.equipmentCount}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Active monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Staff</p>
            <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-1">{stats.staffCount}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Team members</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Task Completion */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Task Completion</CardTitle>
            <CardDescription>Today&apos;s progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{taskCompletionRate}%</span>
                  <span className="text-sm text-muted-foreground">{stats.completedTasks} / {stats.completedTasks + stats.pendingTasks}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${taskCompletionRate}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button asChild>
                  <Link href="/tasks">
                    View Tasks <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/tasks">Complete Tasks</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="ghost" asChild>
              <Link href="/temperature">
                <Thermometer className="mr-2 h-4 w-4" />
                Record Temperature
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="ghost" asChild>
              <Link href="/records">
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Checklist
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="ghost" asChild>
              <Link href="/stock">
                <AlertCircle className="mr-2 h-4 w-4" />
                Record Delivery
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Records */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Records</CardTitle>
                <CardDescription>Latest compliance records</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/records">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentRecords.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No records yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Start by creating your first compliance record</p>
                </div>
              ) : (
                recentRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between py-3 px-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-1 h-8 rounded-full flex-shrink-0 ${
                          record.status === 'COMPLIANT' ? 'bg-emerald-500'
                            : record.status === 'NON_COMPLIANT' ? 'bg-red-500'
                            : 'bg-amber-500'
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {record.type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {record.creator?.name || 'Unknown'} &middot; {formatDateTime(record.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(record.status)} flex-shrink-0 ml-2`}>
                      {record.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
