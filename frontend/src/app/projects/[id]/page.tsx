import { Stat } from '@/components/stat'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Heading, Subheading } from '@/components/heading'
import { Link } from '@/components/link'
import { Avatar } from '@/components/avatar'
import { getProject, getProjectTasks } from '@/data/projects'
import { ChevronLeftIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SortableProjectTasksTable } from './sortable-project-tasks-table'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  let project = await getProject(params.id)

  return {
    title: project?.name,
  }
}


export default async function Project({ params }: { params: { id: string } }) {
  let project = await getProject(params.id)
  let tasks = await getProjectTasks(params.id)

  if (!project) {
    notFound()
  }

  // Calculate project statistics
  const overdueTasks = tasks.filter(task => 
    task.status === 'Overdue' || 
    (task.status !== 'Completed' && new Date(task.dueDate) < new Date())
  ).length

  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length
  const completedTasks = tasks.filter(task => task.status === 'Completed').length
  const totalTasks = tasks.length

  // Calculate progress percentage
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <>
      <div className="max-lg:hidden">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400">
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          Projects
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="w-32 shrink-0">
            <Avatar 
              src={project.avatar} 
              initials={project.name.split(' ').map((word: string) => word[0]).join('').slice(0, 2)}
              className="size-32"
              square={true}
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Heading>{project.name}</Heading>
              <Badge color={project.status === 'Completed' ? 'green' : project.status === 'In Progress' ? 'blue' : project.status === 'Planning' ? 'yellow' : 'zinc'}>
                {project.status}
              </Badge>
            </div>
            <div className="mt-2 text-sm/6 text-zinc-500">
              Due {new Date(project.dueDate).toLocaleDateString()} <span aria-hidden="true">·</span> {project.teamMembers.length} team members
            </div>
            <div className="mt-1 text-sm/6 text-zinc-600">
              {project.description}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button outline href={`/projects/${params.id}/edit`}>Edit</Button>
          <Button href={`/tasks/new?project=${params.id}`}>Add Task</Button>
        </div>
      </div>
      <div className="mt-8 grid gap-8 sm:grid-cols-4">
        <Stat 
          title="Total Tasks" 
          value={totalTasks.toString()} 
          change={`${progressPercentage}% complete`} 
        />
        <Stat
          title="Completed Tasks"
          value={completedTasks.toString()}
          change={`${totalTasks - completedTasks} remaining`}
        />
        <Stat 
          title="In Progress" 
          value={inProgressTasks.toString()} 
          change={`${Math.round((inProgressTasks / totalTasks) * 100) || 0}% of total`} 
        />
        <Stat 
          title="Overdue Tasks" 
          value={overdueTasks.toString()} 
          change={overdueTasks > 0 ? "Needs attention" : "On track"} 
        />
      </div>
      <Subheading className="mt-12">Project Tasks</Subheading>
      <SortableProjectTasksTable tasks={tasks} />
    </>
  )
} 