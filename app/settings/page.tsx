import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Settings, Bell, Shield, Store, Users } from 'lucide-react'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  if (!['OWNER', 'FRANCHISE_ADMIN'].includes(session.user.role)) {
    redirect('/dashboard')
  }

  return (
    <DashboardShell>
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your store and application settings
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Store Settings */}
          <Card className="border-0 shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2.5 text-base font-semibold text-foreground">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Store className="h-4 w-4 text-primary" />
                </div>
                Store Settings
              </CardTitle>
              <CardDescription>
                Configure your store details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName" className="text-sm font-medium text-foreground">Store Name</Label>
                <Input id="storeName" placeholder="Your Store Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-foreground">Address</Label>
                <Input id="address" placeholder="Full Address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone</Label>
                <Input id="phone" placeholder="+64 XX XXX XXXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                <Input id="email" type="email" placeholder="store@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registration" className="text-sm font-medium text-foreground">MPI Registration Number</Label>
                <Input id="registration" placeholder="FCP-XXXX-XXX" />
              </div>
              <Button className="w-full rounded-xl">Save Store Settings</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-0 shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2.5 text-base font-semibold text-foreground">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                Notifications
              </CardTitle>
              <CardDescription>
                Configure alert preferences for compliance events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium text-foreground">Temperature Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Notify when temperatures are out of range
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium text-foreground">Task Reminders</Label>
                  <p className="text-xs text-muted-foreground">
                    Remind staff of pending tasks
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium text-foreground">Expiry Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Alert when stock is expiring soon
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium text-foreground">Maintenance Reminders</Label>
                  <p className="text-xs text-muted-foreground">
                    Notify about upcoming equipment service
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button className="w-full rounded-xl">Save Notification Settings</Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-0 shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2.5 text-base font-semibold text-foreground">
                <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                Security
              </CardTitle>
              <CardDescription>
                Manage access and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium text-foreground">Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">
                    Require 2FA for all staff
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium text-foreground">Audit Logging</Label>
                  <p className="text-xs text-muted-foreground">
                    Log all actions for compliance
                  </p>
                </div>
                <Switch defaultChecked disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout" className="text-sm font-medium text-foreground">Session Timeout (minutes)</Label>
                <Input id="sessionTimeout" type="number" defaultValue={60} />
              </div>
              <Button className="w-full rounded-xl">Save Security Settings</Button>
            </CardContent>
          </Card>

          {/* Integration Settings */}
          <Card className="border-0 shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2.5 text-base font-semibold text-foreground">
                <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                </div>
                Integrations
              </CardTitle>
              <CardDescription>
                Connect with external services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 sm:p-3.5 border border-border rounded-xl hover:bg-muted/50 transition-colors duration-200">
                <div>
                  <p className="font-medium text-sm text-foreground">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    SMTP configuration for alerts
                  </p>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-3.5 border border-border rounded-xl hover:bg-muted/50 transition-colors duration-200">
                <div>
                  <p className="font-medium text-sm text-foreground">Backup Storage</p>
                  <p className="text-xs text-muted-foreground">
                    Cloud storage for records
                  </p>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-3.5 border border-border rounded-xl hover:bg-muted/50 transition-colors duration-200">
                <div>
                  <p className="font-medium text-sm text-foreground">SMS Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Text message notifications
                  </p>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
