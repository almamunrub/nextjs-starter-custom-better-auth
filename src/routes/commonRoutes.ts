import { getDefaultDashboardRoute, UserRole } from '@/lib/authUtils'
import { NavSection } from '@/types'

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role)
  return [
    {
      // title : "Dashboard",
      items: [
        {
          title: 'Home',
          href: '/',
          icon: 'Home',
        },
        {
          title: 'Dashboard',
          href: defaultDashboard,
          icon: 'LayoutDashboard',
        },
        {
          title: 'My Profile',
          href: `/my-profile`,
          icon: 'User',
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Change Password',
          href: '/change-password',
          icon: 'Settings',
        },
      ],
    },
  ]
}
