import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TableProps extends HTMLAttributes<HTMLTableElement> {}
const Table = forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => {
  return (
    <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
  )
})
Table.displayName = 'Table'

interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}
const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(({ className, ...props }, ref) => {
  return (
    <thead ref={ref} className={cn(className)} {...props} />
  )
})
TableHeader.displayName = 'TableHeader'

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}
const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(({ className, ...props }, ref) => {
  return (
    <tbody ref={ref} className={cn(className)} {...props} />
  )
})
TableBody.displayName = 'TableBody'

interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {}
const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(({ className, ...props }, ref) => {
  return (
    <tfoot ref={ref} className={cn(className)} {...props} />
  )
})
TableFooter.displayName = 'TableFooter'

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}
const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(({ className, ...props }, ref) => {
  return (
    <tr ref={ref} className={cn('border-b border-neutral-100 hover:bg-neutral-50 transition-colors', className)} {...props} />
  )
})
TableRow.displayName = 'TableRow'

interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {}
const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(({ className, ...props }, ref) => {
  return (
    <th ref={ref} className={cn('h-12 px-4 text-left align-middle font-medium text-neutral-600 [&:has([role=checkbox])]:pr-0', className)} {...props} />
  )
})
TableHead.displayName = 'TableHead'

interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  colSpan?: number
}
const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(({ className, ...props }, ref) => {
  return (
    <td ref={ref} className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)} {...props} />
  )
})
TableCell.displayName = 'TableCell'

interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {}
const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(({ className, ...props }, ref) => {
  return (
    <caption ref={ref} className={cn('mb-4 px-4 text-left text-sm font-semibold text-neutral-900', className)} {...props} />
  )
})
TableCaption.displayName = 'TableCaption'

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption }
