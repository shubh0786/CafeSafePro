import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bug, Plus, CheckCircle, AlertCircle, Calendar, ClipboardCheck } from 'lucide-react'
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
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Pest Control</h1>
            <p className="text-muted-foreground mt-1">
              Track pest control inspections and contractor visits
            </p>
          </div>
          <Button asChild className="rounded-xl">
            <Link href="/records">
              <Plus className="mr-2 h-4 w-4" />
              New Inspection Record
            </Link>
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <Card className="border-0 shadow-soft group hover:shadow-soft-md transition-all duration-300">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Inspection Schedule</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground mt-2">Weekly</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Required by MPI Food Control Plan
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-5 w-5 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft group hover:shadow-soft-md transition-all duration-300">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Inspection</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground mt-2">2 days ago</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    No issues found
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2 lg:col-span-1 border-0 shadow-soft group hover:shadow-soft-md transition-all duration-300">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                  <div className="mt-2">
                    <Badge className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-border">Compliant</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    All pest control measures in place
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ClipboardCheck className="h-5 w-5 text-sky-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guidelines */}
        <Card className="border-0 shadow-soft">
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
              <div key={item.title} className="p-4 rounded-xl bg-muted/50 space-y-1.5">
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
          <Button asChild variant="outline" className="rounded-xl border-border">
            <Link href="/records?type=PEST_CONTROL">
              View Inspection Records
            </Link>
          </Button>
          <Button asChild className="rounded-xl">
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
