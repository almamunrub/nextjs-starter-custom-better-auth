'use client'

import { SimpleColumn } from '.'

interface TableSkeletonProps<TData> {
  columns: SimpleColumn<TData>[]
  rows?: number
}

const TableSkeleton = <TData,>({
  columns,
  rows = 5,
}: TableSkeletonProps<TData>) => {
  return (
    <div className='my-5'>
      <table className='w-full table-fixed border-collapse'>
        <thead>
          <tr className='bg-gray-200'>
            {columns.map((col, index) => (
              <th key={index} className={`px-4 py-3 ${col.className ?? ''}`}>
                <div className='h-4 w-20 animate-pulse rounded bg-gray-300' />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className='border-t'>
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-4 py-3 ${col.className ?? ''}`}
                >
                  <div className='h-4 w-full animate-pulse rounded bg-gray-200' />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableSkeleton
