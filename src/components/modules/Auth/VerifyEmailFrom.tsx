'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { resendOTP, verifyEmail } from '@/services/auth.services'
import { useRouter } from 'next/navigation'
import {
  formatCountdown,
  useResendCountdown,
} from '@/hooks/use-resend-countdown'

interface VerifyEmailFromProps {
  redirectPath?: string
}

export default function VerifyEmailFrom({
  redirectPath,
}: VerifyEmailFromProps) {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const router = useRouter()

  const { secondsLeft, canResend, start } = useResendCountdown(120)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const otp = formData.get('otp') as string

    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP.')
      return
    }

    setIsLoading(true)

    try {
      await verifyEmail(redirectPath || '', otp)
      toast.success('Email verified successfully!')
      router.replace('/login')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend || isResending) return

    setIsResending(true)
    try {
      await resendOTP(redirectPath || '', 'email-verification')
      toast.success('A new OTP has been sent to your email.')
      start()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to resend OTP.'
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card className='mx-auto flex max-w-xl flex-col items-center justify-center gap-6 py-12'>
      <div className='space-y-2 text-center'>
        <h1 className='text-3xl font-bold'>Verify Your Email</h1>
        <p className='text-muted-foreground'>
          Enter the 6-digit OTP sent to{' '}
          <span className='font-semibold'>{redirectPath}</span>.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-center gap-6'
      >
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
          disabled={isLoading}
          name='otp'
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <input type='hidden' name='otp' value={otp} />

        <Button type='submit' disabled={isLoading || otp.length !== 6}>
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>

        <div className='text-sm'>
          {canResend ? (
            <button
              type='button'
              onClick={handleResend}
              disabled={isResending}
              className='text-primary font-medium hover:underline disabled:opacity-50'
            >
              {isResending
                ? 'Sending...'
                : "Didn't receive the code? Resend OTP"}
            </button>
          ) : (
            <p className='text-muted-foreground'>
              Resend OTP in {formatCountdown(secondsLeft)}
            </p>
          )}
        </div>
      </form>
    </Card>
  )
}
