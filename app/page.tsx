import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LoginForm } from '@/components/auth/login-form'
import { ShieldCheck } from 'lucide-react'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen animated-gradient relative overflow-hidden flex items-center justify-center p-4">
      {/* Decorative floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl animate-float hidden sm:block" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl animate-float [animation-delay:1.5s] hidden sm:block" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 backdrop-blur-sm mb-4 shadow-soft border border-amber-500/20">
            <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8 text-amber-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
            In Control
          </h1>
          <p className="text-white/70 text-base sm:text-lg">
            MPI Food Safety Compliance Made Simple
          </p>
        </div>

        <LoginForm />

        <div className="mt-6 sm:mt-8 text-center text-sm text-white/50">
          <p>New Zealand Food Safety Compliance</p>
          <p className="mt-1">Aligned with MPI Regulations</p>
        </div>
      </div>
    </main>
  )
}
