'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { formatDateTime, formatTime, getTemperatureStatus } from '@/lib/utils'
import { Thermometer, Plus, AlertCircle, CheckCircle } from 'lucide-react'
import { recordTemperature } from '@/app/actions/temperature'

interface Equipment {
  id: string
  name: string
  category: string
  location: string | null
  minTemp: number | null
  maxTemp: number | null
}

interface TemperatureRecord {
  id: string
  temperature: number
  recordedAt: Date
  isCompliant: boolean
  notes: string | null
  equipment: Equipment
  user: { name: string | null }
}

interface TemperatureContentProps {
  equipment: Equipment[]
  todayRecords: TemperatureRecord[]
  recentRecords: TemperatureRecord[]
  storeId: string
  userId: string
}

const categoryLabels: Record<string, string> = {
  COLD_STORAGE: 'Cold Storage',
  FREEZER: 'Freezer',
  HOT_HOLDING: 'Hot Holding',
  COOKING: 'Cooking',
  DELIVERY: 'Delivery',
}

export function TemperatureContent({
  equipment,
  todayRecords,
  recentRecords,
  storeId,
  userId,
}: TemperatureContentProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [temperature, setTemperature] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const equipmentByCategory = equipment.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, Equipment[]>)

  const checkedToday = new Set(todayRecords.map((r) => r.equipment.id))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedEquipment) return

    setIsSubmitting(true)

    try {
      const result = await recordTemperature({
        equipmentId: selectedEquipment.id,
        temperature: parseFloat(temperature),
        notes: notes || undefined,
        recordedBy: userId,
      })

      if (result.success) {
        toast.success('Temperature recorded successfully')
        setDialogOpen(false)
        setTemperature('')
        setNotes('')
        setSelectedEquipment(null)
        window.location.reload()
      } else {
        toast.error(result.error || 'Failed to record temperature')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  function openRecordDialog(equipment: Equipment) {
    setSelectedEquipment(equipment)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl italic text-foreground">Temperature Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Record and monitor equipment temperatures for MPI compliance
          </p>
        </div>
      </div>

      <Tabs defaultValue="record" className="space-y-6">
        <TabsList className="overflow-x-auto scrollbar-hide">
          <TabsTrigger value="record">Record Temperature</TabsTrigger>
          <TabsTrigger value="today">Today&apos;s Records</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="record" className="space-y-6">
          {Object.entries(equipmentByCategory).map(([category, items]) => (
            <Card key={category}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2.5 text-base font-semibold text-foreground">
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                  {categoryLabels[category] || category}
                </CardTitle>
                <CardDescription>
                  Record temperatures for {items.length} equipment(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => {
                    const isChecked = checkedToday.has(item.id)
                    const lastRecord = todayRecords.find(
                      (r) => r.equipment.id === item.id
                    )

                    return (
                      <div
                        key={item.id}
                        className={`cursor-pointer rounded-md border p-4 ${
                          isChecked
                            ? 'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/30'
                            : 'border-border'
                        }`}
                        onClick={() => openRecordDialog(item)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {item.location}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              Range: {item.minTemp}°C - {item.maxTemp}°C
                            </p>
                          </div>
                          {isChecked ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Plus className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        {lastRecord && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-foreground">
                                Last: {lastRecord.temperature}°C
                              </span>
                              <Badge
                                className={
                                  lastRecord.isCompliant
                                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-100'
                                    : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-100'
                                }
                              >
                                {lastRecord.isCompliant
                                  ? 'Compliant'
                                  : 'Alert'}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              at {formatTime(lastRecord.recordedAt)}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="today">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-foreground">Today&apos;s Records</CardTitle>
              <CardDescription>
                All temperature records for today ({todayRecords.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayRecords.length === 0 ? (
                <div className="text-center py-12">
                  <Thermometer className="h-6 w-6 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">No records yet today</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="min-w-[600px] sm:min-w-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead className="text-muted-foreground">Equipment</TableHead>
                          <TableHead className="text-muted-foreground">Temperature</TableHead>
                          <TableHead className="text-muted-foreground">Status</TableHead>
                          <TableHead className="text-muted-foreground">Recorded By</TableHead>
                          <TableHead className="text-muted-foreground">Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {todayRecords.map((record) => (
                          <TableRow key={record.id} className="border-border hover:bg-muted/50">
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm text-foreground">
                                  {record.equipment.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {record.equipment.location}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-foreground">
                              {record.temperature}°C
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  record.isCompliant
                                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-100'
                                    : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-100'
                                }
                              >
                                {record.isCompliant ? 'Compliant' : 'Non-Compliant'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-foreground">{record.user.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatTime(record.recordedAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-foreground">Recent History</CardTitle>
              <CardDescription>
                Temperature records from the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="min-w-[600px] sm:min-w-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead className="text-muted-foreground">Equipment</TableHead>
                        <TableHead className="text-muted-foreground">Temperature</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground">Recorded By</TableHead>
                        <TableHead className="text-muted-foreground">Date & Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentRecords.map((record) => (
                        <TableRow key={record.id} className="border-border hover:bg-muted/50">
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm text-foreground">{record.equipment.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {record.equipment.location}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-foreground">
                            {record.temperature}°C
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                record.isCompliant
                                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-100'
                                  : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-100'
                              }
                            >
                              {record.isCompliant ? 'Compliant' : 'Non-Compliant'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-foreground">{record.user.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDateTime(record.recordedAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Record Temperature Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">Record Temperature</DialogTitle>
            <DialogDescription>
              {selectedEquipment && (
                <>
                  Recording temperature for <strong className="text-foreground">{selectedEquipment.name}</strong>
                  <br />
                  Acceptable range: {selectedEquipment.minTemp}°C -{' '}
                  {selectedEquipment.maxTemp}°C
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="temperature" className="text-sm font-medium text-foreground">Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="Enter temperature"
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-foreground">Notes (optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any observations or issues"
              />
            </div>
            {selectedEquipment && temperature && (
              <div className="p-3.5 rounded-md bg-muted/50">
                {(() => {
                  const temp = parseFloat(temperature)
                  const { status } = getTemperatureStatus(
                    temp,
                    selectedEquipment.minTemp || 0,
                    selectedEquipment.maxTemp || 100
                  )
                  return status === 'good' ? (
                    <div className="flex items-center gap-2.5 text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Temperature is within acceptable range
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Temperature is outside acceptable range
                      </span>
                    </div>
                  )
                })()}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Recording...' : 'Record Temperature'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
