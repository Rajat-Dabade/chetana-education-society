import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Search, FileText, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { impactApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import StoryForm from '@/components/admin/StoryForm'
import EmptyState from '@/components/EmptyState'

export default function AdminStories() {
  const [showForm, setShowForm] = useState(false)
  const [editingStory, setEditingStory] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  const { data: stories, isLoading } = useQuery({
    queryKey: ['admin-stories'],
    queryFn: () => impactApi.getStories().then(res => res.data)
  })

  const filteredStories = stories?.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      await impactApi.deleteStory(id)
      toast.success('Story deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-stories'] })
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to delete story')
    }
  }

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-stories'] })
    queryClient.invalidateQueries({ queryKey: ['stories'] })
  }

  const handleEdit = (story: any) => {
    setEditingStory(story)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingStory(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Success Stories</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage success stories and impact narratives.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Story
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
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="card p-6">
                  <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStories.map((story) => (
              <div key={story.id} className="card p-6">
                {story.coverUrl && (
                  <img
                    src={story.coverUrl}
                    alt={story.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {story.title}
                  </h3>
                  <div className="flex space-x-1 ml-2">
                    <a
                      href={`/impact/stories/${story.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="View"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => handleEdit(story)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(story.id, story.title)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {story.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Created {formatDate(story.createdAt)}</span>
                  <span>/impact/stories/{story.slug}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title={searchQuery ? "No stories found" : "No success stories yet"}
            description={searchQuery ? `No results found for "${searchQuery}"` : "Add your first success story to get started."}
            icon={FileText}
            action={{
              text: 'Add Story',
              onClick: () => setShowForm(true)
            }}
          />
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <StoryForm
          story={editingStory}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}
