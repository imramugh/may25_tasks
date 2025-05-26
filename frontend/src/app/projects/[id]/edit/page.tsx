'use client'

import { Avatar } from '@/components/avatar'
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
  CameraIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Mock project data - in a real app, this would come from your API
const mockProjects = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design and improved user experience',
    status: 'In Progress',
    priority: 'High',
    startDate: '2024-05-01',
    dueDate: '2024-07-15',
    budget: '50000',
    teamMembers: ['Sarah Chen', 'Mike Johnson', 'Alex Rivera'],
    tags: ['design', 'frontend', 'ux'],
    avatar: null as string | null, // Will be set to uploaded image or generated
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native iOS and Android app for customer engagement',
    status: 'Planning',
    priority: 'Medium',
    startDate: '2024-06-01',
    dueDate: '2024-12-31',
    budget: '75000',
    teamMembers: ['Emma Davis', 'David Kim'],
    tags: ['mobile', 'ios', 'android'],
    avatar: null as string | null,
  },
]

const teamMembers = ['Sarah Chen', 'Mike Johnson', 'Alex Rivera', 'Emma Davis', 'David Kim', 'Lisa Wong', 'John Smith', 'Jane Doe']

function getStatusBadge(status: string) {
  switch (status) {
    case 'Completed':
      return <Badge color="green">{status}</Badge>
    case 'In Progress':
      return <Badge color="blue">{status}</Badge>
    case 'Planning':
      return <Badge color="yellow">{status}</Badge>
    case 'On Hold':
      return <Badge color="red">{status}</Badge>
    default:
      return <Badge color="zinc">{status}</Badge>
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

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [project, setProject] = useState<typeof mockProjects[0] | null>(null)
  const [projectAvatar, setProjectAvatar] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    startDate: '',
    dueDate: '',
    budget: '',
    teamMembers: [] as string[],
    tags: '',
  })

  useEffect(() => {
    // In a real app, you'd fetch the project from your API
    const foundProject = mockProjects.find(p => p.id === params.id)
    if (foundProject) {
      setProject(foundProject)
      setFormData({
        name: foundProject.name,
        description: foundProject.description,
        status: foundProject.status,
        priority: foundProject.priority,
        startDate: foundProject.startDate,
        dueDate: foundProject.dueDate,
        budget: foundProject.budget,
        teamMembers: foundProject.teamMembers,
        tags: foundProject.tags.join(', '),
      })
      setProjectAvatar(foundProject.avatar)
    }
  }, [params.id])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you'd upload this to your server/cloud storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProjectAvatar(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    // In a real app, you'd save to your API
    console.log('Saving project:', formData)
    
    // Basic validation
    if (!formData.name.trim()) {
      alert('Please enter a project name')
      return
    }
    
    if (!formData.dueDate) {
      alert('Please select a due date')
      return
    }
    
    // Update the project state
    if (project) {
      const updatedProject = {
        ...project,
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        avatar: projectAvatar,
      }
      setProject(updatedProject)
    }
    
    alert('Project updated successfully!')
    router.push(`/projects/${params.id}`)
  }

  const handleDelete = () => {
    // In a real app, you'd delete from your API
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      console.log('Deleting project:', project?.id)
      router.push('/projects')
    }
  }

  const handleCancel = () => {
    router.push(`/projects/${params.id}`)
  }

  const handleTeamMemberToggle = (member: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(member)
        ? prev.teamMembers.filter(m => m !== member)
        : [...prev.teamMembers, member]
    }))
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <Text>Project not found</Text>
        <Link href="/projects" className="mt-4 inline-block">
          ← Back to Projects
        </Link>
      </div>
    )
  }

  // Generate initials for avatar fallback
  const initials = formData.name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href={`/projects/${params.id}`} className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400">
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          Back to Project
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-6 flex-1 mr-6">
          {/* Project Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar 
              src={projectAvatar} 
              initials={initials}
              className="size-24"
              square={true}
            />
            <button
              onClick={handleAvatarClick}
              className="absolute -bottom-1 -right-1 rounded-full bg-blue-600 p-2 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <CameraIcon className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Project Info */}
          <div className="flex-1">
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="text-2xl font-bold"
              placeholder="Enter project name..."
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
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button outline onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <CheckIcon />
            Save Changes
          </Button>
          <Button color="red" onClick={handleDelete}>
            <TrashIcon />
            Delete
          </Button>
        </div>
      </div>

      {/* Project Details */}
      <div className="space-y-8">
        <Fieldset>
          <FieldGroup>
            <Field>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter project description..."
                rows={4}
              />
            </Field>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </Select>
              </Field>

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
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
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
                <Label>Budget</Label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="Enter budget amount"
                />
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

            <Field>
              <Label>Team Members</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {teamMembers.map(member => (
                  <label key={member} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.teamMembers.includes(member)}
                      onChange={() => handleTeamMemberToggle(member)}
                      className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{member}</span>
                  </label>
                ))}
              </div>
            </Field>
          </FieldGroup>
        </Fieldset>
      </div>
    </>
  )
} 