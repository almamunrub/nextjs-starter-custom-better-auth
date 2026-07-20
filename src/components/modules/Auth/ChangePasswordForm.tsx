'use client'

import { ChangeEvent, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { changePassword } from '@/services/auth.services'
import { logoutAction } from '@/actions/auth.actions'
import { useRouter } from 'next/navigation'
import { changePasswordSchema } from '@/zod/auth.validation'
import z from 'zod'

export default function ChangePasswordForm() {
  // 2. Add confirmPassword to state
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  // 3. Add toggle state for the confirm password field
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const router = useRouter()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for the specific field being typed in
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    // 4. Validate using Zod
    try {
      changePasswordSchema.parse(formData)
      setErrors({}) // Clear all previous errors if validation passes
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        err.issues.forEach(issue => {
          if (issue.path[0]) {
            newErrors[issue.path[0].toString()] = issue.message
          }
        })
        setErrors(newErrors)
      }
      return // Stop submission if validation fails
    }

    setIsSubmitting(true)

    try {
      await changePassword(formData.currentPassword, formData.newPassword)

      toast.success('Password changed successfully.')

      // Clear auth data
      await logoutAction()

      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      setErrors({})

      // Redirect to login page
      router.replace('/login')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to change password.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className='mx-auto w-full max-w-md shadow'>
      <CardHeader className='space-y-2 text-center'>
        <CardTitle className='text-2xl font-bold'>Change Password</CardTitle>
        <CardDescription>
          Update your account password by entering your current password and a
          new one.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {/* Current Password Field */}
            <Field>
              <FieldLabel htmlFor='currentPassword'>
                Current Password
              </FieldLabel>

              <div className='relative'>
                <Input
                  id='currentPassword'
                  name='currentPassword'
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder='Enter current password'
                  value={formData.currentPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className='pr-10'
                />

                <button
                  type='button'
                  onClick={() => setShowCurrentPassword(prev => !prev)}
                  className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2'
                  aria-label={
                    showCurrentPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showCurrentPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>

              {errors.currentPassword && (
                <p className='text-destructive mt-2 text-sm'>
                  {errors.currentPassword}
                </p>
              )}
            </Field>

            {/* New Password Field */}
            <Field>
              <FieldLabel htmlFor='newPassword'>New Password</FieldLabel>

              <div className='relative'>
                <Input
                  id='newPassword'
                  name='newPassword'
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder='Enter new password'
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className='pr-10'
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

            {/* Repeat New Password Field */}
            <Field>
              <FieldLabel htmlFor='confirmPassword'>
                Repeat New Password
              </FieldLabel>

              <div className='relative'>
                <Input
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Repeat new password'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className='pr-10'
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
              {isSubmitting ? 'Changing Password...' : 'Change Password'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
