import axios from 'axios'

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function normalizeError(
  endpoint: string,
  method: string,
  error: unknown
): never {
  console.error(`${method} request to ${endpoint} failed:`, error)

  if (axios.isAxiosError(error)) {
    const data = error.response?.data

    throw new ApiError(
      data?.message ?? error.message,
      error.response?.status,
      data?.code
    )
  }

  throw error instanceof Error
    ? error
    : new Error('An unexpected error occurred.')
}
