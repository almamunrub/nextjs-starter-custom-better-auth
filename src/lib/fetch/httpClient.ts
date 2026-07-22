/* eslint-disable @typescript-eslint/no-explicit-any */
import { getNewTokensWithRefreshToken } from '@/services/auth.services'
import { ApiResponse } from '@/types'
import { cookies, headers } from 'next/headers'
import { isTokenExpiringSoon } from '../tokenUtils'
import { env } from '@/env'
import { normalizeError, ApiError } from './errorUtils'

const API_URL = env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error('API_URL is not defined in environment variables')
}

async function tryRefreshToken(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  if (!(await isTokenExpiringSoon(accessToken))) {
    return
  }

  const requestHeader = await headers()

  if (requestHeader.get('x-token-refreshed') === '1') {
    return // avoid multiple refresh attempts in the same request lifecycle
  }

  try {
    await getNewTokensWithRefreshToken(refreshToken)
  } catch (error: any) {
    console.error('Error refreshing token in http client:', error)
  }
}

export interface ApiRequestOptions extends Omit<
  RequestInit,
  'headers' | 'body'
> {
  params?: Record<string, unknown>
  headers?: Record<string, string>
}

const buildUrl = (endpoint: string, params?: Record<string, unknown>) => {
  const url = new URL(`${API_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }
  return url.toString()
}

const fetchInstance = async <TData>(
  endpoint: string,
  method: string,
  options?: ApiRequestOptions,
  data?: unknown
): Promise<ApiResponse<TData>> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    const refreshToken = cookieStore.get('refreshToken')?.value

    if (accessToken && refreshToken) {
      await tryRefreshToken(accessToken, refreshToken)
    }

    const cookieHeader = cookieStore
      .getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ')

    const url = buildUrl(endpoint, options?.params)

    const fetchOptions: RequestInit = {
      ...options,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...options?.headers,
      },
      signal: options?.signal ?? AbortSignal.timeout(30000),
    }

    if (data !== undefined) {
      if (data instanceof FormData) {
        fetchOptions.body = data
        // Remove Content-Type so fetch can auto-generate it with the boundary
        if (fetchOptions.headers) {
          delete (fetchOptions.headers as Record<string, string>)['Content-Type']
        }
      } else {
        fetchOptions.body = JSON.stringify(data)
      }
    }

    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      let errorData: any
      try {
        errorData = await response.json()
      } catch {
        errorData = { message: response.statusText }
      }
      throw new ApiError(
        errorData?.message ?? 'Request failed',
        response.status,
        errorData?.code,
        errorData
      )
    }

    if (response.status === 204) {
      return {} as ApiResponse<TData>
    }

    return (await response.json()) as ApiResponse<TData>
  } catch (error) {
    normalizeError(endpoint, method, error)
  }
}

const httpGet = async <TData>(
  endpoint: string,
  options?: ApiRequestOptions
): Promise<ApiResponse<TData>> => {
  return fetchInstance<TData>(endpoint, 'GET', options)
}

const httpPost = async <TData>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions
): Promise<ApiResponse<TData>> => {
  return fetchInstance<TData>(endpoint, 'POST', options, data)
}

const httpPut = async <TData>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions
): Promise<ApiResponse<TData>> => {
  return fetchInstance<TData>(endpoint, 'PUT', options, data)
}

const httpPatch = async <TData>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions
): Promise<ApiResponse<TData>> => {
  return fetchInstance<TData>(endpoint, 'PATCH', options, data)
}

const httpDelete = async <TData>(
  endpoint: string,
  options?: ApiRequestOptions
): Promise<ApiResponse<TData>> => {
  return fetchInstance<TData>(endpoint, 'DELETE', options)
}

export const httpClient = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
}
