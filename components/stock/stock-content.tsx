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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Stock & Traceability</h1>
          <p className="text-gray-500 mt-1">
            Track deliveries, batch numbers, and expiry dates for MPI compliance
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Record Delivery
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg rounded-2xl">
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
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                  {isSubmitting ? 'Adding...' : 'Add Stock Item'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Expiry Warnings */}
      {expiringSoon.length > 0 && (
        <Card className="border-amber-100 bg-amber-50/50 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-5 w-5" />
              Expiring Soon ({expiringSoon.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringSoon.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-100"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Batch: {item.batchNumber} • Supplier:{' '}
                      {item.supplier?.name || 'Unknown'}
                    </p>
                  </div>
                  <Badge className="bg-red-50 text-red-700 border border-red-100">
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
        <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Items</p>
                <div className="text-3xl font-bold text-gray-900 mt-2">{stockItems.length}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Package className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Active Stock</p>
                <div className="text-3xl font-bold text-emerald-600 mt-2">{activeItems.length}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Suppliers</p>
                <div className="text-3xl font-bold text-gray-900 mt-2">{suppliers.length}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Truck className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Expiring Soon</p>
                <div
                  className={`text-3xl font-bold mt-2 ${
                    expiringSoon.length > 0 ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  {expiringSoon.length}
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                expiringSoon.length > 0 ? 'bg-amber-50' : 'bg-emerald-50'
              }`}>
                <Calendar className={`h-5 w-5 ${expiringSoon.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Items Table */}
      <Card className="border-0 shadow-soft bg-white">
        <CardHeader>
          <CardTitle>Stock Inventory</CardTitle>
          <CardDescription>View and manage all stock items</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by product, batch number, or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
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
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Archive className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No stock items found</p>
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
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
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
                          ? 'text-amber-600 font-medium'
                          : ''
                      }
                    >
                      {formatDate(item.expiryDate)}
                    </span>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  {item.isUsed ? (
                    <Badge className="bg-gray-50 text-gray-600 border border-gray-100">Used</Badge>
                  ) : isExpired ? (
                    <Badge className="bg-red-50 text-red-700 border border-red-100">Expired</Badge>
                  ) : isExpiringSoon ? (
                    <Badge className="bg-amber-50 text-amber-700 border border-amber-100">
                      Expiring Soon
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100">Active</Badge>
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
