'use client'

import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function RecordsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center">
        <AlertCircle className="h-7 w-7 text-red-500" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
      <p className="text-muted-foreground text-center max-w-md">
        There was an error loading the records page. Please try again.
      </p>
      <Button onClick={reset} className="rounded-xl">
        Try Again
      </Button>
    </div>
  )
}
