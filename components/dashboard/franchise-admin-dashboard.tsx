'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/utils'
import {
  Building2,
  Store,
  Users,
  Thermometer,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  FileText,
  Activity,
} from 'lucide-react'
import Link from 'next/link'

interface StoreOverview {
  id: string
  name: string
  address: string
  staffCount: number
  pendingTasks: number
  completedTasks: number
  todayTempRecords: number
  nonCompliantTemps: number
  equipmentCount: number
  recentRecordCount: number
}

interface Alert {
  id: string
  type: 'temperature' | 'task' | 'compliance'
  message: string
  storeName: string
  createdAt: Date
}

interface FranchiseAdminDashboardProps {
  franchiseName: string
  stores: StoreOverview[]
  alerts: Alert[]
  totalStores: number
  totalStaff: number
  overallComplianceRate: number
  overallTaskCompletion: number
}

function getComplianceColor(rate: number) {
  if (rate >= 90) return 'bg-green-100 text-green-800 border-green-200'
  if (rate >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  return 'bg-red-100 text-red-800 border-red-200'
}

function getComplianceLabel(rate: number) {
  if (rate >= 90) return 'Excellent'
  if (rate >= 70) return 'Needs Attention'
  return 'Critical'
}

function getStoreHealthColor(store: StoreOverview) {
  if (store.nonCompliantTemps > 0) return 'border-l-red-500'
  const total = store.completedTasks + store.pendingTasks
  const rate = total > 0 ? (store.completedTasks / total) * 100 : 100
  if (rate >= 80) return 'border-l-green-500'
  if (rate >= 50) return 'border-l-yellow-500'
  return 'border-l-red-500'
}

export function FranchiseAdminDashboard({
  franchiseName,
  stores,
  alerts,
  totalStores,
  totalStaff,
  overallComplianceRate,
  overallTaskCompletion,
}: FranchiseAdminDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Franchise Overview</h1>
        <p className="text-muted-foreground mt-1">
          {franchiseName} — {totalStores} stores across your network
        </p>
      </div>

      {/* Aggregate KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStores}</div>
            <p className="text-xs text-muted-foreground">Active locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground">Across all stores</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallComplianceRate}%</div>
            <Badge
              variant="outline"
              className={getComplianceColor(overallComplianceRate)}
            >
              {getComplianceLabel(overallComplianceRate)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallTaskCompletion}%</div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${overallTaskCompletion}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Active Alerts ({alerts.length})
            </CardTitle>
            <CardDescription className="text-red-700">
              Issues requiring attention across your stores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-100"
                >
                  <div className="flex items-center gap-3">
                    {alert.type === 'temperature' && (
                      <Thermometer className="h-4 w-4 text-red-500" />
                    )}
                    {alert.type === 'task' && (
                      <ClipboardList className="h-4 w-4 text-yellow-500" />
                    )}
                    {alert.type === 'compliance' && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.storeName}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {alert.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Store Health Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Store Health
            </CardTitle>
            <CardDescription>
              Today&apos;s performance across all locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stores.map((store) => {
                const total = store.completedTasks + store.pendingTasks
                const taskRate = total > 0
                  ? Math.round((store.completedTasks / total) * 100)
                  : 0

                return (
                  <div
                    key={store.id}
                    className={`p-4 border rounded-lg border-l-4 ${getStoreHealthColor(store)} hover:bg-muted/30 transition-colors`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{store.name}</h4>
                        <p className="text-xs text-muted-foreground">{store.address}</p>
                      </div>
                      {store.nonCompliantTemps > 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          {store.nonCompliantTemps} temp alert{store.nonCompliantTemps > 1 ? 's' : ''}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Compliant
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Tasks</p>
                        <p className="font-medium">{store.completedTasks}/{total}</p>
                        <div className="h-1 bg-muted rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${taskRate}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Temp Checks</p>
                        <p className="font-medium">{store.todayTempRecords}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Equipment</p>
                        <p className="font-medium">{store.equipmentCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Staff</p>
                        <p className="font-medium">{store.staffCount}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Management Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Management Actions</CardTitle>
            <CardDescription>Franchise administration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/reports">
                <FileText className="mr-2 h-4 w-4" />
                View Reports
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/stores">
                <Store className="mr-2 h-4 w-4" />
                Manage Stores
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/staff">
                <Users className="mr-2 h-4 w-4" />
                Manage Staff
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/franchise">
                <Building2 className="mr-2 h-4 w-4" />
                Franchise Settings
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/settings">
                <TrendingUp className="mr-2 h-4 w-4" />
                System Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
