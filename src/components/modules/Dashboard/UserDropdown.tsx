import { logoutAction } from '@/actions/auth.actions'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IUserInfo } from '@/types'
import { Key, LogOut, User } from 'lucide-react'
import Link from 'next/link'

interface UserDropdownProps {
  userInfo: IUserInfo
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
  const handleLogOut = async () => {
    await logoutAction()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'outline'} size={'icon'} className='rounded-full'>
          <Avatar className='h-8 w-8 rounded-lg'>
            <AvatarImage src={userInfo?.image} alt={userInfo?.name} />
            <AvatarFallback className='rounded-lg'>🛡️</AvatarFallback>
            <AvatarBadge className='bg-green-600 dark:bg-green-800' />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={'end'} className='w-56'>
        <DropdownMenuLabel>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium'>{userInfo.name}</p>

            <p className='text-muted-foreground text-xs'>{userInfo.email}</p>

            <p className='text-primary text-xs capitalize'>
              {userInfo.role.toLowerCase().replace('_', ' ')}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href={'/my-profile'} className='flex items-center'>
            <User className='mr-2 h-4 w-4' />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link href={'/change-password'} className='flex items-center'>
            <Key className='mr-2 h-4 w-4' />
            Change Password
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleLogOut()}
          className='cursor-pointer text-red-600'
        >
          <LogOut className='mr-2 h-4 w-4' />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown
