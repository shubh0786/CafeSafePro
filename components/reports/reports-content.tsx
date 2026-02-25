'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { formatDate, formatDateTime, getStatusColor } from '@/lib/utils'
import {
  FileText,
  Download,
  BarChart3,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Thermometer,
  ClipboardList,
} from 'lucide-react'

interface RecordDetail {
  id: string
  key: string
  value: string
}

interface ComplianceRecord {
  id: string
  type: string
  status: string
  notes: string | null
  createdAt: Date
  creator: { name: string | null }
  details: RecordDetail[]
}

interface ReportsContentProps {
  stats: {
    thisMonthRecords: number
    thisMonthTempRecords: number
    thisMonthNonCompliantTemps: number
    thisMonthTasks: number
    thisMonthCompletedTasks: number
  }
  records: ComplianceRecord[]
  storeName: string
}

const recordTypeLabels: Record<string, string> = {
  TEMPERATURE: 'Temperature',
  CLEANING: 'Cleaning',
  STOCK_RECEIVING: 'Stock Receiving',
  PEST_CONTROL: 'Pest Control',
  EQUIPMENT_MAINTENANCE: 'Equipment Maintenance',
  PERSONAL_HYGIENE: 'Personal Hygiene',
  TRACEABILITY: 'Traceability',
}

export function ReportsContent({
  stats,
  records,
  storeName,
}: ReportsContentProps) {
  const [reportType, setReportType] = useState('compliance-summary')
  const [dateRange, setDateRange] = useState('this-month')

  const taskCompletionRate =
    stats.thisMonthTasks > 0
      ? Math.round((stats.thisMonthCompletedTasks / stats.thisMonthTasks) * 100)
      : 0

  const tempComplianceRate =
    stats.thisMonthTempRecords > 0
      ? Math.round(
          ((stats.thisMonthTempRecords - stats.thisMonthNonCompliantTemps) /
            stats.thisMonthTempRecords) *
            100
        )
      : 100

  function handleExportReport() {
    toast.success('Report exported successfully!')
  }

  function handlePrintReport() {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Generate compliance reports for MPI verification
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrintReport}>
            <FileText className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>
            Select the type of report and date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compliance-summary">
                    Compliance Summary
                  </SelectItem>
                  <SelectItem value="temperature-log">Temperature Log</SelectItem>
                  <SelectItem value="task-completion">Task Completion</SelectItem>
                  <SelectItem value="all-records">All Records</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.thisMonthCompletedTasks} of {stats.thisMonthTasks} tasks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temp Compliance</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tempComplianceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.thisMonthTempRecords} temperature checks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Records Created</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonthRecords}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge
              className={
                taskCompletionRate >= 90 && tempComplianceRate >= 95
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }
            >
              {taskCompletionRate >= 90 && tempComplianceRate >= 95
                ? 'Excellent'
                : 'Needs Attention'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Based on completion & compliance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Content */}
      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="records">Record Details</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          {/* Compliance Summary Report */}
          <Card className="print:shadow-none">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Compliance Summary Report</CardTitle>
                  <CardDescription>
                    {storeName} • {new Date().toLocaleDateString('en-NZ')}
                  </CardDescription>
                </div>
                <Badge variant="outline">MPI Ready</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Task Completion
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completed Tasks</span>
                      <span className="font-medium">
                        {stats.thisMonthCompletedTasks}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Tasks</span>
                      <span className="font-medium">{stats.thisMonthTasks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Completion Rate</span>
                      <span className="font-medium">{taskCompletionRate}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-blue-500" />
                    Temperature Monitoring
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Checks</span>
                      <span className="font-medium">
                        {stats.thisMonthTempRecords}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Compliant</span>
                      <span className="font-medium text-green-600">
                        {stats.thisMonthTempRecords - stats.thisMonthNonCompliantTemps}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Non-Compliant</span>
                      <span className="font-medium text-red-600">
                        {stats.thisMonthNonCompliantTemps}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  MPI Compliance Statement
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This report confirms that {storeName} has maintained food safety
                  records in accordance with the MPI Food Control Plan requirements
                  for the reporting period. All required daily checks, temperature
                  monitoring, and record-keeping activities have been completed and
                  documented as per the Simply Safe & Suitable Template Food Control
                  Plan guidelines.
                </p>
              </div>

              <div className="border-t pt-6 print:break-inside-avoid">
                <h4 className="font-medium mb-3">Record Summary by Type</h4>
                <div className="grid gap-2">
                  {Object.entries(
                    records.reduce((acc, record) => {
                      acc[record.type] = (acc[record.type] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)
                  ).map(([type, count]) => (
                    <div
                      key={type}
                      className="flex justify-between items-center p-2 bg-muted rounded"
                    >
                      <span className="text-sm">
                        {recordTypeLabels[type] || type}
                      </span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>Recent Records</CardTitle>
              <CardDescription>
                Detailed view of compliance records for verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {records.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No records found for the selected period.
                  </p>
                ) : (
                  records.slice(0, 20).map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-start gap-4">
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
                            {recordTypeLabels[record.type] || record.type}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            By {record.creator.name || 'Unknown'} •{' '}
                            {formatDateTime(record.createdAt)}
                          </p>
                          {record.notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {record.notes}
                            </p>
                          )}
                          {record.details.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {record.details
                                .slice(0, 2)
                                .map((d) => `${d.key}: ${d.value}`)
                                .join(' • ')}
                            </p>
                          )}
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
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Analysis</CardTitle>
              <CardDescription>
                Areas requiring attention for MPI compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {stats.thisMonthNonCompliantTemps === 0 && taskCompletionRate >= 90 ? (
                <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium text-green-800">
                      Excellent Compliance Status
                    </p>
                    <p className="text-sm text-green-700">
                      All temperature checks are within range and task completion is
                      above target. Continue maintaining these standards.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.thisMonthNonCompliantTemps > 0 && (
                    <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-8 w-8 text-red-500 mt-1" />
                      <div>
                        <p className="font-medium text-red-800">
                          Temperature Non-Compliance Alert
                        </p>
                        <p className="text-sm text-red-700">
                          {stats.thisMonthNonCompliantTemps} temperature readings were
                          outside acceptable ranges. Review equipment and ensure
                          corrective actions are completed and documented.
                        </p>
                      </div>
                    </div>
                  )}
                  {taskCompletionRate < 90 && (
                    <div className="flex items-start gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertCircle className="h-8 w-8 text-yellow-500 mt-1" />
                      <div>
                        <p className="font-medium text-yellow-800">
                          Task Completion Below Target
                        </p>
                        <p className="text-sm text-yellow-700">
                          Task completion rate is at {taskCompletionRate}%. MPI requires
                          consistent completion of all daily tasks. Review task
                          assignment and ensure staff are completing all required
                          activities.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">MPI Requirements Checklist</h4>
                <div className="space-y-2">
                  {[
                    'Temperature monitoring records complete',
                    'Daily cleaning tasks documented',
                    'Stock receiving records maintained',
                    'Pest control inspections completed',
                    'Equipment maintenance up to date',
                    'Staff training records current',
                    'Corrective actions documented',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
