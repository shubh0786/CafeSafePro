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
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
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
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl italic text-foreground">Stock & Traceability</h1>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <Card className="border-amber-100 bg-amber-50/50 dark:bg-amber-950/30 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
              <AlertCircle className="h-5 w-5" />
              Expiring Soon ({expiringSoon.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringSoon.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-card rounded-md border border-border"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Batch: {item.batchNumber} • Supplier:{' '}
                      {item.supplier?.name || 'Unknown'}
                    </p>
                  </div>
                  <Badge className="bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-border">
                    Expires {item.expiryDate ? formatDate(item.expiryDate) : 'N/A'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Items</p>
            <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-1">{stockItems.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Stock</p>
            <p className="text-2xl sm:text-3xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{activeItems.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Suppliers</p>
            <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-1">{suppliers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Expiring Soon</p>
            <p
              className={`text-2xl sm:text-3xl font-semibold mt-1 ${
                expiringSoon.length > 0 ? 'text-amber-600' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {expiringSoon.length}
            </p>
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
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="min-w-[600px] sm:min-w-0">
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
                  <Archive className="h-6 w-6 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">No stock items found</p>
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
                              ? 'text-amber-600 font-medium'
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
                        <Badge className="bg-muted/50 text-foreground border border-border">Used</Badge>
                      ) : isExpired ? (
                        <Badge className="bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-border">Expired</Badge>
                      ) : isExpiringSoon ? (
                        <Badge className="bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-border">
                          Expiring Soon
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-border">Active</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
