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
  CheckIcon,
} from '@heroicons/react/16/solid'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

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

function NewTaskForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    status: 'Open',
    project: projectId || '',
    assignee: '',
    tags: '',
  })

  const handleSave = () => {
    // In a real app, you'd save to your API
    console.log('Creating new task:', formData)
    
    // Basic validation
    if (!formData.title.trim()) {
      alert('Please enter a task title')
      return
    }
    
    if (!formData.dueDate) {
      alert('Please select a due date')
      return
    }
    
    // Simulate API call
    alert('Task created successfully!')
    
    // Navigate back to tasks or project page
    if (projectId) {
      router.push(`/projects/${projectId}`)
    } else {
      router.push('/tasks')
    }
  }

  const handleCancel = () => {
    // Navigate back without saving
    if (projectId) {
      router.push(`/projects/${projectId}`)
    } else {
      router.push('/tasks')
    }
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link 
          href={projectId ? `/projects/${projectId}` : "/tasks"} 
          className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400"
        >
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          Back to {projectId ? 'Project' : 'Tasks'}
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex-1 mr-6">
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="text-2xl font-bold"
            placeholder="Enter task title..."
          />
          
          <div className="mt-2 flex items-center gap-4">
            {getPriorityBadge(formData.priority)}
            {getStatusBadge(formData.status)}
            {formData.dueDate && (
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                Due: {new Date(formData.dueDate).toLocaleDateString()}
              </Text>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button outline onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <CheckIcon />
            Create Task
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
                placeholder="Enter task description..."
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
      </div>
    </>
  )
}

export default function NewTaskPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewTaskForm />
    </Suspense>
  )
} 