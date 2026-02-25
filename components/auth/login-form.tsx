'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react'

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
    <div className="glass rounded-2xl shadow-soft-lg p-5 sm:p-8 animate-fade-in-up [animation-delay:0.1s]">
      <div className="mb-5 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Welcome back</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium text-sm">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 h-11"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium text-sm">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 h-11"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full h-11 bg-[hsl(222,47%,20%)] hover:bg-[hsl(222,47%,25%)] dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-[hsl(222,47%,11%)] text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-200/60 dark:border-gray-700/60">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">Demo credentials</p>
        <div className="grid grid-cols-1 gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex justify-between gap-2">
            <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">Admin</span>
            <span className="font-mono truncate">admin@cafecentral.co.nz</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">Owner</span>
            <span className="font-mono truncate">owner.auckland@cafecentral.co.nz</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">Manager</span>
            <span className="font-mono truncate">manager.auckland@cafecentral.co.nz</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">Staff</span>
            <span className="font-mono truncate">staff1@cafecentral.co.nz</span>
          </div>
          <div className="flex justify-between mt-1 pt-1 border-t border-gray-100 dark:border-gray-700">
            <span className="text-gray-400 dark:text-gray-500">Password</span>
            <span className="font-mono font-medium text-gray-600 dark:text-gray-300">password123</span>
          </div>
        </div>
      </div>
    </div>
  )
}
