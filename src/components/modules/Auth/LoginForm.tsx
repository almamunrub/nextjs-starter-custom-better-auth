'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ILoginPayload, loginZodSchema } from '@/zod/auth.validation'
import { env } from '@/env'
import { loginAction } from '@/actions/auth.actions'
import { toast } from 'sonner'
import { usePathname } from 'next/navigation'

interface LoginFormProps {
  redirectPath?: string
}

export default function LoginForm({ redirectPath }: LoginFormProps) {
  const initialFormData: ILoginPayload = {
    email: '',
    password: '',
  }

  const [formData, setFormData] = useState<ILoginPayload>(initialFormData)

  const [errors, setErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const resetForm = () => {
    setFormData(initialFormData)
    setErrors({})
    setServerError('')
    setShowPassword(false)
  }

  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/login') {
      resetForm()
    }
  }, [pathname])

  const handleChange = (field: keyof ILoginPayload, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))

    // Clear field error and server error while typing
    setErrors(prev => ({
      ...prev,
      [field]: undefined,
    }))

    if (serverError) {
      setServerError('')
    }
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    setServerError('')
    setErrors({})

    const parsed = loginZodSchema.safeParse(formData)

    if (!parsed.success) {
      const newErrors: {
        email?: string
        password?: string
      } = {}

      parsed.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof typeof newErrors

        if (field && !newErrors[field]) {
          newErrors[field] = issue.message
        }
      })

      setErrors(newErrors)
      return
    }

    try {
      setLoading(true)

      const result = await loginAction(parsed.data, redirectPath)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)

      resetForm()
    } catch (error) {
      console.error(error)
      setServerError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='mx-auto w-full max-w-md shadow-md'>
      <CardHeader className='text-center'>
        <CardTitle>Welcome Back!</CardTitle>
        <CardDescription>
          Please enter your credentials to log in.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Email</label>

            <Input
              type='email'
              placeholder='Enter your email'
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
            />

            {errors.email && (
              <p className='text-destructive text-sm'>{errors.email}</p>
            )}
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Password</label>

            <div className='relative'>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter password'
                value={formData.password}
                onChange={e => handleChange('password', e.target.value)}
                className='pr-10'
              />

              <Button
                type='button'
                size='icon'
                variant='ghost'
                className='absolute top-0 right-0 h-full'
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? (
                  <EyeOff className='size-4' />
                ) : (
                  <Eye className='size-4' />
                )}
              </Button>
            </div>

            {errors.password && (
              <p className='text-destructive text-sm'>{errors.password}</p>
            )}
          </div>

          <div className='text-right'>
            <Link
              href='/forgot-password'
              className='text-primary text-sm hover:underline'
            >
              Forgot password?
            </Link>
          </div>

          {serverError && (
            <Alert variant='destructive'>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Logging In...' : 'Log In'}
          </Button>
        </form>

        <div className='relative my-6'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t' />
          </div>

          <div className='relative flex justify-center text-sm'>
            <span className='bg-background text-muted-foreground px-2'>
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant='outline'
          className='w-full'
          onClick={() => {
            const baseUrl = env.NEXT_PUBLIC_API_URL
            window.location.href = `${baseUrl}/auth/login/google`
          }}
        >
          Sign in with Google
        </Button>
      </CardContent>

      {/* <CardFooter className='justify-center border-t pt-4'>
        <p className='text-muted-foreground text-sm'>
          Don't have an account?{' '}
          <Link
            href='/register'
            className='text-primary font-medium hover:underline'
          >
            Sign Up
          </Link>
        </p>
      </CardFooter> */}
    </Card>
  )
}
