'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { NavSection } from '@/types/dashboard.types'
import { IUserInfo } from '@/types/user.types'
import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import DashboardMobileSidebar from './DashboardMobileSidebar'
import NotificationDropdown from './NotificationDropdown'
import UserDropdown from './UserDropdown'
import { usePathname } from 'next/navigation'
import { getRouteTitle } from '@/routes/getRouteTitle'

interface DashboardNavbarProps {
  userInfo: IUserInfo
  navItems: NavSection[]
  dashboardHome: string
}

const DashboardNavbarContent = ({
  dashboardHome,
  navItems,
  userInfo,
}: DashboardNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const pathname = usePathname()
  const title = getRouteTitle(pathname)

  useEffect(() => {
    const checkSmallerScreen = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkSmallerScreen()
    window.addEventListener('resize', checkSmallerScreen)

    return () => {
      window.removeEventListener('resize', checkSmallerScreen)
    }
  }, [])

  return (
    <div className='bg-background flex w-full items-center gap-4 border-b px-4 py-3'>
      {/* Mobile Menu Toggle Button And Menu */}
      <Sheet open={isOpen && isMobile} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className='md:hidden'>
          <Button variant={'outline'} size={'icon'}>
            <Menu className='h-5 w-5' />
          </Button>
        </SheetTrigger>

        <SheetContent side='left' className='w-64 p-0'>
          <DashboardMobileSidebar
            userInfo={userInfo}
            dashboardHome={dashboardHome}
            navItems={navItems}
          />
        </SheetContent>
      </Sheet>

      <div className='flex flex-1'>
        <h1 className='text-sm font-bold tracking-tight md:text-2xl'>
          {title}
        </h1>
      </div>

      {/* Right Side Actions */}
      <div className='flex items-center gap-2'>
        {/* Notification */}
        <NotificationDropdown />

        {/* User Dropdown  */}
        <UserDropdown userInfo={userInfo} />
      </div>
    </div>
  )
}

export default DashboardNavbarContent
