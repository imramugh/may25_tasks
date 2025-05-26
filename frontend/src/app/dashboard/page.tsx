import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Text } from '@/components/text'
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FolderIcon,
  PlusIcon,
} from '@heroicons/react/16/solid'
import { ChartBarIcon } from '@heroicons/react/20/solid'

// Mock data - in a real app, this would come from your API/database
const dashboardStats = {
  openTasks: 24,
  closedTasks: 156,
  totalProjects: 8,
  overdueTasks: 3,
}

const recentTasks = [
  {
    id: 1,
    description: 'Design new landing page mockups',
    priority: 'High',
    dueDate: '2024-05-28',
    status: 'In Progress',
    project: 'Website Redesign',
    assignee: 'Sarah Chen',
  },
  {
    id: 2,
    description: 'Review API documentation',
    priority: 'Medium',
    dueDate: '2024-05-30',
    status: 'Open',
    project: 'Backend Integration',
    assignee: 'Mike Johnson',
  },
  {
    id: 3,
    description: 'Update user authentication flow',
    priority: 'High',
    dueDate: '2024-05-25',
    status: 'Overdue',
    project: 'Security Updates',
    assignee: 'Alex Rivera',
  },
  {
    id: 4,
    description: 'Conduct user testing sessions',
    priority: 'Medium',
    dueDate: '2024-06-02',
    status: 'Open',
    project: 'UX Research',
    assignee: 'Emma Davis',
  },
  {
    id: 5,
    description: 'Optimize database queries',
    priority: 'Low',
    dueDate: '2024-06-05',
    status: 'Open',
    project: 'Performance',
    assignee: 'David Kim',
  },
]

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue' 
}: { 
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color?: 'blue' | 'green' | 'yellow' | 'red'
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400',
    yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/50 dark:text-yellow-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400',
  }

  return (
    <div className="rounded-lg border border-zinc-950/5 bg-white p-6 dark:border-white/5 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div>
          <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</Text>
          <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{value}</div>
        </div>
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case 'High':
      return <Badge color="red">{priority}</Badge>
    case 'Medium':
      return <Badge color="yellow">{priority}</Badge>
    case 'Low':
      return <Badge color="green">{priority}</Badge>
    default:
      return <Badge>{priority}</Badge>
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'Completed':
      return <Badge color="green">{status}</Badge>
    case 'In Progress':
      return <Badge color="blue">{status}</Badge>
    case 'Overdue':
      return <Badge color="red">{status}</Badge>
    case 'Open':
      return <Badge color="zinc">{status}</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <Heading>Dashboard</Heading>
          <Text className="mt-2 text-zinc-500 dark:text-zinc-400">
            Overview of your tasks and projects
          </Text>
        </div>
        <Button href="/tasks">
          <PlusIcon />
          New Task
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Open Tasks"
          value={dashboardStats.openTasks}
          icon={ChartBarIcon}
          color="blue"
        />
        <StatCard
          title="Completed Tasks"
          value={dashboardStats.closedTasks}
          icon={CheckCircleIcon}
          color="green"
        />
        <StatCard
          title="Active Projects"
          value={dashboardStats.totalProjects}
          icon={FolderIcon}
          color="blue"
        />
        <StatCard
          title="Overdue Tasks"
          value={dashboardStats.overdueTasks}
          icon={ExclamationTriangleIcon}
          color="red"
        />
      </div>

      {/* Recent Tasks Table */}
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <Heading level={2}>Recent Tasks</Heading>
          <Button href="/tasks" outline>
            View All Tasks
          </Button>
        </div>
        
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Assignee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {task.status === 'Completed' ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : task.status === 'Overdue' ? (
                          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                        ) : (
                          <ClockIcon className="h-5 w-5 text-zinc-400" />
                        )}
                      </div>
                      <span>{task.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell>
                    <time dateTime={task.dueDate}>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </time>
                  </TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>
                    <span className="text-sm text-zinc-600 dark:text-zinc-300">
                      {task.project}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-zinc-600 dark:text-zinc-300">
                      {task.assignee}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
} 