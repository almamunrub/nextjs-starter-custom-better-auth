import ForgotPasswordForm from '@/components/modules/Auth/ForgotPasswordForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password',
}

function ForgotPasswordPage() {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full'>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

export default ForgotPasswordPage
