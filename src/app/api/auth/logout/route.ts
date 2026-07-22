import { env } from '@/env'
import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.redirect(
    new URL('/login', env.NEXT_PUBLIC_FRONTEND_URL)
  )

  response.cookies.delete('accessToken')
  response.cookies.delete('refreshToken')
  response.cookies.delete('better-auth.session_token')

  return response
}
