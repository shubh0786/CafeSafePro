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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">CafeSafe Pro</h1>
          <p className="text-gray-600">MPI Food Safety Compliance Made Simple</p>
        </div>
        <LoginForm />
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>New Zealand Food Safety Compliance</p>
          <p className="mt-1">Aligned with MPI Regulations</p>
        </div>
      </div>
    </main>
  )
}
