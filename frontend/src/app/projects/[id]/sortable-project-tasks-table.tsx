'use client'

import { Badge } from '@/components/badge'
import { Link } from '@/components/link'
import { SortableTableHeader } from '@/components/sortable-table-header'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/table'
import { useTableSort } from '@/hooks/useTableSort'
import { type ProjectTask } from '@/data/projects'

interface SortableProjectTasksTableProps {
  tasks: ProjectTask[]
}

export function SortableProjectTasksTable({ tasks }: SortableProjectTasksTableProps) {
  const { sortedData: sortedTasks, sortConfig, handleSort } = useTableSort(tasks)

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

  return (
    <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
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
              <div>
                <Link href={`/tasks/${task.id}`} className="font-medium text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                  {task.title}
                </Link>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  {task.description}
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
  )
} 