'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { toast } from 'sonner'
import { resetPasswordSchema } from '@/zod/auth.validation'
import { resendOTP, resetPassword } from '@/services/auth.services'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  formatCountdown,
  useResendCountdown,
} from '@/hooks/use-resend-countdown'
import { OTPInput } from '@/components/motion/otp-input'

interface ResetPasswordFormProps {
  email?: string
}

function ResetPasswordForm({ email }: ResetPasswordFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isResending, setIsResending] = useState(false)
  const { secondsLeft, canResend, start } = useResendCountdown(120)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email) {
      toast.error('Missing email address. Please request a new password reset.')
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const validatedData = resetPasswordSchema.parse(formData)
      await resetPassword(email, validatedData.otp, validatedData.newPassword)
      toast.success('Password reset successfully! You can now log in.')

      setFormData({
        otp: '',
        newPassword: '',
        confirmPassword: '',
      })

      router.push('/login')
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        err.issues.forEach(issue => {
          if (issue.path[0]) {
            newErrors[issue.path[0].toString()] = issue.message
          }
        })
        setErrors(newErrors)
      } else if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('An unexpected error occurred.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (!email || !canResend || isResending) return

    setIsResending(true)
    try {
      await resendOTP(email, 'forget-password')
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
    <Card className='mx-auto w-full max-w-md shadow'>
      <CardHeader className='space-y-2 text-center'>
        <CardTitle className='text-2xl font-bold'>Reset Password</CardTitle>
        <CardDescription>
          Enter the 6-digit OTP sent to your email and create a new password.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup className='space-y-5'>
            <Field>
              <FieldLabel htmlFor='otp'>One-Time Password (OTP)</FieldLabel>

              <div className='flex w-full justify-center'>
                <OTPInput
                  value={formData.otp}
                  onChange={value => {
                    setFormData(prev => ({ ...prev, otp: value }))
                    if (errors.otp) setErrors(prev => ({ ...prev, otp: '' }))
                  }}
                  status={errors.otp ? 'error' : 'idle'}
                  errorMessage={errors.otp}
                />
              </div>

              <div className='mt-4 text-center text-sm'>
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
            </Field>

            <Field>
              <FieldLabel htmlFor='newPassword'>New Password</FieldLabel>
              <div className='relative'>
                <Input
                  id='newPassword'
                  name='newPassword'
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder='Enter your new password'
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className='pr-10'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowNewPassword(prev => !prev)}
                  className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2'
                  aria-label={
                    showNewPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showNewPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className='text-destructive mt-2 text-sm'>
                  {errors.newPassword}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor='confirmPassword'>
                Confirm New Password
              </FieldLabel>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Confirm your new password'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className='pr-10'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2'
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='text-destructive mt-2 text-sm'>
                  {errors.confirmPassword}
                </p>
              )}
            </Field>

            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export default ResetPasswordForm
