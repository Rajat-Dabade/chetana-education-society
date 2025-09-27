import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Search, Calendar, Tag, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { newsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import NewsForm from '@/components/admin/NewsForm'
import EmptyState from '@/components/EmptyState'

export default function AdminNews() {
  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'NEWS' | 'EVENT'>('ALL')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-news'],
    queryFn: () => newsApi.getNews({ limit: 100 }).then(res => res.data)
  })

  const filteredNews = data?.items?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.body.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'ALL' || item.type === typeFilter
    return matchesSearch && matchesType
  }) || []

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      await newsApi.deleteNewsItem(id)
      toast.success('News item deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-news'] })
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to delete news item')
    }
  }

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-news'] })
    queryClient.invalidateQueries({ queryKey: ['news'] })
  }

  const handleEdit = (newsItem: any) => {
    setEditingNews(newsItem)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingNews(null)
  }

  const filters = [
    { key: 'ALL', label: 'All' },
    { key: 'NEWS', label: 'News' },
    { key: 'EVENT', label: 'Events' },
  ] as const

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">News & Events</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage news articles and upcoming events.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add News/Event
        </button>
      </div>

      {/* Filters and Search */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex space-x-1 bg-white dark:bg-navy-800 p-1 rounded-lg">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setTypeFilter(filter.key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                typeFilter === filter.key
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search news and events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10"
            />
          </div>
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
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredNews.map((item) => (
              <div key={item.id} className="card p-6">
                {item.heroUrl && (
                  <img
                    src={item.heroUrl}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex space-x-1 ml-2">
                    <a
                      href={`/news/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="View"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(item.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Tag className="h-4 w-4" />
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.type === 'NEWS' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {item.type === 'NEWS' ? 'News' : 'Event'}
                    </span>
                  </div>
                </div>
                
                <div 
                  className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: item.body.substring(0, 150) + '...' }}
                />
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Created {formatDate(item.createdAt)}</span>
                  <span>/news/{item.slug}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title={searchQuery || typeFilter !== 'ALL' ? "No items found" : "No news or events yet"}
            description={searchQuery || typeFilter !== 'ALL' ? "Try adjusting your filters." : "Add your first news article or event to get started."}
            icon={Calendar}
            action={{
              text: 'Add News/Event',
              onClick: () => setShowForm(true)
            }}
          />
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <NewsForm
          newsItem={editingNews}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}
