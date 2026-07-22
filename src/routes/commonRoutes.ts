import { getDefaultDashboardRoute, UserRole } from '@/lib/authUtils'
import { NavSection } from '@/types'

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  // const defaultDashboard = getDefaultDashboardRoute(role)
  return [
    // {
    //   items: [
    //     {
    //       title: 'Home',
    //       href: '/',
    //       icon: 'Home',
    //     },
    //     {
    //       title: 'Dashboard',
    //       href: defaultDashboard,
    //       icon: 'LayoutDashboard',
    //     },
    //   ],
    // },
    {
      title: 'Settings',
      items: [
        {
          title: 'My Profile',
          href: `/my-profile`,
          icon: 'User',
        },
        {
          title: 'Change Password',
          href: '/change-password',
          icon: 'Settings',
        },
      ],
    },
  ]
}
