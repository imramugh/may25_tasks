import { Avatar } from '@/components/avatar'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/dropdown'
import { Heading } from '@/components/heading'
import { Input, InputGroup } from '@/components/input'
import { Link } from '@/components/link'
import { Select } from '@/components/select'
import { getProjects, type Project } from '@/data/projects'
import { EllipsisVerticalIcon, MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
}

export default async function Projects() {
  let projects = await getProjects()

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Projects</Heading>
          <div className="mt-4 flex max-w-xl gap-4">
            <div className="flex-1">
              <InputGroup>
                <MagnifyingGlassIcon />
                <Input name="search" placeholder="Search projects&hellip;" />
              </InputGroup>
            </div>
            <div>
              <Select name="sort_by">
                <option value="name">Sort by name</option>
                <option value="status">Sort by status</option>
                <option value="progress">Sort by progress</option>
                <option value="due_date">Sort by due date</option>
              </Select>
            </div>
          </div>
        </div>
        <Button>Create project</Button>
      </div>
      <ul className="mt-10">
        {projects.map((project: Project, index: number) => (
          <>
            <li key={project.id}>
              <Divider soft={index > 0} />
              <div className="flex items-center justify-between">
                <div key={project.id} className="flex gap-6 py-6">
                  <div className="w-32 shrink-0">
                    <Link href={project.url} aria-hidden="true">
                      <Avatar 
                        src={project.avatar} 
                        initials={project.name.split(' ').map((word: string) => word[0]).join('').slice(0, 2)}
                        className="size-32"
                        square={true}
                      />
                    </Link>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-base/6 font-semibold">
                      <Link href={project.url}>{project.name}</Link>
                    </div>
                    <div className="text-xs/6 text-zinc-500">
                      Due {project.dueDate} <span aria-hidden="true">·</span> {project.teamMembers.length} team members
                    </div>
                    <div className="text-xs/6 text-zinc-600">
                      {project.completedTasks}/{project.totalTasks} tasks completed ({project.progress}%)
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-24 bg-zinc-200 rounded-full h-2 dark:bg-zinc-700">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-zinc-500">{project.progress}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="max-sm:hidden" color={project.status === 'Completed' ? 'green' : project.status === 'In Progress' ? 'blue' : project.status === 'Planning' ? 'yellow' : 'zinc'}>
                    {project.status}
                  </Badge>
                  <Dropdown>
                    <DropdownButton plain aria-label="More options">
                      <EllipsisVerticalIcon />
                    </DropdownButton>
                    <DropdownMenu anchor="bottom end">
                      <DropdownItem href={project.url}>View</DropdownItem>
                      <DropdownItem href={`/projects/${project.id}/edit`}>Edit</DropdownItem>
                      <DropdownItem>Archive</DropdownItem>
                      <DropdownItem>Delete</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </li>
          </>
        ))}
      </ul>
    </>
  )
} 