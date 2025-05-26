export interface Project {
  id: number
  name: string
  description: string
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold'
  progress: number
  dueDate: string
  teamMembers: string[]
  totalTasks: number
  completedTasks: number
  url: string
  avatar?: string | null
}

export interface ProjectTask {
  id: number
  title: string
  description: string
  priority: 'High' | 'Medium' | 'Low'
  dueDate: string
  status: 'Open' | 'In Progress' | 'Completed' | 'Overdue'
  assignee: string
  projectId: number
}

const projects: Project[] = [
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
    url: '/projects/1',
    avatar: null,
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
    url: '/projects/2',
    avatar: null,
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
    url: '/projects/3',
    avatar: null,
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
    url: '/projects/4',
    avatar: null,
  },
]

const projectTasks: ProjectTask[] = [
  // Website Redesign tasks
  {
    id: 1,
    title: 'Design new landing page mockups',
    description: 'Create modern, responsive landing page designs',
    priority: 'High',
    dueDate: '2024-05-28',
    status: 'In Progress',
    assignee: 'Sarah Chen',
    projectId: 1,
  },
  {
    id: 2,
    title: 'Update navigation structure',
    description: 'Redesign the main navigation for better UX',
    priority: 'Medium',
    dueDate: '2024-05-30',
    status: 'Open',
    assignee: 'Mike Johnson',
    projectId: 1,
  },
  {
    id: 3,
    title: 'Implement responsive design',
    description: 'Ensure website works on all device sizes',
    priority: 'High',
    dueDate: '2024-06-05',
    status: 'Open',
    assignee: 'Alex Rivera',
    projectId: 1,
  },
  {
    id: 4,
    title: 'Optimize page load speeds',
    description: 'Improve website performance and loading times',
    priority: 'Medium',
    dueDate: '2024-06-10',
    status: 'Open',
    assignee: 'Sarah Chen',
    projectId: 1,
  },
  // Mobile App Development tasks
  {
    id: 5,
    title: 'Set up development environment',
    description: 'Configure React Native development setup',
    priority: 'High',
    dueDate: '2024-06-01',
    status: 'Completed',
    assignee: 'Emma Davis',
    projectId: 2,
  },
  {
    id: 6,
    title: 'Design app wireframes',
    description: 'Create detailed wireframes for all app screens',
    priority: 'Medium',
    dueDate: '2024-06-10',
    status: 'In Progress',
    assignee: 'David Kim',
    projectId: 2,
  },
  {
    id: 7,
    title: 'Implement user authentication',
    description: 'Build login and registration functionality',
    priority: 'High',
    dueDate: '2024-06-20',
    status: 'Open',
    assignee: 'Lisa Wong',
    projectId: 2,
  },
  // Security Updates tasks
  {
    id: 8,
    title: 'Update user authentication flow',
    description: 'Implement enhanced security measures for user login',
    priority: 'High',
    dueDate: '2024-05-25',
    status: 'Overdue',
    assignee: 'Alex Rivera',
    projectId: 3,
  },
  {
    id: 9,
    title: 'Implement two-factor authentication',
    description: 'Add 2FA support for all user accounts',
    priority: 'High',
    dueDate: '2024-05-28',
    status: 'In Progress',
    assignee: 'Mike Johnson',
    projectId: 3,
  },
  {
    id: 10,
    title: 'Security audit and penetration testing',
    description: 'Conduct comprehensive security assessment',
    priority: 'High',
    dueDate: '2024-05-30',
    status: 'Open',
    assignee: 'Alex Rivera',
    projectId: 3,
  },
  // Performance Optimization tasks
  {
    id: 11,
    title: 'Database query optimization',
    description: 'Optimize slow database queries',
    priority: 'High',
    dueDate: '2024-05-10',
    status: 'Completed',
    assignee: 'David Kim',
    projectId: 4,
  },
  {
    id: 12,
    title: 'Implement caching strategy',
    description: 'Add Redis caching for improved performance',
    priority: 'Medium',
    dueDate: '2024-05-12',
    status: 'Completed',
    assignee: 'Sarah Chen',
    projectId: 4,
  },
]

export async function getProjects(): Promise<Project[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  return projects
}

export async function getProject(id: string): Promise<Project | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  const project = projects.find(p => p.id === parseInt(id))
  return project || null
}

export async function getProjectTasks(projectId: string): Promise<ProjectTask[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  return projectTasks.filter(task => task.projectId === parseInt(projectId))
} 