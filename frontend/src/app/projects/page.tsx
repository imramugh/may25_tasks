'use client'

import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Text } from '@/components/text'
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/16/solid'
import { useState } from 'react'

// Mock data
const projects = [
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design and improved UX',
    status: 'In Progress',
    progress: 65,
    dueDate: '2024-06-15',
    teamMembers: ['Sarah Chen', 'Mike Johnson', 'Alex Rivera'],
    totalTasks: 12,
    completedTasks: 8,
    color: 'blue',
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description: 'Native iOS and Android app for customer engagement',
    status: 'Planning',
    progress: 15,
    dueDate: '2024-08-30',
    teamMembers: ['Emma Davis', 'David Kim', 'Lisa Wong'],
    totalTasks: 25,
    completedTasks: 4,
    color: 'green',
  },
  {
    id: 3,
    name: 'Security Updates',
    description: 'Implementation of enhanced security measures across all systems',
    status: 'In Progress',
    progress: 80,
    dueDate: '2024-05-30',
    teamMembers: ['Alex Rivera', 'Mike Johnson'],
    totalTasks: 8,
    completedTasks: 6,
    color: 'red',
  },
  {
    id: 4,
    name: 'Performance Optimization',
    description: 'Database and application performance improvements',
    status: 'Completed',
    progress: 100,
    dueDate: '2024-05-15',
    teamMembers: ['David Kim', 'Sarah Chen'],
    totalTasks: 6,
    completedTasks: 6,
    color: 'emerald',
  },
]

const projectTasks = {
  1: [
    {
      id: 1,
      title: 'Design new landing page mockups',
      priority: 'High',
      dueDate: '2024-05-28',
      status: 'In Progress',
      assignee: 'Sarah Chen',
    },
    {
      id: 2,
      title: 'Update navigation structure',
      priority: 'Medium',
      dueDate: '2024-05-30',
      status: 'Open',
      assignee: 'Mike Johnson',
    },
    {
      id: 3,
      title: 'Implement responsive design',
      priority: 'High',
      dueDate: '2024-06-05',
      status: 'Open',
      assignee: 'Alex Rivera',
    },
  ],
  2: [
    {
      id: 4,
      title: 'Set up development environment',
      priority: 'High',
      dueDate: '2024-06-01',
      status: 'Completed',
      assignee: 'Emma Davis',
    },
    {
      id: 5,
      title: 'Design app wireframes',
      priority: 'Medium',
      dueDate: '2024-06-10',
      status: 'In Progress',
      assignee: 'David Kim',
    },
  ],
  3: [
    {
      id: 6,
      title: 'Update user authentication flow',
      priority: 'High',
      dueDate: '2024-05-25',
      status: 'Overdue',
      assignee: 'Alex Rivera',
    },
    {
      id: 7,
      title: 'Implement two-factor authentication',
      priority: 'High',
      dueDate: '2024-05-28',
      status: 'In Progress',
      assignee: 'Mike Johnson',
    },
  ],
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'Completed':
      return <Badge color="green">{status}</Badge>
    case 'In Progress':
      return <Badge color="blue">{status}</Badge>
    case 'Planning':
      return <Badge color="yellow">{status}</Badge>
    case 'On Hold':
      return <Badge color="zinc">{status}</Badge>
    default:
      return <Badge>{status}</Badge>
  }
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

function getTaskStatusBadge(status: string) {
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

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const [showTasks, setShowTasks] = useState(false)
  const tasks = projectTasks[project.id as keyof typeof projectTasks] || []

  return (
    <div className="rounded-lg border border-zinc-950/5 bg-white p-6 dark:border-white/5 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 bg-${project.color}-100 text-${project.color}-600 dark:bg-${project.color}-950/50 dark:text-${project.color}-400`}>
              <FolderIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">{project.name}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{project.description}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            {getStatusBadge(project.status)}
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <CalendarDaysIcon className="h-4 w-4" />
              Due: {new Date(project.dueDate).toLocaleDateString()}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Progress</span>
              <span className="font-medium text-zinc-900 dark:text-white">{project.progress}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className={`h-2 rounded-full bg-${project.color}-500`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <CheckCircleIcon className="h-4 w-4" />
                {project.completedTasks}/{project.totalTasks} tasks
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <UserGroupIcon className="h-4 w-4" />
                {project.teamMembers.length} members
              </div>
            </div>
            <Button
              plain
              onClick={() => setShowTasks(!showTasks)}
              className="text-sm"
            >
              {showTasks ? 'Hide Tasks' : 'View Tasks'}
            </Button>
          </div>

          {showTasks && tasks.length > 0 && (
            <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-700">
              <h4 className="font-medium text-zinc-900 dark:text-white mb-3">Project Tasks</h4>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
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
                      <div>
                        <div className="font-medium text-sm text-zinc-900 dark:text-white">{task.title}</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {task.assignee} • Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(task.priority)}
                      {getTaskStatusBadge(task.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'In Progress').length,
    completedProjects: projects.filter(p => p.status === 'Completed').length,
    totalTasks: projects.reduce((sum, p) => sum + p.totalTasks, 0),
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <Heading>Projects</Heading>
          <Text className="mt-2 text-zinc-500 dark:text-zinc-400">
            Manage your projects and track progress across teams
          </Text>
        </div>
        <Button>
          <PlusIcon />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-zinc-950/5 bg-white p-6 dark:border-white/5 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Projects</Text>
              <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{stats.totalProjects}</div>
            </div>
            <div className="rounded-lg p-3 bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <FolderIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-950/5 bg-white p-6 dark:border-white/5 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Projects</Text>
              <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{stats.activeProjects}</div>
            </div>
            <div className="rounded-lg p-3 bg-yellow-50 text-yellow-600 dark:bg-yellow-950/50 dark:text-yellow-400">
              <ChartBarIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-950/5 bg-white p-6 dark:border-white/5 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Completed</Text>
              <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{stats.completedProjects}</div>
            </div>
            <div className="rounded-lg p-3 bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-950/5 bg-white p-6 dark:border-white/5 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Tasks</Text>
              <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{stats.totalTasks}</div>
            </div>
            <div className="rounded-lg p-3 bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <ClockIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mt-8">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="mt-12 text-center">
          <FolderIcon className="mx-auto h-12 w-12 text-zinc-400" />
          <h3 className="mt-2 text-sm font-medium text-zinc-900 dark:text-white">No projects found</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new project.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button>
                <PlusIcon />
                New Project
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 