import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-NZ', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    STAFF: 'Staff',
    MANAGER: 'Manager',
    OWNER: 'Owner',
    FRANCHISE_ADMIN: 'Franchise Admin',
  }
  return labels[role] || role
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    STAFF: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-800',
    MANAGER: 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/50 dark:text-violet-400 dark:border-violet-800',
    OWNER: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800',
    FRANCHISE_ADMIN: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800',
  }
  return colors[role] || 'bg-secondary text-secondary-foreground'
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    COMPLIANT: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800',
    NON_COMPLIANT: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800',
    PENDING_REVIEW: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800',
    CORRECTED: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-800',
  }
  return colors[status] || 'bg-secondary text-secondary-foreground'
}

export function getTemperatureStatus(temp: number, min: number, max: number): {
  status: 'good' | 'warning' | 'danger'
  isCompliant: boolean
} {
  if (temp >= min && temp <= max) {
    return { status: 'good', isCompliant: true }
  }
  
  const buffer = (max - min) * 0.2
  if (temp >= min - buffer && temp <= max + buffer) {
    return { status: 'warning', isCompliant: false }
  }
  
  return { status: 'danger', isCompliant: false }
}
