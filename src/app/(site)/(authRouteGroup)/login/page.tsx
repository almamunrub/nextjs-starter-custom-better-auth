import LoginForm from '@/components/modules/Auth/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
}

interface LoginParams {
  searchParams: Promise<{ redirect?: string }>
}

const LoginPage = async ({ searchParams }: LoginParams) => {
  const params = await searchParams
  const redirectPath = params.redirect
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full'>
        <LoginForm redirectPath={redirectPath} />
      </div>
    </div>
  )
}

export default LoginPage
