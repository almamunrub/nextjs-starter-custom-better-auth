'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Lock } from 'lucide-react'
import { toast } from 'sonner'
import ImagePreviewer from '@/components/ui/core/MKImageUploader/ImagePreviewer'
import MKImageUploader from '@/components/ui/core/MKImageUploader'
import { getUserInfo } from '@/services/auth.services'
import { updateUserProfile } from '@/actions/user.actions'
import { Button } from '@/components/ui/button'
import { IUserInfo } from '@/types'
import { UserProfileSkeleton } from './UserProfileSkeleton'

const MAX_IMAGE_SIZE = 1 * 1024 * 1024 // 1MB in bytes

function UserInfoComponentMain() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<IUserInfo | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  })

  // Image states
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])

  // Fetch and pre-fill user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserInfo()
        // console.log(user, 'user')

        if (user) {
          setUser(user)

          setFormData({
            name: user.name || '',
            phone: user.phone || '',
          })

          if (user.image) {
            setImagePreview([user.image])
          }
        }
      } catch (error) {
        toast.error('Failed to load user information')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()

    // Size validation
    if (imageFiles.some(file => file.size > MAX_IMAGE_SIZE)) {
      toast.error('Image size must be less than 1MB')
      return
    }

    setIsSubmitting(true)

    try {
      const fd = new FormData()

      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) fd.append(key, value)
      })

      if (imageFiles.length > 0) {
        fd.append('profilePhoto', imageFiles[0])
      }

      // Call the server action
      const response = await updateUserProfile(fd)

      if (response.success) {
        toast.success(response.message || 'Profile updated successfully!')
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error('Something went wrong while updating.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='mx-auto flex max-w-2xl flex-col gap-4'>
      {isLoading ? (
        <UserProfileSkeleton />
      ) : (
        <>
          <Card className='p-6'>
            <div className='flex flex-col items-start gap-8 lg:flex-row'>
              {/* Left Side - Upload Area */}
              <div className='flex w-1/2 flex-col items-center text-center'>
                {imagePreview.length > 0 ? (
                  <ImagePreviewer
                    imageFiles={imageFiles}
                    setImageFiles={setImageFiles}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                  />
                ) : (
                  <MKImageUploader
                    label='Choose Image'
                    setImageFiles={setImageFiles}
                    setImagePreview={setImagePreview}
                  />
                )}
                <p className='text-muted-foreground mt-4 text-xs'>
                  Recommended: JPG or PNG, 400x400px (Max 1MB)
                </p>
              </div>

              {/* Right Side - Administrator/User Status */}
              <div className='flex w-1/2 flex-col items-end justify-end gap-3 pt-4 lg:pt-0'>
                <div className='flex items-center gap-3'>
                  <div className='relative flex size-3'>
                    <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75'></span>
                    <span className='relative inline-flex size-3 rounded-full bg-emerald-500'></span>
                  </div>
                  <h3 className='text-lg font-semibold'>
                    {user?.role.replaceAll('_', ' ')}
                  </h3>
                </div>
              </div>
            </div>
          </Card>

          <Card className='flex p-6'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='bg-muted rounded-lg p-2'>
                <Lock className='h-5 w-5' />
              </div>
              <div>
                <h2 className='text-xl font-semibold'>Personal Information</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='w-full space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Name</Label>
                <input
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  type='text'
                  placeholder='Enter your full name'
                  className='input-primary w-full rounded-md border p-2'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='phone'>Phone Number</Label>
                <input
                  id='phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  type='tel'
                  placeholder='Enter your phone number'
                  className='input-primary w-full rounded-md border p-2'
                />
              </div>

              <div className='flex max-w-md gap-4 pt-4'>
                <Button
                  type='button'
                  variant={'secondary'}
                  className='flex-1'
                  onClick={() => toast.info('Changes discarded')}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='flex-1'
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </>
      )}
    </div>
  )
}

export default UserInfoComponentMain
