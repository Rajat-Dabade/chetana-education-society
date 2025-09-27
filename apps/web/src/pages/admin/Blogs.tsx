import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Search, BookOpen, ExternalLink, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'
import { blogApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import BlogForm from '@/components/admin/BlogForm'
import EmptyState from '@/components/EmptyState'

export default function AdminBlogs() {
  const [showForm, setShowForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: () => blogApi.getBlogs({ limit: 100 }).then(res => res.data)
  })

  const filteredBlogs = data?.items?.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      await blogApi.deleteBlog(id)
      toast.success('Blog post deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] })
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to delete blog post')
    }
  }

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-blogs'] })
    queryClient.invalidateQueries({ queryKey: ['blogs'] })
  }

  const handleEdit = (blog: any) => {
    setEditingBlog(blog)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingBlog(null)
  }

  const handleDragStart = (e: React.DragEvent, blog: any) => {
    setDraggedItem(blog)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetBlog: any) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem.id === targetBlog.id) return

    const blogs = [...filteredBlogs]
    const draggedIndex = blogs.findIndex(b => b.id === draggedItem.id)
    const targetIndex = blogs.findIndex(b => b.id === targetBlog.id)
    
    if (draggedIndex === -1 || targetIndex === -1) return

    // Remove dragged item and insert at target position
    const [removed] = blogs.splice(draggedIndex, 1)
    blogs.splice(targetIndex, 0, removed)

    // Update order values
    const reorderData = blogs.map((blog, index) => ({
      id: blog.id,
      order: blogs.length - index // Higher order = first position
    }))

    try {
      await blogApi.reorderBlogs(reorderData)
      toast.success('Blog order updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] })
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to reorder blogs')
    }

    setDraggedItem(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Create and manage blog posts. Drag to reorder.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Blog Post
        </button>
      </div>

      {/* Search */}
      <div className="mt-6 max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="card p-6 flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="space-y-4">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                draggable={!searchQuery}
                onDragStart={(e) => handleDragStart(e, blog)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, blog)}
                className={`card p-6 transition-all duration-200 ${
                  !searchQuery ? 'cursor-move hover:shadow-lg' : ''
                } ${draggedItem?.id === blog.id ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  {!searchQuery && (
                    <div className="flex-shrink-0 pt-2">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  
                  {blog.coverUrl && (
                    <img
                      src={blog.coverUrl}
                      alt={blog.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                          {blog.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          by {blog.author} • {formatDate(blog.publishedAt)}
                        </p>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                          Order: {blog.order}
                        </span>
                        <a
                          href={`/blogs/${blog.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="View"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleEdit(blog)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id, blog.title)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                      {blog.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Created {formatDate(blog.createdAt)}</span>
                      <span>/blogs/{blog.slug}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title={searchQuery ? "No blog posts found" : "No blog posts yet"}
            description={searchQuery ? `No results found for "${searchQuery}"` : "Add your first blog post to get started."}
            icon={BookOpen}
            action={{
              text: 'Add Blog Post',
              onClick: () => setShowForm(true)
            }}
          />
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <BlogForm
          blog={editingBlog}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}
