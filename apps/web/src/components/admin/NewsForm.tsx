import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Upload, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { newsSchema, type NewsInput } from '@/lib/validations'
import { newsApi, uploadApi } from '@/lib/api'
import { createSlug } from '@/lib/utils'
import RichTextEditor from './RichTextEditor'

interface NewsFormProps {
  newsItem?: any
  onClose: () => void
  onSuccess: () => void
}

export default function NewsForm({ newsItem, onClose, onSuccess }: NewsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [content, setContent] = useState(newsItem?.body || '')
  const [gallery, setGallery] = useState<string[]>(newsItem?.gallery || [])
  const isEditing = !!newsItem

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewsInput>({
    resolver: zodResolver(newsSchema),
    defaultValues: newsItem ? {
      ...newsItem,
      date: new Date(newsItem.date).toISOString().slice(0, 16)
    } : {
      title: '',
      slug: '',
      type: 'NEWS',
      date: new Date().toISOString().slice(0, 16),
      body: '',
      heroUrl: '',
      gallery: []
    }
  })

  const heroUrl = watch('heroUrl')

  // Sync content state with form
  useEffect(() => {
    setValue('body', content)
  }, [content, setValue])

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    if (!isEditing) {
      setValue('slug', createSlug(newTitle))
    }
  }

  const handleHeroUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const response = await uploadApi.uploadFile(file)
      setValue('heroUrl', response.data.url)
      toast.success('Hero image uploaded successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (gallery.length >= 8) {
      toast.error('Maximum 8 gallery images allowed')
      return
    }

    setUploading(true)
    try {
      const response = await uploadApi.uploadFile(file)
      const newGallery = [...gallery, response.data.url]
      setGallery(newGallery)
      setValue('gallery', newGallery)
      toast.success('Gallery image uploaded successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeGalleryImage = (index: number) => {
    const newGallery = gallery.filter((_, i) => i !== index)
    setGallery(newGallery)
    setValue('gallery', newGallery)
  }

  const onSubmit = async (data: NewsInput) => {
    const submitData = { 
      ...data, 
      body: content,
      gallery: gallery,
      date: new Date(data.date).toISOString() // Convert to ISO format
    }
    
    setIsSubmitting(true)
    try {
      if (isEditing) {
        await newsApi.updateNewsItem(newsItem.id, submitData)
        toast.success('News item updated successfully')
      } else {
        await newsApi.createNewsItem(submitData)
        toast.success('News item created successfully')
      }
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Edit News/Event' : 'Add News/Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="form-label">
                Title *
              </label>
              <input
                type="text"
                id="title"
                {...register('title', {
                  onChange: handleTitleChange
                })}
                className="form-input"
                placeholder="News/Event title"
              />
              {errors.title && (
                <p className="form-error">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="slug" className="form-label">
                URL Slug *
              </label>
              <input
                type="text"
                id="slug"
                {...register('slug')}
                className="form-input"
                placeholder="news-url-slug"
              />
              {errors.slug && (
                <p className="form-error">{errors.slug.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Used in the URL: /news/{watch('slug')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="form-label">
                Type *
              </label>
              <select
                id="type"
                {...register('type')}
                className="form-input"
              >
                <option value="NEWS">News</option>
                <option value="EVENT">Event</option>
              </select>
              {errors.type && (
                <p className="form-error">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="date" className="form-label">
                Date *
              </label>
              <input
                type="datetime-local"
                id="date"
                {...register('date')}
                className="form-input"
              />
              {errors.date && (
                <p className="form-error">{errors.date.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="form-label">Hero Image</label>
            <div className="mt-2">
              {heroUrl && (
                <div className="mb-4">
                  <img
                    src={heroUrl}
                    alt="Hero preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex items-center space-x-4">
                <label className="btn-outline cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Hero Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {heroUrl && (
                  <button
                    type="button"
                    onClick={() => setValue('heroUrl', '')}
                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <input type="hidden" {...register('heroUrl')} />
            {errors.heroUrl && (
              <p className="form-error">{errors.heroUrl.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Gallery Images (Max 8)</label>
            <div className="mt-2">
              {gallery.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {gallery.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {gallery.length < 8 && (
                <label className="btn-outline cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Add Gallery Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {gallery.length}/8 images
              </p>
            </div>
          </div>

          <div>
            <label className="form-label">Content *</label>
            <div className="mt-2">
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Write your news article or event details..."
              />
            </div>
            {!content && (
              <p className="form-error">Content is required</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !content}
              className="btn-primary"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
