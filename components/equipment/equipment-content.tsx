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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Equipment</h1>
          <p className="text-muted-foreground mt-1">
            Manage equipment for temperature monitoring and maintenance tracking
          </p>
        </div>
        {canAddEquipment && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
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

                <div className="grid grid-cols-2 gap-4">
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
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
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
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              Upcoming Maintenance ({needsService.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {needsService.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.location}
                    </p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">
                    Service due {item.nextService ? formatDate(item.nextService) : 'N/A'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipment Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipment.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {equipment.filter((e) => e.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Service</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                needsService.length > 0 ? 'text-orange-600' : 'text-green-600'
              }`}
            >
              {needsService.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temp Monitored</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {equipment.filter((e) => e.minTemp !== null && e.maxTemp !== null).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment by Category */}
      <div className="space-y-6">
        {Object.entries(equipmentByCategory).map(([category, items]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {categoryIcons[category]}
                {categoryLabels[category] || category}
              </CardTitle>
              <CardDescription>
                {items.length} equipment(s) in this category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => {
                  const lastRecord = item.tempRecords[0]
                  const needsMaintenance =
                    item.nextService &&
                    new Date(item.nextService) <= thirtyDaysFromNow

                  return (
                    <Card key={item.id} className={item.isActive ? '' : 'opacity-50'}>
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
                            <Badge className="bg-orange-100 text-orange-800 w-full justify-center">
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
