import { env } from '@/env'
import { setTokenInCookies } from '@/lib/tokenUtils'
import { NextRequest, NextResponse } from 'next/server'

const FRONTEND_URL = env.NEXT_PUBLIC_FRONTEND_URL

export async function GET(req: NextRequest) {
  const url = new URL(req.url)

  const accessToken = url.searchParams.get('accessToken')
  const refreshToken = url.searchParams.get('refreshToken')
  const sessionToken = url.searchParams.get('sessionToken')
  const redirectPath = url.searchParams.get('redirect') || '/dashboard'

  // 1. Guard clause: Ensure we have the required tokens
  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(
      new URL('/login?error=oauth_failed', FRONTEND_URL)
    )
  }

  // 2. Set cookies using your unified helper functions
  // This automatically decodes the JWT and sets the correct maxAge
  await setTokenInCookies('accessToken', accessToken)
  await setTokenInCookies('refreshToken', refreshToken)

  // Match the exact session logic used in your standard loginAction
  if (sessionToken) {
    await setTokenInCookies(
      'better-auth.session_token',
      sessionToken,
      24 * 60 * 60
    )
  }

  // 3. Redirect the user securely
  return NextResponse.redirect(new URL(redirectPath, FRONTEND_URL))
}
