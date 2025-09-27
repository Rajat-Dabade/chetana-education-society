import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { blogSchema, type BlogInput } from '@/lib/validations'
import { blogApi, uploadApi } from '@/lib/api'
import { createSlug } from '@/lib/utils'
import RichTextEditor from './RichTextEditor'

interface BlogFormProps {
  blog?: any
  onClose: () => void
  onSuccess: () => void
}

export default function BlogForm({ blog, onClose, onSuccess }: BlogFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [content, setContent] = useState(blog?.content || '')
  const isEditing = !!blog

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: blog || {
      title: '',
      slug: '',
      author: '',
      excerpt: '',
      content: '',
      coverUrl: '',
      order: 0
    }
  })

  // Sync content state with form
  useEffect(() => {
    setValue('content', content)
  }, [content, setValue])

  const coverUrl = watch('coverUrl')

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

  const onSubmit = async (data: BlogInput) => {
    const submitData = { ...data, content }
    
    setIsSubmitting(true)
    try {
      if (isEditing) {
        await blogApi.updateBlog(blog.id, submitData)
        toast.success('Blog post updated successfully')
      } else {
        await blogApi.createBlog(submitData)
        toast.success('Blog post created successfully')
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
            {isEditing ? 'Edit Blog Post' : 'Add New Blog Post'}
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
                placeholder="Blog post title"
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
                placeholder="blog-post-url-slug"
              />
              {errors.slug && (
                <p className="form-error">{errors.slug.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Used in the URL: /blogs/{watch('slug')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="author" className="form-label">
                Author *
              </label>
              <input
                type="text"
                id="author"
                {...register('author')}
                className="form-input"
                placeholder="Author name"
              />
              {errors.author && (
                <p className="form-error">{errors.author.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="order" className="form-label">
                Priority Order
              </label>
              <input
                type="number"
                id="order"
                {...register('order', { valueAsNumber: true })}
                className="form-input"
                placeholder="0"
                min="0"
              />
              {errors.order && (
                <p className="form-error">{errors.order.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Higher numbers appear first
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
              placeholder="Brief description of the blog post..."
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
                placeholder="Write your blog post content..."
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
