/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from '@/lib/authUtils'
import { ApiError } from '@/lib/fetch/errorUtils'
import { httpClient } from '@/lib/fetch/httpClient'
import { deleteCookie } from '@/lib/cookieUtils'
import { setTokenInCookies } from '@/lib/tokenUtils'
import { ILoginResponse, LoginActionResponse } from '@/types/auth.types'
import { ILoginPayload, loginZodSchema } from '@/zod/auth.validation'
import { redirect } from 'next/navigation'

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string
): Promise<LoginActionResponse> => {
  const parsed = loginZodSchema.safeParse(payload)

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid input.',
    }
  }

  try {
    const { data } = await httpClient.post<ILoginResponse>(
      '/auth/login',
      parsed.data
    )

    const { accessToken, refreshToken, token, user } = data

    await Promise.all([
      setTokenInCookies('accessToken', accessToken),
      setTokenInCookies('refreshToken', refreshToken),
      setTokenInCookies('better-auth.session_token', token, 24 * 60 * 60),
    ])

    if (user.needPasswordChange) {
      return {
        success: true,
        message: 'Login successful.',
        redirectTo: `/reset-password?email=${encodeURIComponent(user.email)}`,
      }
    }

    const targetPath =
      redirectPath &&
      isValidRedirectForRole(redirectPath, user.role as UserRole)
        ? redirectPath
        : getDefaultDashboardRoute(user.role as UserRole)

    return {
      success: true,
      message: 'Login successful.',
      redirectTo: targetPath,
    }
  } catch (error) {
    if (error instanceof ApiError && error.message === 'Email not verified') {
      return {
        success: true,
        message: 'Please verify your email.',
        redirectTo: `/verify-email?email=${encodeURIComponent(payload.email)}`,
      }
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Unable to login. Please try again.',
    }
  }
}

export const logoutAction = async (redirectTo = '/') => {
  try {
    await httpClient.post('/auth/logout', {})
  } catch (error) {
    if (!(error instanceof ApiError)) {
      console.error(error)
    }
  }

  // Remove Next.js cookies
  await Promise.all([
    deleteCookie('accessToken'),
    deleteCookie('refreshToken'),
    deleteCookie('better-auth.session_token'),
  ])

  redirect(redirectTo)
}
