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
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import {
  Package,
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  Truck,
  Calendar,
  Archive,
} from 'lucide-react'
import { addStockItem } from '@/app/actions/stock'

interface Supplier {
  id: string
  name: string
  contactName: string | null
  phone: string | null
}

interface StockItem {
  id: string
  name: string
  batchNumber: string | null
  receivedDate: Date
  expiryDate: Date | null
  quantity: number
  unit: string
  isUsed: boolean
  usedDate: Date | null
  supplier: Supplier | null
}

interface StockContentProps {
  stockItems: StockItem[]
  suppliers: Supplier[]
  storeId: string
  userId: string
}

export function StockContent({
  stockItems,
  suppliers,
  storeId,
  userId,
}: StockContentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Form state
  const [name, setName] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const [batchNumber, setBatchNumber] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('')
  const [expiryDate, setExpiryDate] = useState('')

  // Filter items
  const filteredItems = stockItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batchNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeItems = filteredItems.filter((item) => !item.isUsed)
  const usedItems = filteredItems.filter((item) => item.isUsed)

  // Check expiry warnings
  const today = new Date()
  const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)

  const expiringSoon = activeItems.filter(
    (item) => item.expiryDate && new Date(item.expiryDate) <= threeDaysFromNow
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await addStockItem({
        storeId,
        supplierId: supplierId || undefined,
        name,
        batchNumber: batchNumber || undefined,
        quantity: parseFloat(quantity),
        unit,
        expiryDate: expiryDate || undefined,
      })

      if (result.success) {
        toast.success('Stock item added successfully')
        setDialogOpen(false)
        setName('')
        setSupplierId('')
        setBatchNumber('')
        setQuantity('')
        setUnit('')
        setExpiryDate('')
        window.location.reload()
      } else {
        toast.error(result.error || 'Failed to add stock item')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock & Traceability</h1>
          <p className="text-muted-foreground mt-1">
            Track deliveries, batch numbers, and expiry dates for MPI compliance
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Delivery
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Record New Delivery</DialogTitle>
              <DialogDescription>
                Record incoming stock for traceability and MPI compliance
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Fresh Milk, Chicken Breast"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select value={supplierId} onValueChange={setSupplierId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batchNumber">Batch/Lot Number</Label>
                  <Input
                    id="batchNumber"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    placeholder="e.g., LOT-240220-A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g., 10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="liters">Liters (L)</SelectItem>
                      <SelectItem value="units">Units</SelectItem>
                      <SelectItem value="boxes">Boxes</SelectItem>
                      <SelectItem value="packs">Packs</SelectItem>
                      <SelectItem value="bottles">Bottles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                  {isSubmitting ? 'Adding...' : 'Add Stock Item'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Expiry Warnings */}
      {expiringSoon.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              Expiring Soon ({expiringSoon.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringSoon.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Batch: {item.batchNumber} • Supplier:{' '}
                      {item.supplier?.name || 'Unknown'}
                    </p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">
                    Expires {item.expiryDate ? formatDate(item.expiryDate) : 'N/A'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stock</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeItems.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                expiringSoon.length > 0 ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {expiringSoon.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Inventory</CardTitle>
          <CardDescription>View and manage all stock items</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by product, batch number, or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">
                Active ({activeItems.length})
              </TabsTrigger>
              <TabsTrigger value="used">
                Used ({usedItems.length})
              </TabsTrigger>
              <TabsTrigger value="all">All ({filteredItems.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
              <StockTable items={activeItems} />
            </TabsContent>
            <TabsContent value="used" className="mt-4">
              <StockTable items={usedItems} />
            </TabsContent>
            <TabsContent value="all" className="mt-4">
              <StockTable items={filteredItems} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function StockTable({ items }: { items: StockItem[] }) {
  const today = new Date()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Batch/Lot</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Received</TableHead>
          <TableHead>Expiry</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              <Archive className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No stock items found</p>
            </TableCell>
          </TableRow>
        ) : (
          items.map((item) => {
            const isExpiringSoon =
              item.expiryDate &&
              new Date(item.expiryDate) <=
                new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
            const isExpired =
              item.expiryDate && new Date(item.expiryDate) < today

            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-medium">{item.name}</div>
                </TableCell>
                <TableCell>{item.supplier?.name || 'Unknown'}</TableCell>
                <TableCell>
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                    {item.batchNumber || 'N/A'}
                  </code>
                </TableCell>
                <TableCell>
                  {item.quantity} {item.unit}
                </TableCell>
                <TableCell>{formatDate(item.receivedDate)}</TableCell>
                <TableCell>
                  {item.expiryDate ? (
                    <span
                      className={
                        isExpired
                          ? 'text-red-600 font-medium'
                          : isExpiringSoon
                          ? 'text-yellow-600 font-medium'
                          : ''
                      }
                    >
                      {formatDate(item.expiryDate)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  {item.isUsed ? (
                    <Badge className="bg-gray-100 text-gray-800">Used</Badge>
                  ) : isExpired ? (
                    <Badge className="bg-red-100 text-red-800">Expired</Badge>
                  ) : isExpiringSoon ? (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Expiring Soon
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  )}
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
