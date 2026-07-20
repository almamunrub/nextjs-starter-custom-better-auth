'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <>
      <style jsx>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        @keyframes pulse-error {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.2;
          }
        }

        @keyframes glow-destructive {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.5;
          }
        }

        .fade-up {
          animation: fade-up 0.5s ease-out;
        }

        .scale-in {
          animation: scale-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .pulse-error {
          animation: pulse-error 2s ease-in-out infinite;
        }

        .glow-destructive {
          animation: glow-destructive 4s ease-in-out infinite;
        }
      `}</style>
      <div className='from-background to-muted/20 flex min-h-screen items-center justify-center bg-linear-to-b p-4'>
        <div className='fade-up w-full max-w-2xl'>
          <Card className='border-destructive/50 shadow-lg'>
            <CardContent className='pt-6'>
              <div className='flex flex-col items-center space-y-6 text-center'>
                {/* Animated Error Icon */}
                <div className='scale-in relative'>
                  <div className='bg-destructive/10 pulse-error absolute inset-0 rounded-full' />
                  <div className='bg-destructive/10 relative z-10 rounded-full p-6'>
                    <AlertTriangle className='text-destructive h-16 w-16' />
                  </div>
                </div>

                {/* Error Message */}
                <div className='space-y-2'>
                  <h1 className='text-3xl font-bold tracking-tight'>
                    Oops! Something went wrong
                  </h1>
                  <p className='text-muted-foreground'>
                    We encountered an unexpected error. Don&apos;t worry,
                    it&apos;s not your fault.
                  </p>
                </div>

                {/* Error Details (Development Only) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className='bg-muted w-full rounded-lg p-4 text-left'>
                    <p className='text-muted-foreground font-mono text-sm break-all'>
                      {error.message}
                    </p>
                    {error.digest && (
                      <p className='text-muted-foreground mt-2 font-mono text-xs'>
                        Error ID: {error.digest}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className='flex w-full flex-col gap-3 sm:w-auto sm:flex-row'>
                  <Button
                    onClick={() => {
                      // try soft reset first
                      reset()

                      // fallback hard reload after short delay
                      setTimeout(() => {
                        window.location.reload()
                      }, 300)
                    }}
                    size='lg'
                    className='gap-2'
                  >
                    <RefreshCcw className='h-4 w-4' />
                    Try Again
                  </Button>
                  <Button variant='outline' size='lg' asChild className='gap-2'>
                    <Link href='/'>
                      <Home className='h-4 w-4' />
                      Back to Home
                    </Link>
                  </Button>
                </div>

                {/* Help Text */}
                <p className='text-muted-foreground text-sm'>
                  If this problem persists, please contact our support team.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Decorative Elements */}
          <div className='bg-destructive/5 glow-destructive absolute top-1/4 left-1/4 -z-10 h-64 w-64 rounded-full blur-3xl' />
        </div>
      </div>
    </>
  )
}
