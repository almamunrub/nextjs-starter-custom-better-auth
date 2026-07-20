import Image from 'next/image'
import React from 'react'
import { Button } from '../../button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type TImangePreviewer = {
  imageFiles: File[]
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>
  imagePreview: string[]
  setImagePreview: React.Dispatch<React.SetStateAction<string[]>>
  className?: string
}

const ImagePreviewer = ({
  setImageFiles,
  imagePreview,
  setImagePreview,
  className,
}: TImangePreviewer) => {
  if (!Array.isArray(imagePreview)) return null
  const handleRemove = (index: number) => {
    setImageFiles(prev => prev.filter((_, idx) => idx !== index))
    setImagePreview(prev => prev.filter((_, idx) => idx !== index))
  }

  return (
    <div className={cn('flex w-full flex-col items-center gap-4', className)}>
      {imagePreview.map((preview, index) => (
        <div
          key={index}
          className='relative h-36 w-36 overflow-hidden rounded-md border border-dashed border-gray-300'
        >
          <Image
            width={500}
            height={500}
            src={preview}
            alt={`Preview ${index + 1}`}
            className='h-full w-full object-cover'
            unoptimized
          />
          <Button
            type='button'
            size='sm'
            onClick={() => handleRemove(index)}
            className='absolute top-0 right-0 h-6 w-6 rounded-full bg-red-300 p-0 hover:bg-red-400'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      ))}
    </div>
  )
}

export default ImagePreviewer
