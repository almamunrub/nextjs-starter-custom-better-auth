import ResetPasswordForm from '@/components/modules/Auth/ResetPasswordForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset Password',
}

interface EmailParams {
  searchParams: Promise<{ email?: string }>
}

async function ResetPage({ searchParams }: EmailParams) {
  const params = await searchParams
  const email = params.email

  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full'>
        <ResetPasswordForm email={email} />
      </div>
    </div>
  )
}

export default ResetPage
