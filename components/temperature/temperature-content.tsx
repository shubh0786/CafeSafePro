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

  // Group equipment by category
  const equipmentByCategory = equipment.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, Equipment[]>)

  // Check which equipment has been checked today
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
        // Refresh the page to show new record
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Temperature Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Record and monitor equipment temperatures for MPI compliance
          </p>
        </div>
      </div>

      <Tabs defaultValue="record" className="space-y-6">
        <TabsList>
          <TabsTrigger value="record">Record Temperature</TabsTrigger>
          <TabsTrigger value="today">Today&apos;s Records</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Record Temperature Tab */}
        <TabsContent value="record" className="space-y-6">
          {Object.entries(equipmentByCategory).map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  {categoryLabels[category] || category}
                </CardTitle>
                <CardDescription>
                  Record temperatures for {items.length} equipment(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => {
                    const isChecked = checkedToday.has(item.id)
                    const lastRecord = todayRecords.find(
                      (r) => r.equipment.id === item.id
                    )

                    return (
                      <Card
                        key={item.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isChecked ? 'border-green-500' : ''
                        }`}
                        onClick={() => openRecordDialog(item)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.location}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Range: {item.minTemp}°C - {item.maxTemp}°C
                              </p>
                            </div>
                            {isChecked ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Plus className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          {lastRecord && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">
                                  Last: {lastRecord.temperature}°C
                                </span>
                                <Badge
                                  className={
                                    lastRecord.isCompliant
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }
                                >
                                  {lastRecord.isCompliant
                                    ? 'Compliant'
                                    : 'Alert'}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                at {formatTime(lastRecord.recordedAt)}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Today's Records Tab */}
        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Records</CardTitle>
              <CardDescription>
                All temperature records for today ({todayRecords.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayRecords.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No temperature records for today yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Temperature</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recorded By</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {record.equipment.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {record.equipment.location}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {record.temperature}°C
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              record.isCompliant
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {record.isCompliant ? 'Compliant' : 'Non-Compliant'}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.user.name}</TableCell>
                        <TableCell>
                          {formatTime(record.recordedAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent History</CardTitle>
              <CardDescription>
                Temperature records from the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Temperature</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recorded By</TableHead>
                    <TableHead>Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{record.equipment.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {record.equipment.location}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {record.temperature}°C
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            record.isCompliant
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {record.isCompliant ? 'Compliant' : 'Non-Compliant'}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.user.name}</TableCell>
                      <TableCell>
                        {formatDateTime(record.recordedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Record Temperature Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Temperature</DialogTitle>
            <DialogDescription>
              {selectedEquipment && (
                <>
                  Recording temperature for <strong>{selectedEquipment.name}</strong>
                  <br />
                  Acceptable range: {selectedEquipment.minTemp}°C -{' '}
                  {selectedEquipment.maxTemp}°C
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
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
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any observations or issues"
              />
            </div>
            {selectedEquipment && temperature && (
              <div className="p-3 rounded-md bg-muted">
                {(() => {
                  const temp = parseFloat(temperature)
                  const { status } = getTemperatureStatus(
                    temp,
                    selectedEquipment.minTemp || 0,
                    selectedEquipment.maxTemp || 100
                  )
                  return status === 'good' ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">
                        Temperature is within acceptable range
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">
                        Temperature is outside acceptable range. Please check
                        equipment and record corrective action.
                      </span>
                    </div>
                  )
                })()}
              </div>
            )}
            <div className="flex justify-end gap-2">
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
