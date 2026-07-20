import { getDefaultDashboardRoute } from '@/lib/authUtils'
import { getUserInfo } from '@/services/auth.services'
import { NavSection } from '@/types/dashboard.types'
import DashboardSidebarContent from './DashboardSidebarContent'
import { getNavItemsByRole } from '@/routes'
import { redirect } from 'next/navigation'

const DashboardSidebar = async () => {
  const userInfo = await getUserInfo()

  if (!userInfo) {
    redirect('/api/auth/logout')
  }
  const navItems: NavSection[] = getNavItemsByRole(userInfo.role)

  const dashboardHome = getDefaultDashboardRoute(userInfo.role)
  return (
    <DashboardSidebarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  )
}

export default DashboardSidebar
