import { NavSection } from '@/types'

export const adminNavItems: NavSection[] = [
  {
    title: 'ARENaXL',
    items: [
      {
        title: 'Overview',
        href: '/admin/dashboard/overview',
        icon: 'Home',
      },
      {
        title: 'Organization',
        href: '/admin/dashboard/organization',
        icon: 'Building',
      },
      {
        title: 'Tournament',
        href: '/admin/dashboard/tournament-management',
        icon: 'Trophy',
      },
      {
        title: 'Retention',
        href: '/admin/dashboard/retention',
        icon: 'Users',
      },
      {
        title: 'Coach',
        href: '/admin/dashboard/coach-management',
        icon: 'UserCheck',
      },
    ],
  },
]
