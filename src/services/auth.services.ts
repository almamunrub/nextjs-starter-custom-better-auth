'use server'

import { env } from '@/env'
import { httpClient } from '@/lib/axios/httpClient'
import { setTokenInCookies } from '@/lib/tokenUtils'
import { ResendOTPResponse } from '@/types'
import { cookies } from 'next/headers'

const API_URL = env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined')
}

export async function getNewTokensWithRefreshToken(
  refreshToken: string
): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refreshToken=${refreshToken}`,
      },
    })

    if (!res.ok) {
      return false
    }

    const { data } = await res.json()

    const { accessToken, refreshToken: newRefreshToken, token } = data

    if (accessToken) {
      await setTokenInCookies('accessToken', accessToken)
    }

    if (newRefreshToken) {
      await setTokenInCookies('refreshToken', newRefreshToken)
    }

    if (token) {
      await setTokenInCookies('better-auth.session_token', token, 24 * 60 * 60) // 1 day in seconds
    }

    return true
  } catch (error) {
    console.error('Error refreshing token:', error)
    return false
  }
}

export async function getUserInfo() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    const sessionToken = cookieStore.get('better-auth.session_token')?.value

    if (!accessToken) {
      return null
    }

    const res = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    })

    if (!res.ok) {
      console.error('Failed to fetch user info:', res.status)
      return null
    }

    const { data } = await res.json()

    return data
  } catch (error) {
    console.error('Error fetching user info:', error)
    return null
  }
}

export async function verifyEmail(email: string, otp: string) {
  try {
    const response = await httpClient.post<{ success: boolean }>(
      `/auth/verify-email`,
      { email, otp }
    )

    if (!response.success) {
      throw new Error(response.message || 'Verification failed.')
    }

    return response
  } catch (error) {
    console.error('Error verifying email:', error)
    throw error instanceof Error
      ? error
      : new Error('An unknown error occurred.')
  }
}

export async function resendOTP(
  email: string,
  type: 'email-verification' | 'forget-password'
) {
  try {
    const response = await httpClient.post<ResendOTPResponse>(
      `/auth/resend-otp`,
      { email, type }
    )

    if (!response.success) {
      throw new Error(response.message || 'Failed to resend OTP.')
    }

    return response
  } catch (error) {
    console.error('Error resending OTP:', error)
    throw error instanceof Error
      ? error
      : new Error('An unknown error occurred.')
  }
}

export async function forgotPassword(email: string) {
  try {
    const response = await httpClient.post<{ success: boolean }>(
      `/auth/forget-password`,
      { email }
    )

    if (!response.success) {
      throw new Error(response.message || 'forget password failed.')
    }

    return response
  } catch (error) {
    console.error('Error forget password email:', error)
    throw error instanceof Error
      ? error
      : new Error('An unknown error occurred.')
  }
}

export async function resetPassword(
  email: string,
  otp: string,
  newPassword: string
) {
  try {
    const response = await httpClient.post<{ success: boolean }>(
      `/auth/reset-password`,
      { email, otp, newPassword }
    )

    if (!response.success) {
      throw new Error(response.message || 'reset password failed.')
    }

    return response
  } catch (error) {
    console.error('Error reset password email:', error)
    throw error instanceof Error
      ? error
      : new Error('An unknown error occurred.')
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  try {
    const response = await httpClient.post<{ success: boolean }>(
      `/auth/change-password`,
      { currentPassword, newPassword }
    )

    if (!response.success) {
      throw new Error(response.message || 'reset password failed.')
    }

    return response
  } catch (error) {
    console.error('Error reset password email:', error)
    throw error instanceof Error
      ? error
      : new Error('An unknown error occurred.')
  }
}
