'use client'

import { useSession } from 'next-auth/react'
import { useStore } from '@/lib/store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Store } from 'lucide-react'

export function StoreSelector() {
  const { data: session } = useSession()
  const { selectedStore, setSelectedStore } = useStore()

  const stores = session?.user?.stores || []

  if (stores.length <= 1) {
    return null
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-3 border-b border-border bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Store className="h-4 w-4" />
          <span className="font-medium hidden sm:inline">Store:</span>
        </div>
        <Select
          value={selectedStore?.id}
          onValueChange={(value) => {
            const store = stores.find((s) => s.id === value)
            if (store) {
              setSelectedStore(store)
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-[280px] h-9 text-sm">
            <SelectValue placeholder="Select a store" />
          </SelectTrigger>
          <SelectContent>
            {stores.map((store) => (
              <SelectItem key={store.id} value={store.id}>
                {store.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
