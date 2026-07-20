import { adminNavItems } from './adminRoutes'

export function getRouteTitle(pathname: string): string {
  // Flatten all items for easy lookup
  const allItems = adminNavItems.flatMap(route => route.items || [])

  // Exact match first
  const exact = allItems.find(item => item.href === pathname)
  if (exact) return exact.title

  // Fallback: last segment (for dynamic routes like /dashboard/users/[id])
  const segments = pathname.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1]

  // Capitalize or map common segments
  if (lastSegment) {
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return 'Dashboard'
}
