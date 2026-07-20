import { Card } from '@/components/ui/card'

export function UserProfileSkeleton() {
  return (
    <>
      <Card className='p-6'>
        <div className='flex flex-col items-start gap-8 lg:flex-row'>
          {/* Left Side Skeleton - Image */}
          <div className='flex w-1/2 flex-col items-center gap-4 text-center'>
            <div className='bg-muted size-32 animate-pulse rounded-full'></div>
            <div className='bg-muted h-4 w-48 animate-pulse rounded'></div>
          </div>

          {/* Right Side Skeleton - Status */}
          <div className='flex w-1/2 flex-col items-end justify-end pt-4 lg:pt-0'>
            <div className='flex items-center gap-3'>
              <div className='bg-muted size-3 animate-pulse rounded-full'></div>
              <div className='bg-muted h-6 w-24 animate-pulse rounded'></div>
            </div>
          </div>
        </div>
      </Card>

      <Card className='flex flex-col p-6'>
        <div className='mb-6 flex items-center gap-3'>
          <div className='bg-muted size-10 animate-pulse rounded-lg'></div>
          <div className='bg-muted h-6 w-48 animate-pulse rounded'></div>
        </div>

        <div className='w-full space-y-6'>
          <div className='space-y-2'>
            <div className='bg-muted h-4 w-12 animate-pulse rounded'></div>
            <div className='bg-muted h-10 w-full animate-pulse rounded-md'></div>
          </div>

          <div className='space-y-2'>
            <div className='bg-muted h-4 w-28 animate-pulse rounded'></div>
            <div className='bg-muted h-10 w-full animate-pulse rounded-md'></div>
          </div>

          <div className='flex max-w-md gap-4 pt-4'>
            <div className='bg-muted h-10 flex-1 animate-pulse rounded-md'></div>
            <div className='bg-muted h-10 flex-1 animate-pulse rounded-md'></div>
          </div>
        </div>
      </Card>
    </>
  )
}
