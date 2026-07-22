'use client'

import assets from '@/assets'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getIconComponent } from '@/lib/iconMapper'
import { cn } from '@/lib/utils'
import { NavSection } from '@/types'
import { IUserInfo } from '@/types/user.types'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DashboardSidebarContentProps {
  userInfo: IUserInfo
  navItems: NavSection[]
  dashboardHome: string
}

const DashboardSidebarContent = ({
  dashboardHome,
  navItems,
  userInfo,
}: DashboardSidebarContentProps) => {
  const pathname = usePathname()
  return (
    <div className='bg-card hidden h-full w-64 flex-col overflow-y-auto border-r md:flex'>
      <div className='flex h-22 items-center justify-center'>
        <Image
          src={assets.images.logoPng}
          alt='logo'
          width={200}
          height={200}
          className='h-22 w-auto object-contain'
          unoptimized
        />
      </div>

      {/* Navigation Area */}
      <ScrollArea className='flex-1 px-3 py-4'>
        <nav className='space-y-6'>
          {navItems.map((section, index: number) => (
            <div key={index}>
              {section.title && (
                <h4 className='text-muted-foreground mb-2 px-3 text-xs font-semibold tracking-wider uppercase'>
                  {section.title}
                </h4>
              )}

              <div className='space-y-1'>
                {section.items.map((item, id) => {
                  const isActive = pathname === item.href
                  // Icon Mapper Function
                  const Icon = getIconComponent(item.icon)

                  return (
                    <Link
                      href={item.href}
                      key={id}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <Icon className='h-4 w-4' />
                      <span>{item.title}</span>
                    </Link>
                  )
                })}
              </div>

              {index < navItems.length - 1 && <Separator className='my-4' />}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info At Bottom */}
      <div className='border-t px-3 py-4'>
        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarImage src={userInfo?.image} alt={userInfo?.name} />
              <AvatarFallback className='rounded-lg'>🛡️</AvatarFallback>
              <AvatarBadge className='bg-green-600 dark:bg-green-800' />
            </Avatar>
          </div>

          <div className='flex-1 overflow-hidden'>
            <p className='truncate text-sm font-medium'>{userInfo.name}</p>
            <p className='text-muted-foreground text-xs capitalize'>
              {userInfo.role.toLocaleLowerCase().replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardSidebarContent
