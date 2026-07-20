import { Suspense } from 'react'
import UserInfoComponentMain from './_components/UserInfoComponentMain'

function MyProfilePage() {
  return (
    <Suspense>
      <UserInfoComponentMain />
    </Suspense>
  )
}

export default MyProfilePage
