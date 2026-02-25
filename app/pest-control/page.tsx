import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bug, Plus, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function PestControlPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pest Control</h1>
            <p className="text-muted-foreground mt-1">
              Track pest control inspections and contractor visits
            </p>
          </div>
          <Button asChild>
            <Link href="/records">
              <Plus className="mr-2 h-4 w-4" />
              New Inspection Record
            </Link>
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inspection Schedule</CardTitle>
              <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Weekly</div>
              <p className="text-xs text-muted-foreground">
                Required by MPI Food Control Plan
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Inspection</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2 days ago</div>
              <p className="text-xs text-muted-foreground">
                No issues found
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-100 text-green-800">Compliant</Badge>
              <p className="text-xs text-muted-foreground mt-1">
                All pest control measures in place
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>MPI Pest Control Requirements</CardTitle>
            <CardDescription>
              Key requirements for pest control compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. Regular Inspections</h4>
              <p className="text-sm text-muted-foreground">
                Inspect all areas of the premises weekly for signs of pest activity. Check traps, bait stations, and look for droppings, gnaw marks, or other evidence.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">2. Professional Pest Control</h4>
              <p className="text-sm text-muted-foreground">
                Engage a licensed pest control contractor for regular visits. Maintain records of all contractor visits and treatments applied.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">3. Documentation</h4>
              <p className="text-sm text-muted-foreground">
                Record all pest control activities including self-inspections and contractor visits. Keep records for at least 4 years for MPI verification.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">4. Preventive Measures</h4>
              <p className="text-sm text-muted-foreground">
                Maintain pest-proofing measures including sealed doors, intact screens, and proper waste management. Store food products off the floor.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/records?type=PEST_CONTROL">
              View Inspection Records
            </Link>
          </Button>
          <Button asChild>
            <Link href="/records?type=PEST_CONTROL&create=true">
              <Plus className="mr-2 h-4 w-4" />
              Record Inspection
            </Link>
          </Button>
        </div>
      </div>
    </DashboardShell>
  )
}
