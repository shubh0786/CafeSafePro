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
    STAFF: 'bg-blue-100 text-blue-800',
    MANAGER: 'bg-purple-100 text-purple-800',
    OWNER: 'bg-orange-100 text-orange-800',
    FRANCHISE_ADMIN: 'bg-red-100 text-red-800',
  }
  return colors[role] || 'bg-gray-100 text-gray-800'
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    COMPLIANT: 'bg-green-100 text-green-800',
    NON_COMPLIANT: 'bg-red-100 text-red-800',
    PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
    CORRECTED: 'bg-blue-100 text-blue-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function getTemperatureStatus(temp: number, min: number, max: number): {
  status: 'good' | 'warning' | 'danger'
  isCompliant: boolean
} {
  if (temp >= min && temp <= max) {
    return { status: 'good', isCompliant: true }
  }
  
  const buffer = (max - min) * 0.2 // 20% buffer for warning
  if (temp >= min - buffer && temp <= max + buffer) {
    return { status: 'warning', isCompliant: false }
  }
  
  return { status: 'danger', isCompliant: false }
}
