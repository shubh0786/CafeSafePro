import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Store {
  id: string
  name: string
  role: string
}

interface StoreState {
  selectedStore: Store | null
  setSelectedStore: (store: Store) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      selectedStore: null,
      setSelectedStore: (store) => set({ selectedStore: store }),
    }),
    {
      name: 'cafesafe-store',
    }
  )
)
