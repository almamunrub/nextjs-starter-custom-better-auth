export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public data?: any
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

  if (error instanceof ApiError) {
    throw error
  }

  throw error instanceof Error
    ? error
    : new Error('An unexpected error occurred.')
}
