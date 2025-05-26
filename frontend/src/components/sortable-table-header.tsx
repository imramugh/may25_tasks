import { TableHeader } from '@/components/table'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/16/solid'
import { SortConfig } from '@/hooks/useTableSort'

interface SortableTableHeaderProps {
  children: React.ReactNode
  sortKey: string
  sortConfig: SortConfig
  onSort: (key: string) => void
  className?: string
}

export function SortableTableHeader({ 
  children, 
  sortKey, 
  sortConfig, 
  onSort, 
  className = '' 
}: SortableTableHeaderProps) {
  const isActive = sortConfig.key === sortKey
  const direction = isActive ? sortConfig.direction : null

  return (
    <TableHeader 
      className={`cursor-pointer select-none hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center justify-between">
        <span>{children}</span>
        <div className="ml-2 flex flex-col">
          <ChevronUpIcon 
            className={`h-3 w-3 ${
              isActive && direction === 'asc' 
                ? 'text-zinc-900 dark:text-white' 
                : 'text-zinc-300 dark:text-zinc-600'
            }`}
          />
          <ChevronDownIcon 
            className={`h-3 w-3 -mt-1 ${
              isActive && direction === 'desc' 
                ? 'text-zinc-900 dark:text-white' 
                : 'text-zinc-300 dark:text-zinc-600'
            }`}
          />
        </div>
      </div>
    </TableHeader>
  )
} 