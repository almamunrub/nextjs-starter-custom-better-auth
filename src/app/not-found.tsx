'use client'

import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'

function NotFoundContent() {
  const router = useRouter()

  return (
    <div className='from-background to-muted/20 flex min-h-screen items-center justify-center bg-linear-to-b'>
      <div className='container flex flex-col items-center justify-center gap-8 px-4 text-center'>
        <div className='scale-in'>
          <div className='relative'>
            {/* Animated Circle */}
            <div className='bg-destructive/10 pulse-scale absolute inset-0 rounded-full' />

            {/* 404 Text */}
            <div className='relative z-10 flex h-48 w-48 items-center justify-center'>
              <h1 className='text-primary fade-up-delay-1 text-8xl font-bold'>
                404
              </h1>
            </div>

            {/* Floating Icon */}
            <div className='bg-destructive text-destructive-foreground float-icon absolute -top-4 -right-4 rounded-full p-3 shadow-lg'>
              <AlertCircle className='h-8 w-8 text-white' />
            </div>
          </div>
        </div>{' '}
        <div className='fade-up-delay-2 space-y-4'>
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            Page Not Found
          </h2>
          <p className='text-muted-foreground max-w-md text-lg'>
            Oops! The page you&apos;re looking for doesn&apos;t exist. It might
            have been moved or deleted.
          </p>
        </div>
        <div className='fade-up-delay-3 flex flex-col gap-4 sm:flex-row'>
          <Button
            size='lg'
            onClick={() => router.back()}
            variant='outline'
            className='gap-2'
          >
            <ArrowLeft className='h-4 w-4' />
            Go Back
          </Button>
          <Button size='lg' asChild className='gap-2'>
            <Link href='/'>
              <Home className='h-4 w-4' />
              Back to Home
            </Link>
          </Button>
        </div>
        {/* Decorative Elements */}
        <div className='bg-primary/5 glow-1 absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl' />
        <div className='glow-2 absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl' />
      </div>
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-primary text-8xl font-bold'>404</h1>
            <p className='text-muted-foreground mt-4 text-lg'>Loading...</p>
          </div>
        </div>
      }
    >
      <NotFoundContent />
    </Suspense>
  )
}
