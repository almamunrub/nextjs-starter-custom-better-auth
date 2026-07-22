'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { forgotPasswordSchema } from '@/zod/auth.validation'
import { forgotPassword } from '@/services/auth.services'
import z from 'zod'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function ForgotPasswordForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    // Clear error when user starts typing again
    if (error) setError('')
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Validate the input using Zod
      const validatedData = forgotPasswordSchema.parse({ email })

      await forgotPassword(validatedData.email)

      toast.success('Password reset email sent successfully!')

      // 4. Redirect to reset-password with the email as a search parameter
      router.push(
        `/reset-password?email=${encodeURIComponent(validatedData.email)}`
      )
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Handle Zod validation errors
        setError(err.message)
      } else if (err instanceof Error) {
        // Handle API errors
        toast.error(err.message)
      } else {
        toast.error('An unexpected error occurred.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className='mx-auto w-full max-w-md shadow'>
      <CardHeader className='space-y-2 text-center'>
        <CardTitle className='text-2xl font-bold'>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you an OTP to reset your
          password.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup className='space-y-5'>
            <Field>
              <FieldLabel htmlFor='fieldgroup-email'>Email Address</FieldLabel>

              <Input
                id='fieldgroup-email'
                name='email'
                type='email'
                placeholder='name@example.com'
                value={email}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />

              {error && (
                <p className='text-destructive mt-2 text-sm'>{error}</p>
              )}
            </Field>

            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export default ForgotPasswordForm
