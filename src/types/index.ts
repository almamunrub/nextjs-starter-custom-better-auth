export type * from './api.types'
export type * from './auth.types'
export type * from './user.types'
export type * from './dashboard.types'

export interface ServiceOptions {
  cache?: RequestCache
  revalidate?: number
}

export type QueryParams = Record<string, string | number | undefined>
