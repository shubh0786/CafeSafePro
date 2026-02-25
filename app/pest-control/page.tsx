import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function PestControlPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  return (
    <DashboardShell>
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl italic text-foreground">Pest Control</h1>
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
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <Card>
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Inspection Schedule</p>
              <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-1">Weekly</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                Required by MPI Food Control Plan
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Inspection</p>
              <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-1">2 days ago</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                No issues found
              </p>
            </CardContent>
          </Card>
          <Card className="col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
              <div className="mt-1">
                <Badge className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-border">Compliant</Badge>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                All pest control measures in place
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Guidelines */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-foreground">MPI Pest Control Requirements</CardTitle>
            <CardDescription>
              Key requirements for pest control compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              {
                title: '1. Regular Inspections',
                desc: 'Inspect all areas of the premises weekly for signs of pest activity. Check traps, bait stations, and look for droppings, gnaw marks, or other evidence.',
              },
              {
                title: '2. Professional Pest Control',
                desc: 'Engage a licensed pest control contractor for regular visits. Maintain records of all contractor visits and treatments applied.',
              },
              {
                title: '3. Documentation',
                desc: 'Record all pest control activities including self-inspections and contractor visits. Keep records for at least 4 years for MPI verification.',
              },
              {
                title: '4. Preventive Measures',
                desc: 'Maintain pest-proofing measures including sealed doors, intact screens, and proper waste management. Store food products off the floor.',
              },
            ].map((item) => (
              <div key={item.title} className="p-4 rounded-md bg-muted/50 space-y-1.5">
                <h4 className="font-medium text-sm text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
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
