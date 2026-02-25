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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening at {storeName} today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedTasks} completed today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature Checks</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayTempRecords}</div>
            <div className="flex items-center gap-1 text-xs">
              {stats.nonCompliantTemps > 0 ? (
                <>
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="text-red-500">
                    {stats.nonCompliantTemps} non-compliant
                  </span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">All compliant</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.equipmentCount}</div>
            <p className="text-xs text-muted-foreground">Active monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.staffCount}</div>
            <p className="text-xs text-muted-foreground">Team members</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Task Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Task Completion</CardTitle>
            <CardDescription>
              Today&apos;s task completion progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    {taskCompletionRate}% Complete
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stats.completedTasks} / {stats.completedTasks + stats.pendingTasks}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${taskCompletionRate}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button asChild>
                <Link href="/tasks">
                  View Tasks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/tasks">Complete Tasks</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common daily activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/temperature">
                <Thermometer className="mr-2 h-4 w-4" />
                Record Temperature
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/records">
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Checklist
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/stock">
                <AlertCircle className="mr-2 h-4 w-4" />
                Record Delivery
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Records */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Records</CardTitle>
            <CardDescription>Latest compliance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRecords.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No records found. Start by creating your first compliance record.
                </p>
              ) : (
                recentRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-2 h-12 rounded-full ${
                          record.status === 'COMPLIANT'
                            ? 'bg-green-500'
                            : record.status === 'NON_COMPLIANT'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}
                      />
                      <div>
                        <p className="font-medium">
                          {record.type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          By {record.creator?.name || 'Unknown'} •{' '}
                          {formatDateTime(record.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/records">View All Records</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
