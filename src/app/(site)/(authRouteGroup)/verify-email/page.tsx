import VerifyEmailFrom from '@/components/modules/Auth/VerifyEmailFrom'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify Email',
}

interface VerifyParams {
  searchParams: Promise<{ email?: string }>
}

const VerifyEmail = async ({ searchParams }: VerifyParams) => {
  const params = await searchParams
  const email = params.email

  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full'>
        <VerifyEmailFrom redirectPath={email} />
      </div>
    </div>
  )
}

export default VerifyEmail
