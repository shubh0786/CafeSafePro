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
  Sparkles,
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Welcome back
            </h1>
            <Sparkles className="h-5 w-5 text-amber-400" />
          </div>
          <p className="text-gray-500">
            Here&apos;s what&apos;s happening at <span className="font-medium text-gray-700">{storeName}</span> today
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pending Tasks */}
        <Card className="group hover:shadow-soft-md transition-all duration-300 border-0 shadow-soft bg-white overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Pending Tasks
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2 animate-count-up">
                  {stats.pendingTasks}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.completedTasks} completed today
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ClipboardList className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temperature Checks */}
        <Card className="group hover:shadow-soft-md transition-all duration-300 border-0 shadow-soft bg-white overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Temp Checks
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2 animate-count-up">
                  {stats.todayTempRecords}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {stats.nonCompliantTemps > 0 ? (
                    <>
                      <TrendingDown className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-500 font-medium">
                        {stats.nonCompliantTemps} non-compliant
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                      <span className="text-xs text-emerald-500 font-medium">All compliant</span>
                    </>
                  )}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Thermometer className="h-5 w-5 text-sky-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipment */}
        <Card className="group hover:shadow-soft-md transition-all duration-300 border-0 shadow-soft bg-white overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Equipment
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2 animate-count-up">
                  {stats.equipmentCount}
                </p>
                <p className="text-xs text-gray-500 mt-1">Active monitoring</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Wrench className="h-5 w-5 text-violet-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staff */}
        <Card className="group hover:shadow-soft-md transition-all duration-300 border-0 shadow-soft bg-white overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Staff
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2 animate-count-up">
                  {stats.staffCount}
                </p>
                <p className="text-xs text-gray-500 mt-1">Team members</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Task Completion */}
        <Card className="lg:col-span-2 border-0 shadow-soft bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-gray-900">Task Completion</CardTitle>
            <CardDescription>
              Today&apos;s task completion progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2.5">
                  <span className="text-sm font-semibold text-gray-900">
                    {taskCompletionRate}% Complete
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    {stats.completedTasks} / {stats.completedTasks + stats.pendingTasks}
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700 ease-out relative"
                    style={{ width: `${taskCompletionRate}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl">
                  <Link href="/tasks">
                    View Tasks
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="rounded-xl border-gray-200 hover:bg-gray-50">
                  <Link href="/tasks">Complete Tasks</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-soft bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-gray-900">Quick Actions</CardTitle>
            <CardDescription>Common daily activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full justify-start rounded-xl h-11 bg-sky-50 text-sky-700 hover:bg-sky-100 border-0 shadow-none font-medium transition-all duration-200"
              variant="outline"
              asChild
            >
              <Link href="/temperature">
                <Thermometer className="mr-2.5 h-4 w-4 text-sky-500" />
                Record Temperature
              </Link>
            </Button>
            <Button
              className="w-full justify-start rounded-xl h-11 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-0 shadow-none font-medium transition-all duration-200"
              variant="outline"
              asChild
            >
              <Link href="/records">
                <CheckCircle className="mr-2.5 h-4 w-4 text-emerald-500" />
                Complete Checklist
              </Link>
            </Button>
            <Button
              className="w-full justify-start rounded-xl h-11 bg-amber-50 text-amber-700 hover:bg-amber-100 border-0 shadow-none font-medium transition-all duration-200"
              variant="outline"
              asChild
            >
              <Link href="/stock">
                <AlertCircle className="mr-2.5 h-4 w-4 text-amber-500" />
                Record Delivery
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Records */}
        <Card className="lg:col-span-3 border-0 shadow-soft bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-900">Recent Records</CardTitle>
                <CardDescription>Latest compliance records</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild className="rounded-xl border-gray-200 text-xs">
                <Link href="/records">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentRecords.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <ClipboardList className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No records yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Start by creating your first compliance record
                  </p>
                </div>
              ) : (
                recentRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-1.5 h-10 rounded-full ${
                          record.status === 'COMPLIANT'
                            ? 'bg-emerald-400'
                            : record.status === 'NON_COMPLIANT'
                            ? 'bg-red-400'
                            : 'bg-amber-400'
                        }`}
                      />
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {record.type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          By {record.creator?.name || 'Unknown'} &middot;{' '}
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
