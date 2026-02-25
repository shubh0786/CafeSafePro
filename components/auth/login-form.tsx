'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Invalid email or password')
        return
      }

      toast.success('Login successful!')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 sm:p-8 shadow-lg">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Sign In</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your credentials to continue
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-10"
          />
        </div>
        <Button type="submit" className="w-full h-10" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-border">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-3">Demo Credentials</p>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between"><span>Admin</span><span className="font-mono">admin@cafecentral.co.nz</span></div>
          <div className="flex justify-between"><span>Owner</span><span className="font-mono text-[11px]">owner.auckland@cafecentral.co.nz</span></div>
          <div className="flex justify-between"><span>Manager</span><span className="font-mono text-[11px]">manager.auckland@cafecentral.co.nz</span></div>
          <div className="flex justify-between"><span>Staff</span><span className="font-mono">staff1@cafecentral.co.nz</span></div>
          <div className="flex justify-between mt-2 pt-2 border-t border-border">
            <span>Password</span>
            <span className="font-mono font-medium text-foreground">password123</span>
          </div>
        </div>
      </div>
    </div>
  )
}
