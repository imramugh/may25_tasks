'use client'

import { Avatar } from '@/components/avatar'
import { SortableTableHeader } from '@/components/sortable-table-header'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/table'
import { useTableSort } from '@/hooks/useTableSort'
import { useEffect, useState } from 'react'

interface Order {
  id: number
  date: string
  customer: { name: string }
  event?: { name: string; thumbUrl: string }
  amount: { usd: string }
  url: string
}

interface SortableOrdersTableProps {
  getOrders: () => Promise<Order[]>
  showEvent?: boolean
  className?: string
}

export function SortableOrdersTable({ getOrders, showEvent = false, className }: SortableOrdersTableProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const { sortedData: sortedOrders, sortConfig, handleSort } = useTableSort(orders)

  useEffect(() => {
    getOrders().then(setOrders)
  }, [getOrders])

  return (
    <Table className={className}>
      <TableHead>
        <TableRow>
          <SortableTableHeader sortKey="id" sortConfig={sortConfig} onSort={handleSort}>
            Order number
          </SortableTableHeader>
          <SortableTableHeader sortKey="date" sortConfig={sortConfig} onSort={handleSort}>
            Purchase date
          </SortableTableHeader>
          <SortableTableHeader sortKey="customer.name" sortConfig={sortConfig} onSort={handleSort}>
            Customer
          </SortableTableHeader>
          {showEvent && (
            <SortableTableHeader sortKey="event.name" sortConfig={sortConfig} onSort={handleSort}>
              Event
            </SortableTableHeader>
          )}
          <SortableTableHeader sortKey="amount.usd" sortConfig={sortConfig} onSort={handleSort} className="text-right">
            Amount
          </SortableTableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedOrders.map((order) => (
          <TableRow key={order.id} href={order.url} title={`Order #${order.id}`}>
            <TableCell>{order.id}</TableCell>
            <TableCell className="text-zinc-500">{order.date}</TableCell>
            <TableCell>{order.customer.name}</TableCell>
            {showEvent && order.event && (
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar src={order.event.thumbUrl} className="size-6" />
                  <span>{order.event.name}</span>
                </div>
              </TableCell>
            )}
            <TableCell className="text-right">US{order.amount.usd}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 