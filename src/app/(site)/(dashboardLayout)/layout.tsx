import DashboardNavbar from '@/components/modules/Dashboard/DashboardNavbar'
import DashboardSidebar from '@/components/modules/Dashboard/DashboardSidebar'
import React, { Suspense } from 'react'

const RootDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className='flex h-screen overflow-hidden'>
      {/* Dashboard Sidebar */}
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardSidebar />
      </Suspense>

      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* DashboardNavbar */}
        <Suspense fallback={<div>...</div>}>
          <DashboardNavbar />
        </Suspense>
        {/* Dashboard Content */}
        <main className='bg-muted/10 flex-1 overflow-y-auto p-4 md:p-6'>
          <div>{children}</div>
        </main>
      </div>
    </div>
  )
}

export default RootDashboardLayout
