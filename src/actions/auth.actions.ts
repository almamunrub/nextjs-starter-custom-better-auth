/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from '@/lib/authUtils'
import { ApiError } from '@/lib/axios/errorUtils'
import { httpClient } from '@/lib/axios/httpClient'
import { deleteCookie } from '@/lib/cookieUtils'
import { setTokenInCookies } from '@/lib/tokenUtils'
import { ApiErrorResponse } from '@/types/api.types'
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

export const logoutAction = async () => {
  // 1. Notify the backend to invalidate the token
  try {
    await httpClient.post('/auth/logout', {})
  } catch (e) {
    console.error('Backend logout failed:', e)
    // We continue execution even if the backend fails,
    // so we can still clear the local browser cookies.
  }

  // 2. Clear the cookies directly from the user's browser
  await deleteCookie('accessToken')
  await deleteCookie('refreshToken')
  await deleteCookie('better-auth.session_token')
  await deleteCookie('better-auth.session_data')

  return { success: true }
}
