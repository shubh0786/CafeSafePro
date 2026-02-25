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

export function StoreSelector() {
  const { data: session } = useSession()
  const { selectedStore, setSelectedStore } = useStore()

  const stores = session?.user?.stores || []

  if (stores.length <= 1) {
    return null
  }

  return (
    <div className="px-6 py-3 border-b bg-muted/50">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Selected Store:</span>
        <Select
          value={selectedStore?.id}
          onValueChange={(value) => {
            const store = stores.find((s) => s.id === value)
            if (store) {
              setSelectedStore(store)
            }
          }}
        >
          <SelectTrigger className="w-[280px]">
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
