import { UserRole } from '@/lib/authUtils'
import { getCommonNavItems } from './commonRoutes'
import { NavSection } from '@/types'
import { adminNavItems } from './adminRoutes'
import { userNavItems } from './userRoutes'

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role)

  switch (role) {
    case 'SUPER_ADMIN':
    case 'ADMIN':
      return [...commonNavItems, ...adminNavItems]

    case 'USER':
      return [...commonNavItems, ...userNavItems]
  }
}
