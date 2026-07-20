'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type TImageUploader = {
  label?: string
  className?: string
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>
  setImagePreview: React.Dispatch<React.SetStateAction<string[]>>
}

const MKImageUploader = ({
  label = 'Upload Images',
  className,
  setImageFiles,
  setImagePreview,
}: TImageUploader) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0]

    setImageFiles(prev => [...prev, file])

    if (file) {
      const reader = new FileReader()

      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result as string])
      }

      reader.readAsDataURL(file)
    }

    event.target.value = ''
  }

  return (
    <div className={cn('flex w-full flex-col items-center gap-4', className)}>
      <Input
        id='image-upload'
        type='file'
        accept='image/*'
        multiple
        className='hidden'
        onChange={handleImageChange}
      />
      <label
        htmlFor='image-upload'
        className='flex h-36 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-center text-sm text-gray-500 transition hover:bg-gray-50 md:size-36'
      >
        {label}
      </label>
    </div>
  )
}

export default MKImageUploader
