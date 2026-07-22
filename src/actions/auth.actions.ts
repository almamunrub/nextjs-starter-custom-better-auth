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
import { ILoginResponse } from '@/types/auth.types'
import { ILoginPayload, loginZodSchema } from '@/zod/auth.validation'
import { redirect } from 'next/navigation'

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string
) => {
  const parsedPayload = loginZodSchema.safeParse(payload)

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || 'Invalid input'
    return {
      success: false,
      message: firstError,
    }
  }
  try {
    const response = await httpClient.post<ILoginResponse>(
      '/auth/login',
      parsedPayload.data
    )

    const { accessToken, refreshToken, token, user } = response.data
    const { role, emailVerified, needPasswordChange, email } = user
    await setTokenInCookies('accessToken', accessToken)
    await setTokenInCookies('refreshToken', refreshToken)
    await setTokenInCookies('better-auth.session_token', token, 24 * 60 * 60) // 1 day in seconds

    // if(!emailVerified){
    //     redirect("/verify-email");
    // }else // in the catch block

    if (needPasswordChange) {
      //TODO : refactoring
      redirect(`/reset-password?email=${email}`)
    } else {
      // redirect(redirectPath || "/dashboard");
      const targetPath =
        redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
          ? redirectPath
          : getDefaultDashboardRoute(role as UserRole)

      redirect(targetPath)
    }
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error
    }

    if (error instanceof ApiError && error.message === 'Email not verified') {
      redirect(`/verify-email?email=${payload.email}`)
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Login failed',
    }
  }
}

export const logoutAction = async (redirectTo = '/login') => {
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
