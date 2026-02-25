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
  LOW: 'bg-blue-100 text-blue-800',
  NORMAL: 'bg-gray-100 text-gray-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800',
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

  // Group tasks by type
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
      // Create tasks from schedule items
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Daily Tasks</h1>
          <p className="text-muted-foreground mt-1">
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
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Tasks
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingTasks.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedTasks.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.length > 0
                ? Math.round((completedTasks.length / tasks.length) * 100)
                : 0}
              %
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

        <TabsContent value="all" className="space-y-4">
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No tasks for today yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Select a template above to create tasks.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
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

        <TabsContent value="pending" className="space-y-4">
          {pendingTasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <p className="text-muted-foreground">
                  All tasks completed! Great job!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
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

        <TabsContent value="completed" className="space-y-4">
          {completedTasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No completed tasks yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </TabsContent>

        {Object.entries(tasksByType).map(([type, typeTasks]) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <div className="space-y-4">
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
    <Card className={task.isCompleted ? 'opacity-75' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {onComplete && !task.isCompleted && (
            <Checkbox
              checked={task.isCompleted}
              onCheckedChange={onComplete}
              className="mt-1"
            />
          )}
          {task.isCompleted && (
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className={`font-medium ${
                    task.isCompleted ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {task.description}
                  </p>
                )}
              </div>
              <Badge className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              {task.dueTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Due {task.dueTime}</span>
                </div>
              )}
              {task.assignee && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{task.assignee.name || 'Unassigned'}</span>
                </div>
              )}
              {task.type && (
                <Badge variant="outline">{typeLabels[task.type] || task.type}</Badge>
              )}
            </div>
            {task.isCompleted && task.completedAt && (
              <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                Completed at {formatTime(task.completedAt)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
