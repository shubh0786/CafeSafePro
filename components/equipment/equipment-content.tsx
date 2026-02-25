'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import {
  Wrench,
  Plus,
  Thermometer,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
} from 'lucide-react'
import { createEquipment } from '@/app/actions/equipment'

interface TemperatureRecord {
  id: string
  temperature: number
  recordedAt: Date
  isCompliant: boolean
}

interface Equipment {
  id: string
  name: string
  category: string
  location: string | null
  minTemp: number | null
  maxTemp: number | null
  serialNumber: string | null
  lastServiced: Date | null
  nextService: Date | null
  isActive: boolean
  tempRecords: TemperatureRecord[]
}

interface EquipmentContentProps {
  equipment: Equipment[]
  storeId: string
  userRole: string
}

const categoryLabels: Record<string, string> = {
  COLD_STORAGE: 'Cold Storage',
  FREEZER: 'Freezer',
  HOT_HOLDING: 'Hot Holding',
  COOKING: 'Cooking',
  DELIVERY: 'Delivery',
}

const categoryIcons: Record<string, React.ReactNode> = {
  COLD_STORAGE: <Thermometer className="h-4 w-4" />,
  FREEZER: <Thermometer className="h-4 w-4" />,
  HOT_HOLDING: <Thermometer className="h-4 w-4" />,
  COOKING: <Settings className="h-4 w-4" />,
  DELIVERY: <Clock className="h-4 w-4" />,
}

export function EquipmentContent({
  equipment,
  storeId,
  userRole,
}: EquipmentContentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [minTemp, setMinTemp] = useState('')
  const [maxTemp, setMaxTemp] = useState('')
  const [serialNumber, setSerialNumber] = useState('')

  const canAddEquipment = ['MANAGER', 'OWNER', 'FRANCHISE_ADMIN'].includes(userRole)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createEquipment({
        storeId,
        name,
        category,
        location: location || undefined,
        minTemp: minTemp ? parseFloat(minTemp) : undefined,
        maxTemp: maxTemp ? parseFloat(maxTemp) : undefined,
        serialNumber: serialNumber || undefined,
      })

      if (result.success) {
        toast.success('Equipment added successfully')
        setDialogOpen(false)
        setName('')
        setCategory('')
        setLocation('')
        setMinTemp('')
        setMaxTemp('')
        setSerialNumber('')
        window.location.reload()
      } else {
        toast.error(result.error || 'Failed to add equipment')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Group by category
  const equipmentByCategory = equipment.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, Equipment[]>)

  // Check for upcoming maintenance
  const today = new Date()
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
  const needsService = equipment.filter(
    (e) =>
      e.nextService &&
      new Date(e.nextService) <= thirtyDaysFromNow &&
      new Date(e.nextService) >= today
  )

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Equipment</h1>
          <p className="text-muted-foreground mt-1">
            Manage equipment for temperature monitoring and maintenance tracking
          </p>
        </div>
        {canAddEquipment && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                <Plus className="mr-2 h-4 w-4" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg rounded-2xl">
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
                <DialogDescription>
                  Add equipment for temperature monitoring
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Equipment Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Walk-in Fridge, Prep Fridge 1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COLD_STORAGE">Cold Storage</SelectItem>
                      <SelectItem value="FREEZER">Freezer</SelectItem>
                      <SelectItem value="HOT_HOLDING">Hot Holding</SelectItem>
                      <SelectItem value="COOKING">Cooking Equipment</SelectItem>
                      <SelectItem value="DELIVERY">Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Back Storage, Prep Area"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minTemp">Min Temp (°C)</Label>
                    <Input
                      id="minTemp"
                      type="number"
                      step="0.1"
                      value={minTemp}
                      onChange={(e) => setMinTemp(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxTemp">Max Temp (°C)</Label>
                    <Input
                      id="maxTemp"
                      type="number"
                      step="0.1"
                      value={maxTemp}
                      onChange={(e) => setMaxTemp(e.target.value)}
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="Equipment serial number"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                    {isSubmitting ? 'Adding...' : 'Add Equipment'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Maintenance Alerts */}
      {needsService.length > 0 && (
        <Card className="border-amber-100 bg-amber-50/50 dark:bg-amber-950/30 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
              <AlertCircle className="h-5 w-5" />
              Upcoming Maintenance ({needsService.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {needsService.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-card rounded-xl border border-border"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.location}
                    </p>
                  </div>
                  <Badge className="bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-border">
                    Service due {item.nextService ? formatDate(item.nextService) : 'N/A'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipment Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-soft group hover:shadow-soft-md transition-all duration-300">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Equipment</p>
                <div className="text-2xl sm:text-3xl font-bold text-foreground mt-2">{equipment.length}</div>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Wrench className="h-4 w-4 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft group hover:shadow-soft-md transition-all duration-300">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active</p>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                  {equipment.filter((e) => e.isActive).length}
                </div>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft group hover:shadow-soft-md transition-all duration-300">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Needs Service</p>
                <div
                  className={`text-2xl sm:text-3xl font-bold mt-2 ${
                    needsService.length > 0 ? 'text-amber-600' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {needsService.length}
                </div>
              </div>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                needsService.length > 0 ? 'bg-amber-50 dark:bg-amber-950/50' : 'bg-emerald-50 dark:bg-emerald-950/50'
              }`}>
                <Clock className={`h-4 w-4 ${needsService.length > 0 ? 'text-amber-600' : 'text-emerald-600 dark:text-emerald-400'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft group hover:shadow-soft-md transition-all duration-300">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Temp Monitored</p>
                <div className="text-2xl sm:text-3xl font-bold text-foreground mt-2">
                  {equipment.filter((e) => e.minTemp !== null && e.maxTemp !== null).length}
                </div>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Thermometer className="h-4 w-4 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment by Category */}
      <div className="space-y-6 sm:space-y-8">
        {Object.entries(equipmentByCategory).map(([category, items]) => (
          <Card key={category} className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {categoryIcons[category]}
                {categoryLabels[category] || category}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {items.length} equipment(s) in this category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => {
                  const lastRecord = item.tempRecords[0]
                  const needsMaintenance =
                    item.nextService &&
                    new Date(item.nextService) <= thirtyDaysFromNow

                  return (
                    <Card key={item.id} className={`border-border hover:shadow-soft-md transition-all duration-200 ${item.isActive ? '' : 'opacity-50'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.location}
                            </p>
                          </div>
                          {!item.isActive && (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>

                        {item.minTemp !== null && item.maxTemp !== null && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm text-muted-foreground">
                              Range: {item.minTemp}°C - {item.maxTemp}°C
                            </p>
                            {lastRecord && (
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm text-muted-foreground">
                                  Last: {lastRecord.temperature}°C
                                </span>
                                <Badge
                                  className={
                                    lastRecord.isCompliant
                                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-border'
                                      : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-border'
                                  }
                                >
                                  {lastRecord.isCompliant ? 'OK' : 'Alert'}
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}

                        {item.serialNumber && (
                          <p className="text-xs text-muted-foreground mt-2">
                            S/N: {item.serialNumber}
                          </p>
                        )}

                        {needsMaintenance && (
                          <div className="mt-3 pt-3 border-t">
                            <Badge className="bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-border w-full justify-center">
                              Service due {formatDate(item.nextService!)}
                            </Badge>
                          </div>
                        )}

                        {item.lastServiced && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Last serviced: {formatDate(item.lastServiced)}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
