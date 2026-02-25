import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LoginForm } from '@/components/auth/login-form'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen auth-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm relative z-10 animate-scale-in">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-white tracking-wide italic">
            In Control
          </h1>
          <p className="text-white/50 text-sm mt-2 tracking-wide uppercase">
            MPI Food Safety Compliance
          </p>
        </div>

        <LoginForm />

        <div className="mt-8 text-center text-xs text-white/30 tracking-wide">
          <p>New Zealand Food Safety Compliance</p>
          <p className="mt-1">Aligned with MPI Regulations</p>
        </div>
      </div>
    </main>
  )
}
