import { NavSection } from '@/types'

export const adminNavItems: NavSection[] = [
  {
    title: 'User Management',
    items: [
      {
        title: 'Admins',
        href: '/admin/dashboard/admins-management',
        icon: 'Shield',
      },
      {
        title: 'Doctors',
        href: '/admin/dashboard/doctors-management',
        icon: 'Stethoscope',
      },
      {
        title: 'Patients',
        href: '/admin/dashboard/patients-management',
        icon: 'Users',
      },
    ],
  },
  {
    title: 'Hospital Management',
    items: [
      {
        title: 'Appointments',
        href: '/admin/dashboard/appointments-management',
        icon: 'Calendar',
      },
      {
        title: 'Schedules',
        href: '/admin/dashboard/schedules-management',
        icon: 'Clock',
      },
      {
        title: 'Specialties',
        href: '/admin/dashboard/specialties-management',
        icon: 'Hospital',
      },
      {
        title: 'Doctor Schedules',
        href: '/admin/dashboard/doctor-schedules-managament',
        icon: 'CalendarClock',
      },
      {
        title: 'Doctor Specialties',
        href: '/admin/dashboard/doctor-specialties-management',
        icon: 'Stethoscope',
      },
      {
        title: 'Payments',
        href: '/admin/dashboard/payments-management',
        icon: 'CreditCard',
      },
      {
        title: 'Prescriptions',
        href: '/admin/dashboard/prescriptions-management',
        icon: 'FileText',
      },
      {
        title: 'Reviews',
        href: '/admin/dashboard/reviews-management',
        icon: 'Star',
      },
    ],
  },
]
