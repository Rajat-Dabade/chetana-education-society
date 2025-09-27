import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { testimonialSchema, type TestimonialInput } from '@/lib/validations'
import { impactApi, uploadApi } from '@/lib/api'
import type { Testimonial, ErrorWithResponse } from '@/types'
import StarRating from '@/components/StarRating'
import LoadingSpinner from '@/components/LoadingSpinner'

interface TestimonialFormProps {
  testimonial?: Testimonial
  onClose: () => void
  onSuccess: () => void
}

export default function TestimonialForm({ testimonial, onClose, onSuccess }: TestimonialFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const isEditing = !!testimonial

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: testimonial || {
      name: '',
      role: '',
      quote: '',
      rating: 5,
      avatarUrl: ''
    }
  })

  const avatarUrl = watch('avatarUrl')

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const response = await uploadApi.uploadFile(file)
      setValue('avatarUrl', response.data.url)
      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error((error as ErrorWithResponse)?.response?.data?.error?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: TestimonialInput) => {
    setIsSubmitting(true)
    try {
      if (isEditing) {
        await impactApi.updateTestimonial(testimonial.id, data)
        toast.success('Testimonial updated successfully')
      } else {
        await impactApi.createTestimonial(data)
        toast.success('Testimonial created successfully')
      }
      onSuccess()
      onClose()
    } catch (error) {
      toast.error((error as ErrorWithResponse)?.response?.data?.error?.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-scale-in mx-2 sm:mx-0">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="name" className="form-label">
                Name *
              </label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className="form-input"
                placeholder="Full name"
              />
              {errors.name && (
                <p className="form-error">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="form-label">
                Role/Title
              </label>
              <input
                type="text"
                id="role"
                {...register('role')}
                className="form-input"
                placeholder="e.g., Community Leader"
              />
              {errors.role && (
                <p className="form-error">{errors.role.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="form-label">
              Rating *
            </label>
            <div className="mt-2">
              <StarRating
                rating={watch('rating') || 5}
                interactive
                onChange={(newRating) => setValue('rating', newRating)}
                size="lg"
              />
              <input type="hidden" {...register('rating', { valueAsNumber: true })} />
            </div>
            {errors.rating && (
              <p className="form-error">{errors.rating.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="quote" className="form-label">
              Quote *
            </label>
            <textarea
              id="quote"
              rows={4}
              {...register('quote')}
              className="form-input"
              placeholder="Their testimonial..."
              maxLength={280}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.quote && (
                <p className="form-error">{errors.quote.message}</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                {watch('quote')?.length || 0}/280
              </p>
            </div>
          </div>

          <div>
            <label className="form-label">Avatar Image</label>
            <div className="mt-2">
              {avatarUrl && (
                <div className="mb-4">
                  <img
                    src={avatarUrl}
                    alt="Avatar preview"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center space-x-4">
                <label className="btn-outline cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setValue('avatarUrl', '')}
                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <input type="hidden" {...register('avatarUrl')} />
            {errors.avatarUrl && (
              <p className="form-error">{errors.avatarUrl.message}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                isEditing ? 'Update' : 'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
