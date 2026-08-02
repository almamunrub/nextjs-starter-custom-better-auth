'use server'

import { httpClient } from '@/lib/fetch/httpClient'
import { revalidatePath } from 'next/cache'

export const updateUserProfile = async (formData: FormData) => {
  try {
    const response = await httpClient.patch<any>('/users/profile', formData)

    revalidatePath('/')

    return {
      success: true,
      data: response.data,
      message: response.message || 'Profile updated successfully',
    }
  } catch (error: any) {
    console.error('Error updating profile:', error)
    return {
      success: false,
      message:
        error?.message ||
        'An unexpected error occurred while updating the profile',
    }
  }
}
