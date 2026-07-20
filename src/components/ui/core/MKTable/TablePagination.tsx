'use client'

import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

function getVisiblePages(current: number, total: number) {
  const pages: (number | string)[] = []
  pages.push(1)
  if (current > 4) pages.push('...')
  for (let i = current - 2; i <= current + 2; i++) {
    if (i > 1 && i < total) pages.push(i)
  }
  if (current < total - 3) pages.push('...')
  if (total > 1) pages.push(total)
  return pages
}

const TablePagination = ({
  totalPages,
  pageName = 'page',
}: {
  totalPages: number
  pageName?: string
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentPage = Number(searchParams.get(pageName)) || 1

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return

    const params = new URLSearchParams(searchParams.toString())
    params.set(pageName, String(page))
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  if (totalPages <= 1) return null

  const pages = getVisiblePages(currentPage, totalPages)

  return (
    <div className='my-8 flex justify-center'>
      <div className='flex items-center gap-2'>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant='outline'
          size='sm'
          className='flex h-8 w-8 items-center justify-center rounded-full'
        >
          <ChevronsLeft className='h-4 w-4' />
        </Button>

        {pages.map((page, index) =>
          page === '...' ? (
            <span key={index} className='px-2 text-gray-500'>
              ...
            </span>
          ) : (
            <Button
              key={index}
              onClick={() => handlePageChange(page as number)}
              variant={currentPage === page ? 'default' : 'outline'}
              size='sm'
              className={`${currentPage === page ? 'hover:bg-brand-secondary flex h-8 w-8 items-center justify-center rounded-full' : 'flex h-8 w-8 items-center justify-center rounded-full'}`}
            >
              {page}
            </Button>
          )
        )}

        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant='outline'
          size='sm'
          className='flex h-8 w-8 items-center justify-center rounded-full'
        >
          <ChevronsRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}

export default TablePagination
