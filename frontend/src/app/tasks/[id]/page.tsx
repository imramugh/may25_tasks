'use client'

import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Field, FieldGroup, Fieldset, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Link } from '@/components/link'
import { Select } from '@/components/select'
import { Textarea } from '@/components/textarea'
import { Text } from '@/components/text'
import {
  ChevronLeftIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Mock data - in a real app, this would come from your API/database
const mockTasks = [
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
    createdAt: '2024-05-20',
    updatedAt: '2024-05-25',
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
    createdAt: '2024-05-22',
    updatedAt: '2024-05-22',
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
    createdAt: '2024-05-15',
    updatedAt: '2024-05-24',
  },
]

const projects = ['Website Redesign', 'Backend Integration', 'Security Updates', 'UX Research', 'Performance', 'Testing']
const assignees = ['Sarah Chen', 'Mike Johnson', 'Alex Rivera', 'Emma Davis', 'David Kim', 'Lisa Wong']

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

export default function TaskDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [task, setTask] = useState<typeof mockTasks[0] | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    status: 'Open',
    project: '',
    assignee: '',
    tags: '',
  })

  useEffect(() => {
    // In a real app, you'd fetch the task from your API
    const foundTask = mockTasks.find(t => t.id === parseInt(params.id))
    if (foundTask) {
      setTask(foundTask)
      setFormData({
        title: foundTask.title,
        description: foundTask.description,
        priority: foundTask.priority,
        dueDate: foundTask.dueDate,
        status: foundTask.status,
        project: foundTask.project,
        assignee: foundTask.assignee,
        tags: foundTask.tags.join(', '),
      })
    }
  }, [params.id])

  const handleSave = () => {
    // In a real app, you'd save to your API
    console.log('Saving task:', formData)
    
    // Update the task state
    if (task) {
      const updatedTask = {
        ...task,
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        updatedAt: new Date().toISOString().split('T')[0],
      }
      setTask(updatedTask)
    }
    
    alert('Task updated successfully!')
  }

  const handleDelete = () => {
    // In a real app, you'd delete from your API
    if (confirm('Are you sure you want to delete this task?')) {
      console.log('Deleting task:', task?.id)
      router.push('/tasks')
    }
  }

  if (!task) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <Text>Task not found</Text>
          <Link href="/tasks" className="mt-4 inline-block">
            ← Back to Tasks
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/tasks" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400">
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          Back to Tasks
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex-1 mr-6">
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="text-2xl font-bold"
            placeholder="Task title"
          />
          
          <div className="mt-2 flex items-center gap-4">
            {getPriorityBadge(formData.priority)}
            {getStatusBadge(formData.status)}
            <Text className="text-sm text-zinc-500 dark:text-zinc-400">
              Due: {new Date(formData.dueDate).toLocaleDateString()}
            </Text>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button onClick={handleSave}>
            Save Changes
          </Button>
          <Button color="red" onClick={handleDelete}>
            <TrashIcon />
            Delete
          </Button>
        </div>
      </div>

      {/* Task Details */}
      <div className="space-y-8">
        <Fieldset>
          <FieldGroup>
            <Field>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter task description"
                rows={4}
              />
            </Field>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field>
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Select>
              </Field>

              <Field>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                </Select>
              </Field>

              <Field>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </Field>

              <Field>
                <Label>Project</Label>
                <Select
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                >
                  <option value="">Select project</option>
                  {projects.map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </Select>
              </Field>

              <Field>
                <Label>Assignee</Label>
                <Select
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                >
                  <option value="">Select assignee</option>
                  {assignees.map(assignee => (
                    <option key={assignee} value={assignee}>{assignee}</option>
                  ))}
                </Select>
              </Field>

              <Field>
                <Label>Tags</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Enter tags separated by commas"
                />
              </Field>
            </div>
          </FieldGroup>
        </Fieldset>
        
        {/* Read-only Information */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Created
            </Text>
            <Text className="text-zinc-900 dark:text-white">
              {new Date(task.createdAt).toLocaleDateString()}
            </Text>
          </div>

          <div>
            <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Last Updated
            </Text>
            <Text className="text-zinc-900 dark:text-white">
              {new Date(task.updatedAt).toLocaleDateString()}
            </Text>
          </div>
        </div>
      </div>
    </>
  )
} 