import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { successStorySchema, type SuccessStoryInput } from '@/lib/validations'
import { impactApi, uploadApi } from '@/lib/api'
import { createSlug } from '@/lib/utils'
import RichTextEditor from './RichTextEditor'

interface StoryFormProps {
  story?: any
  onClose: () => void
  onSuccess: () => void
}

export default function StoryForm({ story, onClose, onSuccess }: StoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [content, setContent] = useState(story?.content || '')
  const isEditing = !!story

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SuccessStoryInput>({
    resolver: zodResolver(successStorySchema),
    defaultValues: story || {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverUrl: ''
    }
  })

  const coverUrl = watch('coverUrl')

  // Sync content state with form
  useEffect(() => {
    setValue('content', content)
  }, [content, setValue])

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    if (!isEditing) {
      setValue('slug', createSlug(newTitle))
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const response = await uploadApi.uploadFile(file)
      setValue('coverUrl', response.data.url)
      toast.success('Image uploaded successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: SuccessStoryInput) => {
    const submitData = { ...data, content }
    
    setIsSubmitting(true)
    try {
      if (isEditing) {
        await impactApi.updateStory(story.id, submitData)
        toast.success('Story updated successfully')
      } else {
        await impactApi.createStory(submitData)
        toast.success('Story created successfully')
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
            {isEditing ? 'Edit Success Story' : 'Add New Success Story'}
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
                placeholder="Story title"
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
                placeholder="story-url-slug"
              />
              {errors.slug && (
                <p className="form-error">{errors.slug.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Used in the URL: /impact/stories/{watch('slug')}
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="excerpt" className="form-label">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              rows={3}
              {...register('excerpt')}
              className="form-input"
              placeholder="Brief description of the story..."
              maxLength={200}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.excerpt && (
                <p className="form-error">{errors.excerpt.message}</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                {watch('excerpt')?.length || 0}/200
              </p>
            </div>
          </div>

          <div>
            <label className="form-label">Cover Image</label>
            <div className="mt-2">
              {coverUrl && (
                <div className="mb-4">
                  <img
                    src={coverUrl}
                    alt="Cover preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex items-center space-x-4">
                <label className="btn-outline cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Cover Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {coverUrl && (
                  <button
                    type="button"
                    onClick={() => setValue('coverUrl', '')}
                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <input type="hidden" {...register('coverUrl')} />
            {errors.coverUrl && (
              <p className="form-error">{errors.coverUrl.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Content *</label>
            <div className="mt-2">
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Tell the full success story..."
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
