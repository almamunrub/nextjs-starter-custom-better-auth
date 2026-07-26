'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { ILoginPayload, loginZodSchema } from '@/zod/auth.validation'
import { env } from '@/env'
import { loginAction } from '@/actions/auth.actions'
import { toast } from 'sonner'
import { usePathname, useRouter } from 'next/navigation'
import { GoogleMark } from '@/assets/GoogleMark'

interface LoginFormProps {
  redirectPath?: string
}

export default function LoginForm({ redirectPath }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const pathname = usePathname()

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
    })
    setShowPassword(false)
  }

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
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const parsed = loginZodSchema.safeParse(formData)

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message)
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

      setTimeout(() => {
        if (result.redirectTo) {
          router.push(result.redirectTo)
        }
      }, 800)
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <Card className='mx-auto w-full max-w-md shadow'>
      <CardHeader className='text-center'>
        <CardTitle>Welcome Back!</CardTitle>
        <CardDescription>
          Please enter your credentials to log in.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button
          variant='outline'
          className='group w-full'
          onClick={() => {
            const baseUrl = env.NEXT_PUBLIC_API_URL
            window.location.href = `${baseUrl}/auth/login/google?redirectPath=${encodeURIComponent(
              redirectPath ?? ''
            )}`
          }}
        >
          <GoogleMark />
          <span>Continue with Google</span>
          <ArrowRight className='size-4 -translate-x-1 text-black opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-60' />
        </Button>

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
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Email</label>

            <Input
              type='email'
              placeholder='Enter your email'
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Password</label>

            <div className='relative'>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter password'
                value={formData.password}
                onChange={e => handleChange('password', e.target.value)}
                required
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
          </div>

          <div className='text-right'>
            <Link
              href='/forgot-password'
              className='text-primary text-sm hover:underline'
            >
              Forgot password?
            </Link>
          </div>

          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Logging In...' : 'Log In'}
          </Button>
        </form>
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
