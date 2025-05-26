'use client'

/* eslint-disable react/no-unescaped-entities */
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { SortableTableHeader } from '@/components/sortable-table-header'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Text } from '@/components/text'
import { Textarea } from '@/components/textarea'
import { useTableSort } from '@/hooks/useTableSort'
import {
  PaperAirplaneIcon,
  SparklesIcon,
  UserIcon,
  CpuChipIcon,
  CheckCircleIcon,
  FolderIcon,
  CalendarDaysIcon,
  PlusIcon,
} from '@heroicons/react/16/solid'
import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: TaskSuggestion[]
}

interface TaskSuggestion {
  id: string
  title: string
  description: string
  priority: 'High' | 'Medium' | 'Low'
  estimatedDuration: string
  project?: string
}

const initialMessage: Message = {
  id: '1',
  type: 'assistant',
  content: "Hello! I&apos;m your AI Event Planner. I can help you plan events by suggesting tasks, creating project timelines, and organizing everything you need to make your event successful. What event are you planning?",
  timestamp: new Date(),
}

const sampleSuggestions = [
  "Plan a corporate team building event for 50 people",
  "Organize a product launch party",
  "Create a wedding reception timeline",
  "Plan a charity fundraising gala",
]

// Mock projects data
const availableProjects = [
  { id: 1, name: 'Website Redesign' },
  { id: 2, name: 'Mobile App Development' },
  { id: 3, name: 'Security Updates' },
  { id: 4, name: 'Performance Optimization' },
]

function getPriorityBadge(priority: string) {
  switch (priority) {
    case 'High':
      return <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20">High</span>
    case 'Medium':
      return <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20">Medium</span>
    case 'Low':
      return <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/20">Low</span>
    default:
      return <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20">{priority}</span>
  }
}

function TaskSuggestionsTable({ 
  suggestions, 
  messageId, 
  onCreateTask, 
  onCreateAllTasks 
}: { 
  suggestions: TaskSuggestion[]
  messageId: string
  onCreateTask: (task: TaskSuggestion) => void
  onCreateAllTasks: (tasks: TaskSuggestion[]) => void
}) {
  const { sortedData: sortedTasks, sortConfig, handleSort } = useTableSort(suggestions)

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-medium text-zinc-900 dark:text-white">
          Suggested Tasks
        </h4>
        <Button
          onClick={() => onCreateAllTasks(suggestions)}
          className="text-sm"
        >
          <CheckCircleIcon className="h-4 w-4" />
          Create All Tasks
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg bg-white dark:bg-zinc-900">
        <Table>
          <TableHead>
            <TableRow>
              <SortableTableHeader 
                sortKey="title" 
                sortConfig={sortConfig} 
                onSort={handleSort}
                className="pl-8"
              >
                Task
              </SortableTableHeader>
              <SortableTableHeader 
                sortKey="priority" 
                sortConfig={sortConfig} 
                onSort={handleSort}
              >
                Priority
              </SortableTableHeader>
              <SortableTableHeader 
                sortKey="estimatedDuration" 
                sortConfig={sortConfig} 
                onSort={handleSort}
              >
                Duration
              </SortableTableHeader>
              <TableHeader className="w-24 pr-6">Action</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="pl-8">
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-white">
                      {task.title}
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      {task.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getPriorityBadge(task.priority)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                    <CalendarDaysIcon className="h-4 w-4" />
                    {task.estimatedDuration}
                  </div>
                </TableCell>
                <TableCell className="pr-6">
                  <Button
                    onClick={() => onCreateTask(task)}
                    plain
                    className="text-sm"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default function AIPlannerPage() {
  const [messages, setMessages] = useState<Message[]>([initialMessage])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const [selectedProject, setSelectedProject] = useState('new')
  const [newProjectName, setNewProjectName] = useState('')
  const [messageSortConfigs, setMessageSortConfigs] = useState<Record<string, any>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    const textarea = inputRef.current
    if (textarea) {
      const adjustHeight = () => {
        textarea.style.height = 'auto'
        const scrollHeight = textarea.scrollHeight
        const maxHeight = 200 // max-h-[200px]
        textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
      }
      
      adjustHeight()
      textarea.addEventListener('input', adjustHeight)
      
      return () => {
        textarea.removeEventListener('input', adjustHeight)
      }
    }
  }, [inputValue])

  const simulateAIResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    let response = ""
    let suggestions: TaskSuggestion[] = []
    const projectName = getSelectedProjectName()

    // Simple keyword-based responses (in a real app, this would be an actual AI API)
    if (userMessage.toLowerCase().includes('wedding')) {
      response = "Great! Planning a wedding is exciting. Here are some essential tasks I&apos;d recommend for a successful wedding reception. I can create these as tasks in your project management system:"
      suggestions = [
        {
          id: '1',
          title: 'Book venue and catering',
          description: 'Research and book the reception venue, including catering services',
          priority: 'High',
          estimatedDuration: '2-3 weeks',
          project: projectName
        },
        {
          id: '2',
          title: 'Send invitations',
          description: 'Design, print, and send wedding invitations to guests',
          priority: 'High',
          estimatedDuration: '1 week',
          project: projectName
        },
        {
          id: '3',
          title: 'Arrange flowers and decorations',
          description: 'Select and order floral arrangements and venue decorations',
          priority: 'Medium',
          estimatedDuration: '1 week',
          project: projectName
        },
        {
          id: '4',
          title: 'Hire photographer/videographer',
          description: 'Book professional photography and videography services',
          priority: 'High',
          estimatedDuration: '1-2 weeks',
          project: projectName
        }
      ]
    } else if (userMessage.toLowerCase().includes('corporate') || userMessage.toLowerCase().includes('team building')) {
      response = "Excellent! Corporate team building events are great for boosting morale and collaboration. Here's what I recommend for a successful team building event:"
      suggestions = [
        {
          id: '5',
          title: 'Define event objectives',
          description: 'Establish clear goals and outcomes for the team building event',
          priority: 'High',
          estimatedDuration: '2-3 days',
          project: projectName
        },
        {
          id: '6',
          title: 'Book venue and activities',
          description: 'Reserve location and plan engaging team building activities',
          priority: 'High',
          estimatedDuration: '1 week',
          project: projectName
        },
        {
          id: '7',
          title: 'Arrange catering',
          description: 'Order food and beverages for all participants',
          priority: 'Medium',
          estimatedDuration: '3-5 days',
          project: projectName
        },
        {
          id: '8',
          title: 'Send calendar invites',
          description: 'Create and send calendar invitations to all team members',
          priority: 'Medium',
          estimatedDuration: '1 day',
          project: projectName
        }
      ]
    } else if (userMessage.toLowerCase().includes('product launch')) {
      response = "A product launch party is a fantastic way to generate buzz! Here are the key tasks I&apos;d suggest for a memorable launch event:"
      suggestions = [
        {
          id: '9',
          title: 'Develop event concept and theme',
          description: 'Create a compelling theme that aligns with your product brand',
          priority: 'High',
          estimatedDuration: '1 week',
          project: projectName
        },
        {
          id: '10',
          title: 'Create guest list and invitations',
          description: 'Compile VIP list and design branded invitations',
          priority: 'High',
          estimatedDuration: '1 week',
          project: projectName
        },
        {
          id: '11',
          title: 'Coordinate media and PR',
          description: 'Arrange press coverage and social media promotion',
          priority: 'High',
          estimatedDuration: '2 weeks',
          project: projectName
        },
        {
          id: '12',
          title: 'Set up product demonstrations',
          description: 'Prepare interactive demos and product showcases',
          priority: 'Medium',
          estimatedDuration: '1 week',
          project: projectName
        }
      ]
    } else {
      response = "I&apos;d be happy to help you plan your event! Could you provide more details about what type of event you&apos;re organizing? For example:\n\n• What&apos;s the occasion or purpose?\n• How many people will attend?\n• What&apos;s your timeline?\n• Do you have a specific budget in mind?\n\nThe more details you share, the better I can tailor my suggestions to your needs."
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      suggestions: suggestions.length > 0 ? suggestions : undefined
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setHasStartedChat(true)

    try {
      const aiResponse = await simulateAIResponse(userMessage.content)
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: "I apologize, but I&apos;m having trouble processing your request right now. Please try again.",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    inputRef.current?.focus()
  }

  const getSelectedProjectName = () => {
    if (selectedProject === 'new') {
      return newProjectName || 'New Project'
    }
    const project = availableProjects.find(p => p.id.toString() === selectedProject)
    return project?.name || 'Unknown Project'
  }

  const handleCreateTask = (task: TaskSuggestion) => {
    const projectName = getSelectedProjectName()
    // In a real app, this would create the task in your task management system
    alert(`Task "${task.title}" would be created in project "${projectName}"`)
  }

  const handleCreateAllTasks = (tasks: TaskSuggestion[]) => {
    const projectName = getSelectedProjectName()
    // In a real app, this would create all tasks
    alert(`${tasks.length} tasks would be created in project "${projectName}"`)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Heading>AI Event Planner</Heading>
          <Text className="mt-2 text-zinc-500 dark:text-zinc-400">
            Your intelligent assistant for event planning and task management
          </Text>
        </div>
      </div>

      <div className="mt-8">
        {!hasStartedChat ? (
          // Initial state with centered input
          <div className="flex h-full flex-col items-center justify-center px-6">
            <div className="w-full max-w-2xl">
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-4 w-16 h-16 flex items-center justify-center">
                  <SparklesIcon className="h-8 w-8 text-white" />
                </div>
                <Heading level={1} className="mb-2">What event are you planning?</Heading>
                <Text className="text-zinc-600 dark:text-zinc-400">
                  Describe your event and I'll help you create a comprehensive plan with actionable tasks.
                </Text>
              </div>

              <form onSubmit={handleSubmit} className="mb-8">
                <div className="space-y-4">
                  {/* Chat Input */}
                  <div className="rounded-lg bg-white dark:bg-zinc-800 [&_span]:after:!ring-0 [&_span]:after:!ring-transparent">
                    <Textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="e.g., I&apos;m planning a corporate team building event for 50 people..."
                      className="min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent p-4 text-base focus:ring-0 focus:outline-none focus:border-transparent"
                      style={{ outline: 'none', boxShadow: 'none', border: 'none' }}
                      disabled={isLoading}
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSubmit(e)
                        }
                      }}
                    />
                    <div className="flex items-center justify-between p-2">
                      <div className="flex gap-3">
                        <Select 
                          value={selectedProject} 
                          onChange={(e) => setSelectedProject(e.target.value)}
                          className="w-48"
                        >
                          <option value="new">Create New Project</option>
                          {availableProjects.map((project) => (
                            <option key={project.id} value={project.id.toString()}>
                              {project.name}
                            </option>
                          ))}
                        </Select>
                        {selectedProject === 'new' && (
                          <Input
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="New project name..."
                            className="w-48"
                          />
                        )}
                      </div>
                      <Button 
                        type="submit" 
                        disabled={!inputValue.trim() || isLoading}
                        className="h-8 w-8 p-0"
                      >
                        <PaperAirplaneIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </form>

              <div className="space-y-3">
                <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Try these examples:
                </Text>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {sampleSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="rounded-lg bg-zinc-100 p-3 text-left text-sm transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Chat interface
          <div className="space-y-6 px-6 py-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      {message.type === 'user' ? (
                        <div className="rounded-full bg-zinc-200 p-2 dark:bg-zinc-700">
                          <UserIcon className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
                        </div>
                      ) : (
                        <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-2">
                          <CpuChipIcon className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="prose prose-zinc max-w-none dark:prose-invert">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      {message.suggestions && (
                        <TaskSuggestionsTable
                          suggestions={message.suggestions}
                          messageId={message.id}
                          onCreateTask={handleCreateTask}
                          onCreateAllTasks={handleCreateAllTasks}
                        />
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-2">
                        <CpuChipIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-zinc-400"></div>
                        <div className="h-2 w-2 animate-pulse rounded-full bg-zinc-400" style={{ animationDelay: '0.2s' }}></div>
                        <div className="h-2 w-2 animate-pulse rounded-full bg-zinc-400" style={{ animationDelay: '0.4s' }}></div>
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
            <div ref={messagesEndRef} />
          </div>
        )}

        {hasStartedChat && (
          <div className="mt-8 border-t border-zinc-950/5 bg-white px-6 py-4 dark:border-white/5 dark:bg-zinc-900">
            <form onSubmit={handleSubmit}>
              <div className="space-y-3">
                {/* Chat Input */}
                <div className="rounded-lg bg-white dark:bg-zinc-800 [&_span]:after:!ring-0 [&_span]:after:!ring-transparent">
                  <Textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything about your event planning..."
                    className="min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent p-4 text-base focus:ring-0 focus:outline-none focus:border-transparent"
                    style={{ outline: 'none', boxShadow: 'none', border: 'none' }}
                    disabled={isLoading}
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                  <div className="flex items-center justify-between p-2">
                    <div className="flex gap-3">
                      <Select 
                        value={selectedProject} 
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="w-48"
                      >
                        <option value="new">Create New Project</option>
                        {availableProjects.map((project) => (
                          <option key={project.id} value={project.id.toString()}>
                            {project.name}
                          </option>
                        ))}
                      </Select>
                      {selectedProject === 'new' && (
                        <Input
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          placeholder="New project name..."
                          className="w-48"
                        />
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      disabled={!inputValue.trim() || isLoading}
                      className="h-8 w-8 p-0"
                    >
                      <PaperAirplaneIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  )
} 