import { getDefaultDashboardRoute } from '@/lib/authUtils'
import { getUserInfo } from '@/services/auth.services'
import { NavSection } from '@/types'
import DashboardNavbarContent from './DashboardNavbarContent'
import { getNavItemsByRole } from '@/routes'

const DashboardNavbar = async () => {
  const userInfo = await getUserInfo()
  const navItems: NavSection[] = getNavItemsByRole(userInfo.role)

  const dashboardHome = getDefaultDashboardRoute(userInfo.role)

  // console.log(userInfo, 'user info')
  return (
    <DashboardNavbarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  )
}

export default DashboardNavbar
