'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { formatDateTime, getStatusColor } from '@/lib/utils'
import {
  FileText,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
  Search,
} from 'lucide-react'
import { createRecord } from '@/app/actions/records'

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

interface CorrectiveAction {
  id: string
  description: string
  dueDate: Date
  status: string
  completedAt: Date | null
  assignee: { name: string | null }
  record: ComplianceRecord
}

interface RecordsContentProps {
  records: ComplianceRecord[]
  correctiveActions: CorrectiveAction[]
  storeId: string
  userId: string
  userRole: string
}

const recordTypes = [
  { value: 'CLEANING', label: 'Cleaning Record', icon: '✨' },
  { value: 'PEST_CONTROL', label: 'Pest Control', icon: '🐛' },
  { value: 'EQUIPMENT_MAINTENANCE', label: 'Equipment Maintenance', icon: '🔧' },
  { value: 'PERSONAL_HYGIENE', label: 'Personal Hygiene', icon: '🧼' },
  { value: 'TRACEABILITY', label: 'Traceability Check', icon: '📋' },
]

const recordFields: Record<string, { label: string; type: string }[]> = {
  CLEANING: [
    { label: 'Area Cleaned', type: 'text' },
    { label: 'Cleaning Agent Used', type: 'text' },
    { label: 'Completed By', type: 'text' },
  ],
  PEST_CONTROL: [
    { label: 'Area Inspected', type: 'text' },
    { label: 'Evidence Found', type: 'text' },
    { label: 'Action Taken', type: 'text' },
  ],
  EQUIPMENT_MAINTENANCE: [
    { label: 'Equipment Name', type: 'text' },
    { label: 'Maintenance Type', type: 'text' },
    { label: 'Technician', type: 'text' },
  ],
  PERSONAL_HYGIENE: [
    { label: 'Staff Member', type: 'text' },
    { label: 'Issue Reported', type: 'text' },
    { label: 'Action Taken', type: 'text' },
  ],
  TRACEABILITY: [
    { label: 'Product Name', type: 'text' },
    { label: 'Batch Number', type: 'text' },
    { label: 'Supplier', type: 'text' },
  ],
}

export function RecordsContent({
  records,
  correctiveActions,
  storeId,
  userId,
  userRole,
}: RecordsContentProps) {
  const [selectedType, setSelectedType] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Form fields state
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState('')

  const fields = selectedType ? recordFields[selectedType] || [] : []

  // Filter records
  const filteredRecords = records.filter((record) => {
    const matchesType = filterType ? record.type === filterType : true
    const matchesSearch = searchQuery
      ? record.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.creator.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.type.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesType && matchesSearch
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedType) return

    setIsSubmitting(true)

    try {
      const details = Object.entries(formData).map(([key, value]) => ({
        key,
        value,
      }))

      const result = await createRecord({
        storeId,
        type: selectedType,
        notes,
        createdBy: userId,
        details,
      })

      if (result.success) {
        toast.success('Record created successfully')
        setDialogOpen(false)
        setFormData({})
        setNotes('')
        setSelectedType('')
        window.location.reload()
      } else {
        toast.error(result.error || 'Failed to create record')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  function openCreateDialog(type: string) {
    setSelectedType(type)
    setFormData({})
    setNotes('')
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compliance Records</h1>
          <p className="text-muted-foreground mt-1">
            Record cleaning, pest control, maintenance, and other compliance activities
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Record</DialogTitle>
              <DialogDescription>
                Record compliance activity for MPI requirements
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Record Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="mr-2">{type.icon}</span>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {fields.map((field) => (
                <div key={field.label} className="space-y-2">
                  <Label htmlFor={field.label}>{field.label}</Label>
                  <Input
                    id={field.label}
                    value={formData[field.label] || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.label]: e.target.value })
                    }
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    required
                  />
                </div>
              ))}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional observations or comments"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !selectedType}>
                  {isSubmitting ? 'Creating...' : 'Create Record'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Record Buttons */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {recordTypes.map((type) => (
          <Card
            key={type.value}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => openCreateDialog(type.value)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">{type.icon}</div>
              <p className="font-medium text-sm">{type.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Corrective Actions Alert */}
      {correctiveActions.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              Pending Corrective Actions ({correctiveActions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {correctiveActions.slice(0, 3).map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg"
                >
                  <div>
                    <p className="font-medium text-red-900">
                      {action.record.type.replace(/_/g, ' ')} Issue
                    </p>
                    <p className="text-sm text-red-700">{action.description}</p>
                    <p className="text-xs text-red-600 mt-1">
                      Assigned to {action.assignee.name} • Due{' '}
                      {new Date(action.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-red-300 text-red-700">
                    {action.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Records</CardTitle>
          <CardDescription>View and filter all compliance records</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {recordTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recorded By</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No records found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>
                          {recordTypes.find((t) => t.value === record.type)?.icon}
                        </span>
                        <span className="font-medium">
                          {record.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.creator.name}</TableCell>
                    <TableCell>{formatDateTime(record.createdAt)}</TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {record.notes ||
                          record.details
                            .map((d) => `${d.key}: ${d.value}`)
                            .slice(0, 2)
                            .join(', ')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
