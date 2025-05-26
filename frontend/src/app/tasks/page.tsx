'use client'

import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Input, InputGroup } from '@/components/input'
import { Select } from '@/components/select'
import { SortableTableHeader } from '@/components/sortable-table-header'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Text } from '@/components/text'
import { Link } from '@/components/link'
import { useTableSort } from '@/hooks/useTableSort'
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  Squares2X2Icon,
  ViewColumnsIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/16/solid'
import { useState } from 'react'

// Mock data
const tasks = [
  {
    id: 1,
    title: 'Design new landing page mockups',
    description: 'Create wireframes and high-fidelity mockups for the new landing page',
    priority: 'High',
    dueDate: '2024-05-28',
    status: 'In Progress',
    project: 'Website Redesign',
    assignee: 'Sarah Chen',
    tags: ['design', 'ui/ux'],
  },
  {
    id: 2,
    title: 'Review API documentation',
    description: 'Go through the API docs and update any outdated information',
    priority: 'Medium',
    dueDate: '2024-05-30',
    status: 'Open',
    project: 'Backend Integration',
    assignee: 'Mike Johnson',
    tags: ['documentation', 'api'],
  },
  {
    id: 3,
    title: 'Update user authentication flow',
    description: 'Implement new security measures for user login',
    priority: 'High',
    dueDate: '2024-05-25',
    status: 'Overdue',
    project: 'Security Updates',
    assignee: 'Alex Rivera',
    tags: ['security', 'backend'],
  },
  {
    id: 4,
    title: 'Conduct user testing sessions',
    description: 'Schedule and run usability tests with 10 participants',
    priority: 'Medium',
    dueDate: '2024-06-02',
    status: 'Open',
    project: 'UX Research',
    assignee: 'Emma Davis',
    tags: ['research', 'testing'],
  },
  {
    id: 5,
    title: 'Optimize database queries',
    description: 'Improve performance of slow-running database queries',
    priority: 'Low',
    dueDate: '2024-06-05',
    status: 'Open',
    project: 'Performance',
    assignee: 'David Kim',
    tags: ['performance', 'database'],
  },
  {
    id: 6,
    title: 'Write unit tests for payment module',
    description: 'Add comprehensive test coverage for payment processing',
    priority: 'Medium',
    dueDate: '2024-06-01',
    status: 'Open',
    project: 'Testing',
    assignee: 'Lisa Wong',
    tags: ['testing', 'backend'],
  },
]

type ViewType = 'list' | 'grid' | 'calendar'
type CalendarViewType = 'day' | 'week' | 'month' | 'year'

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

function TaskCard({ task }: { task: typeof tasks[0] }) {
  return (
    <div className="rounded-lg border border-zinc-950/5 bg-white p-6 dark:border-white/5 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link href={`/tasks/${task.id}`} className="font-semibold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
            {task.title}
          </Link>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{task.description}</p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getPriorityBadge(task.priority)}
              {getStatusBadge(task.status)}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CalendarView() {
  const [calendarView, setCalendarView] = useState<CalendarViewType>('month')
  const [currentDate, setCurrentDate] = useState(new Date())

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    
    switch (calendarView) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
        break
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
        break
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
        break
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1))
        break
    }
    
    setCurrentDate(newDate)
  }

  const getDateTitle = () => {
    switch (calendarView) {
      case 'day':
        return currentDate.toLocaleDateString('en-US', { 
          weekday: 'long',
          month: 'long', 
          day: 'numeric',
          year: 'numeric' 
        })
      case 'week':
        const weekStart = new Date(currentDate)
        weekStart.setDate(currentDate.getDate() - currentDate.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      case 'month':
        return currentDate.toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        })
      case 'year':
        return currentDate.getFullYear().toString()
    }
  }

  const renderDayView = () => {
    const dateStr = currentDate.toISOString().split('T')[0]
    const dayTasks = tasks.filter(task => task.dueDate === dateStr)
    
    return (
      <div className="mt-6">
        <div className="space-y-4">
          {dayTasks.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
              No tasks scheduled for this day
            </div>
          ) : (
            dayTasks.map(task => (
              <div key={task.id} className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-zinc-900 dark:text-white">{task.title}</h4>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{task.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      {getPriorityBadge(task.priority)}
                      {getStatusBadge(task.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekStart = new Date(currentDate)
    weekStart.setDate(currentDate.getDate() - currentDate.getDay())
    
    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      const dateStr = day.toISOString().split('T')[0]
      const dayTasks = tasks.filter(task => task.dueDate === dateStr)
      
      weekDays.push(
        <div key={i} className="min-h-[200px] border border-zinc-200 p-3 dark:border-zinc-700">
          <div className="font-medium text-zinc-900 dark:text-white mb-2">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {day.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div>{day.getDate()}</div>
          </div>
          <div className="space-y-1">
            {dayTasks.map(task => (
              <div
                key={task.id}
                className="truncate rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {task.title}
              </div>
            ))}
          </div>
        </div>
      )
    }
    
    return (
      <div className="mt-6">
        <div className="grid grid-cols-7 gap-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="border border-zinc-200 bg-zinc-50 p-2 text-center font-medium dark:border-zinc-700 dark:bg-zinc-800">
              {day}
            </div>
          ))}
          {weekDays}
        </div>
      </div>
    )
  }

  const renderMonthView = () => {
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
    
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const dayTasks = tasks.filter(task => task.dueDate === dateStr)
      
      days.push(
        <div key={day} className="min-h-[100px] border border-zinc-200 p-2 dark:border-zinc-700">
          <div className="font-medium text-zinc-900 dark:text-white">{day}</div>
          {dayTasks.map(task => (
            <div
              key={task.id}
              className="mt-1 truncate rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {task.title}
            </div>
          ))}
        </div>
      )
    }
    
    return (
      <div className="mt-6">
        <div className="grid grid-cols-7 gap-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="border border-zinc-200 bg-zinc-50 p-2 text-center font-medium dark:border-zinc-700 dark:bg-zinc-800">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    )
  }

  const renderYearView = () => {
    const currentYear = currentDate.getFullYear()
    const months = []
    
    for (let month = 0; month < 12; month++) {
      const monthTasks = tasks.filter(task => {
        const taskDate = new Date(task.dueDate)
        return taskDate.getFullYear() === currentYear && taskDate.getMonth() === month
      })
      
      months.push(
        <div key={month} className="border border-zinc-200 p-4 dark:border-zinc-700">
          <div className="font-medium text-zinc-900 dark:text-white mb-3">
            {new Date(currentYear, month).toLocaleDateString('en-US', { month: 'long' })}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            {monthTasks.length} task{monthTasks.length !== 1 ? 's' : ''}
          </div>
          <div className="mt-2 space-y-1">
            {monthTasks.slice(0, 3).map(task => (
              <div key={task.id} className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {task.title}
              </div>
            ))}
            {monthTasks.length > 3 && (
              <div className="text-xs text-zinc-400">
                +{monthTasks.length - 3} more
              </div>
            )}
          </div>
        </div>
      )
    }
    
    return (
      <div className="mt-6">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
          {months}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6">
      {/* Calendar Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button plain onClick={() => navigateDate('prev')}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white min-w-[200px] text-center">
            {getDateTitle()}
          </h3>
          <Button plain onClick={() => navigateDate('next')}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            {...(calendarView === 'day' ? { color: 'dark/zinc' } : { plain: true })}
            onClick={() => setCalendarView('day')}
            className="px-3 py-1 text-sm"
          >
            Day
          </Button>
          <Button
            {...(calendarView === 'week' ? { color: 'dark/zinc' } : { plain: true })}
            onClick={() => setCalendarView('week')}
            className="px-3 py-1 text-sm"
          >
            Week
          </Button>
          <Button
            {...(calendarView === 'month' ? { color: 'dark/zinc' } : { plain: true })}
            onClick={() => setCalendarView('month')}
            className="px-3 py-1 text-sm"
          >
            Month
          </Button>
          <Button
            {...(calendarView === 'year' ? { color: 'dark/zinc' } : { plain: true })}
            onClick={() => setCalendarView('year')}
            className="px-3 py-1 text-sm"
          >
            Year
          </Button>
        </div>
      </div>

      {/* Calendar Content */}
      {calendarView === 'day' && renderDayView()}
      {calendarView === 'week' && renderWeekView()}
      {calendarView === 'month' && renderMonthView()}
      {calendarView === 'year' && renderYearView()}
    </div>
  )
}

export default function TasksPage() {
  const [view, setView] = useState<ViewType>('list')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const { sortedData: sortedTasks, sortConfig, handleSort } = useTableSort(filteredTasks)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Heading>Tasks</Heading>
          <Text className="mt-2 text-zinc-500 dark:text-zinc-400">
            Manage and track your tasks across all projects
          </Text>
        </div>
        <Button href="/tasks/new">
          <PlusIcon />
          New Task
        </Button>
      </div>

      {/* Filters and View Toggle */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="flex-1 max-w-lg">
            <InputGroup>
              <MagnifyingGlassIcon />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>
          
          <div className="w-36">
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </Select>
          </div>
          
          <div className="w-32">
            <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="all">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            {...(view === 'list' ? { color: 'dark/zinc' } : { plain: true })}
            onClick={() => setView('list')}
            className="px-3"
          >
            <ViewColumnsIcon className="h-4 w-4" />
          </Button>
          <Button
            {...(view === 'grid' ? { color: 'dark/zinc' } : { plain: true })}
            onClick={() => setView('grid')}
            className="px-3"
          >
            <Squares2X2Icon className="h-4 w-4" />
          </Button>
          <Button
            {...(view === 'calendar' ? { color: 'dark/zinc' } : { plain: true })}
            onClick={() => setView('calendar')}
            className="px-3"
          >
            <CalendarDaysIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content based on view */}
      {view === 'list' && (
        <div className="mt-6">
          <Table>
            <TableHead>
              <TableRow>
                <SortableTableHeader sortKey="title" sortConfig={sortConfig} onSort={handleSort}>
                  Task
                </SortableTableHeader>
                <SortableTableHeader sortKey="priority" sortConfig={sortConfig} onSort={handleSort}>
                  Priority
                </SortableTableHeader>
                <SortableTableHeader sortKey="dueDate" sortConfig={sortConfig} onSort={handleSort}>
                  Due Date
                </SortableTableHeader>
                <SortableTableHeader sortKey="status" sortConfig={sortConfig} onSort={handleSort}>
                  Status
                </SortableTableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTasks.map((task) => (
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
                      <div>
                        <Link href={`/tasks/${task.id}`} className="font-medium hover:text-blue-600 dark:hover:text-blue-400">
                          {task.title}
                        </Link>
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">
                          {task.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell>
                    <time dateTime={task.dueDate}>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </time>
                  </TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {view === 'grid' && (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {view === 'calendar' && <CalendarView />}
    </>
  )
} 