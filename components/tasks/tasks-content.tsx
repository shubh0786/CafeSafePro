'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { formatTime, getRoleColor } from '@/lib/utils'
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  User,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { completeTask, createTask } from '@/app/actions/tasks'

interface Task {
  id: string
  type: string
  title: string
  description: string | null
  assignedTo: string | null
  dueTime: string | null
  priority: string
  isCompleted: boolean
  completedAt: Date | null
  completedBy: string | null
  notes: string | null
  assignee: { id: string; name: string | null } | null
}

interface User {
  id: string
  name: string | null
  role: string
}

interface ScheduleItem {
  id: string
  title: string
  description: string | null
  dueTime: string | null
  isRequired: boolean
}

interface Schedule {
  id: string
  name: string
  taskType: string
  items: ScheduleItem[]
}

interface TasksContentProps {
  tasks: Task[]
  storeUsers: User[]
  schedules: Schedule[]
  storeId: string
  userId: string
  userRole: string
}

const typeLabels: Record<string, string> = {
  OPENING: 'Opening Tasks',
  DURING_SERVICE: 'During Service',
  CLOSING: 'Closing Tasks',
  WEEKLY: 'Weekly Tasks',
  MONTHLY: 'Monthly Tasks',
}

const priorityColors: Record<string, string> = {
  LOW: 'bg-sky-50 text-sky-700 border-sky-100',
  NORMAL: 'bg-gray-50 text-gray-600 border-gray-100',
  HIGH: 'bg-amber-50 text-amber-700 border-amber-100',
  URGENT: 'bg-red-50 text-red-700 border-red-100',
}

export function TasksContent({
  tasks,
  storeUsers,
  schedules,
  storeId,
  userId,
  userRole,
}: TasksContentProps) {
  const [selectedSchedule, setSelectedSchedule] = useState<string>('')
  const [isCreating, setIsCreating] = useState(false)

  const tasksByType = tasks.reduce((acc, task) => {
    if (!acc[task.type]) {
      acc[task.type] = []
    }
    acc[task.type].push(task)
    return acc
  }, {} as Record<string, Task[]>)

  async function handleCompleteTask(taskId: string) {
    try {
      const result = await completeTask({
        taskId,
        completedBy: userId,
      })

      if (result.success) {
        toast.success('Task completed!')
        window.location.reload()
      } else {
        toast.error(result.error || 'Failed to complete task')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  async function handleCreateFromSchedule() {
    if (!selectedSchedule) return

    setIsCreating(true)
    const schedule = schedules.find((s) => s.id === selectedSchedule)
    if (!schedule) return

    try {
      for (const item of schedule.items) {
        await createTask({
          storeId,
          type: schedule.taskType,
          title: item.title,
          description: item.description,
          dueTime: item.dueTime,
          priority: item.isRequired ? 'HIGH' : 'NORMAL',
          isRecurring: true,
          recurrence: 'daily',
        })
      }

      toast.success(`Created ${schedule.items.length} tasks from ${schedule.name}`)
      window.location.reload()
    } catch (error) {
      toast.error('Failed to create tasks')
    } finally {
      setIsCreating(false)
    }
  }

  const pendingTasks = tasks.filter((t) => !t.isCompleted)
  const completedTasks = tasks.filter((t) => t.isCompleted)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Daily Tasks</h1>
          <p className="text-gray-500 mt-1">
            Manage opening, closing, and daily compliance tasks
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(userRole === 'MANAGER' || userRole === 'OWNER' || userRole === 'FRANCHISE_ADMIN') && (
            <>
              <Select value={selectedSchedule} onValueChange={setSelectedSchedule}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {schedules.map((schedule) => (
                    <SelectItem key={schedule.id} value={schedule.id}>
                      {schedule.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleCreateFromSchedule}
                disabled={!selectedSchedule || isCreating}
                className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Tasks
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{tasks.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ClipboardList className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Pending</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{pendingTasks.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Completed</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{completedTasks.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft bg-white group hover:shadow-soft-md transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {tasks.length > 0
                    ? Math.round((completedTasks.length / tasks.length) * 100)
                    : 0}
                  %
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-5 w-5 text-violet-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          {Object.keys(tasksByType).map((type) => (
            <TabsTrigger key={type} value={type}>
              {typeLabels[type] || type}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {tasks.length === 0 ? (
            <Card className="border-0 shadow-soft">
              <CardContent className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No tasks for today yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Select a template above to create tasks
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={() => handleCompleteTask(task.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-3">
          {pendingTasks.length === 0 ? (
            <Card className="border-0 shadow-soft">
              <CardContent className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                </div>
                <p className="text-gray-500 font-medium">All tasks completed! Great job!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={() => handleCompleteTask(task.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          {completedTasks.length === 0 ? (
            <Card className="border-0 shadow-soft">
              <CardContent className="py-16 text-center">
                <p className="text-gray-400">No completed tasks yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </TabsContent>

        {Object.entries(tasksByType).map(([type, typeTasks]) => (
          <TabsContent key={type} value={type} className="space-y-3">
            <div className="space-y-3">
              {typeTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={() => handleCompleteTask(task.id)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function TaskCard({
  task,
  onComplete,
}: {
  task: Task
  onComplete?: () => void
}) {
  return (
    <Card className={`border-0 shadow-soft bg-white hover:shadow-soft-md transition-all duration-200 ${task.isCompleted ? 'opacity-70' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {onComplete && !task.isCompleted && (
            <Checkbox
              checked={task.isCompleted}
              onCheckedChange={onComplete}
              className="mt-1 rounded-md border-gray-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
            />
          )}
          {task.isCompleted && (
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className={`font-medium text-sm ${
                    task.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'
                  }`}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {task.description}
                  </p>
                )}
              </div>
              <Badge className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
              {task.dueTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Due {task.dueTime}</span>
                </div>
              )}
              {task.assignee && (
                <div className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  <span>{task.assignee.name || 'Unassigned'}</span>
                </div>
              )}
              {task.type && (
                <Badge variant="outline" className="text-[10px] border-gray-200 text-gray-500">
                  {typeLabels[task.type] || task.type}
                </Badge>
              )}
            </div>
            {task.isCompleted && task.completedAt && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                Completed at {formatTime(task.completedAt)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
