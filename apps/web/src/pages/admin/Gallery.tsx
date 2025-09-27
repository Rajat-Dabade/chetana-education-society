import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Search, Image as ImageIcon, Star, GripVertical, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { galleryApi, uploadApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import EmptyState from '@/components/EmptyState'

// Gallery Form Component
function GalleryForm({ image, onClose, onSuccess }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(image?.imageUrl || null)
  const [formData, setFormData] = useState({
    title: image?.title || '',
    description: image?.description || '',
    imageUrl: image?.imageUrl || '',
    featured: image?.featured || false,
    order: image?.order || 0
  })

  // Auto-submit after successful upload
  useEffect(() => {
    if (selectedFile && formData.imageUrl && !isUploading) {
      handleSubmit(new Event('submit') as any)
    }
  }, [formData.imageUrl, selectedFile, isUploading])

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const validateAndSetFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return false
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return false
    }
    
    setSelectedFile(file)
    
    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    
    // Auto-fill title from filename if empty
    if (!formData.title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
      setFormData({ ...formData, title: nameWithoutExt })
    }
    
    return true
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      validateAndSetFile(files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', selectedFile)
      
      const response = await uploadApi.uploadFile(uploadFormData)
      const uploadedUrl = response.data.url
      
      setFormData({ ...formData, imageUrl: uploadedUrl })
      toast.success('Image uploaded successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title) {
      toast.error('Title is required')
      return
    }

    // If there's a selected file but no imageUrl, upload first
    if (selectedFile && !formData.imageUrl) {
      await handleUpload()
      return // The form will be submitted after upload via the useEffect
    }

    if (!formData.imageUrl) {
      toast.error('Please select an image')
      return
    }

    setIsSubmitting(true)
    try {
      if (image) {
        await galleryApi.updateGalleryImage(image.id, formData)
        toast.success('Gallery image updated successfully')
      } else {
        await galleryApi.createGalleryImage(formData)
        toast.success('Gallery image added successfully')
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
      <div className="bg-white dark:bg-navy-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {image ? 'Edit Gallery Image' : 'Add Gallery Image'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="form-label">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
              placeholder="Image title"
              required
            />
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
              rows={3}
              placeholder="Optional description"
            />
          </div>

          <div>
            <label className="form-label">Image *</label>
            
            {/* File Upload */}
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 transition-colors"
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>

              {/* Upload Button */}
              {selectedFile && !formData.imageUrl && (
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="btn-primary w-full"
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
              )}

              {/* Manual URL Input */}
              <div className="text-center">
                <span className="text-sm text-gray-500">or</span>
              </div>
              
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => {
                  setFormData({ ...formData, imageUrl: e.target.value })
                  setPreviewUrl(e.target.value)
                }}
                className="form-input"
                placeholder="Paste image URL here"
              />

              {/* Image Preview */}
              {previewUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full max-w-xs h-48 object-cover rounded-lg mx-auto"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="form-label">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="form-input"
                min="0"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">Higher numbers appear first</p>
            </div>

            <div>
              <label className="form-label">Featured Image</label>
              <div className="mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Mark as featured
                  </span>
                </label>
              </div>
            </div>
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
              disabled={isSubmitting || isUploading}
              className="btn-primary"
            >
              {isUploading ? 'Uploading...' : isSubmitting ? 'Saving...' : image ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminGallery() {
  const [showForm, setShowForm] = useState(false)
  const [editingImage, setEditingImage] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const [isQuickUploading, setIsQuickUploading] = useState(false)
  const queryClient = useQueryClient()

  const { data: images, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: () => galleryApi.getGalleryImages().then(res => res.data)
  })

  const filteredImages = images?.filter(image =>
    image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (image.description && image.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || []

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      await galleryApi.deleteGalleryImage(id)
      toast.success('Gallery image deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] })
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] })
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to delete image')
    }
  }

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-gallery'] })
    queryClient.invalidateQueries({ queryKey: ['gallery-images'] })
  }

  const handleEdit = (image: any) => {
    setEditingImage(image)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingImage(null)
  }

  const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setIsQuickUploading(true)
    try {
      // Upload file
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      
      const uploadResponse = await uploadApi.uploadFile(uploadFormData)
      const imageUrl = uploadResponse.data.url
      
      // Create gallery image with filename as title
      const title = file.name.replace(/\.[^/.]+$/, '')
      await galleryApi.createGalleryImage({
        title,
        imageUrl,
        description: '',
        order: 0,
        featured: false
      })
      
      toast.success('Image uploaded successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] })
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] })
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Upload failed')
    } finally {
      setIsQuickUploading(false)
      // Reset file input
      e.target.value = ''
    }
  }

  const handleDragStart = (e: React.DragEvent, image: any) => {
    setDraggedItem(image)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetImage: any) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem.id === targetImage.id) return

    const imageList = [...filteredImages]
    const draggedIndex = imageList.findIndex(img => img.id === draggedItem.id)
    const targetIndex = imageList.findIndex(img => img.id === targetImage.id)
    
    if (draggedIndex === -1 || targetIndex === -1) return

    // Remove dragged item and insert at target position
    const [removed] = imageList.splice(draggedIndex, 1)
    imageList.splice(targetIndex, 0, removed)

    // Update order values
    const reorderData = imageList.map((image, index) => ({
      id: image.id,
      order: imageList.length - index
    }))

    try {
      await galleryApi.reorderGalleryImages(reorderData)
      toast.success('Gallery order updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] })
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] })
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to reorder images')
    }

    setDraggedItem(null)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Photo Gallery</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage photo gallery images. Drag to reorder.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <label className="btn-secondary cursor-pointer w-full sm:w-auto">
            <Upload className="h-4 w-4 mr-2" />
            {isQuickUploading ? 'Uploading...' : 'Quick Upload'}
            <input
              type="file"
              accept="image/*"
              onChange={handleQuickUpload}
              className="hidden"
              disabled={isQuickUploading}
            />
          </label>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6 max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search gallery images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                draggable={!searchQuery}
                onDragStart={(e) => handleDragStart(e, image)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, image)}
                className={`relative group transition-all duration-200 ${
                  !searchQuery ? 'cursor-move hover:shadow-lg' : ''
                } ${draggedItem?.id === image.id ? 'opacity-50' : ''}`}
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  {!searchQuery && (
                    <div className="absolute top-2 left-2 z-10">
                      <GripVertical className="h-5 w-5 text-white drop-shadow-lg" />
                    </div>
                  )}
                  
                  {image.featured && (
                    <div className="absolute top-2 right-2 z-10">
                      <Star className="h-5 w-5 text-yellow-400 fill-current drop-shadow-lg" />
                    </div>
                  )}
                  
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <button
                        onClick={() => handleEdit(image)}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => handleDelete(image.id, image.title)}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Image info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <h3 className="text-white font-medium text-sm line-clamp-1">
                      {image.title}
                    </h3>
                    <div className="flex items-center justify-between text-white text-xs mt-1">
                      <span>Order: {image.order}</span>
                      <span>{formatDate(image.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title={searchQuery ? "No images found" : "No gallery images yet"}
            description={searchQuery ? `No results found for "${searchQuery}"` : "Add your first gallery image to get started."}
            icon={ImageIcon}
            action={{
              text: 'Add Image',
              onClick: () => setShowForm(true)
            }}
          />
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <GalleryForm
          image={editingImage}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}
