import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Calendar, Tag, Share2, ArrowUp } from 'lucide-react'
import { newsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import EmptyState from '@/components/EmptyState'

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>()
  
  const { data: newsItem, isLoading, error } = useQuery({
    queryKey: ['news', slug],
    queryFn: () => newsApi.getNewsItem(slug!).then(res => res.data),
    enabled: !!slug
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-4xl px-6 py-24">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !newsItem) {
    return (
      <div className="min-h-screen bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-4xl px-6 py-24">
          <EmptyState
            title="News item not found"
            description="The news item you're looking for doesn't exist or has been removed."
            action={{
              text: 'Back to News',
              onClick: () => window.history.back()
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950 animate-fade-in">
      <article className="mx-auto max-w-4xl px-6 py-24">
        {/* Back button */}
        <Link
          to="/news"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to News & Events
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <time>{formatDate(newsItem.date)}</time>
            </div>
            <div className="flex items-center space-x-1">
              <Tag className="h-4 w-4" />
              <span className={`px-2 py-1 text-xs rounded-full ${
                newsItem.type === 'NEWS' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              }`}>
                {newsItem.type === 'NEWS' ? 'News' : 'Event'}
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            {newsItem.title}
          </h1>

          {/* Share button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: newsItem.title,
                  url: window.location.href
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
              }
            }}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </button>
        </header>

        {/* Hero image */}
        {newsItem.heroUrl && (
          <img
            src={newsItem.heroUrl}
            alt={newsItem.title}
            className="w-full h-96 object-cover rounded-2xl mb-8"
          />
        )}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none text-gray-900 dark:text-gray-100"
          dangerouslySetInnerHTML={{ __html: newsItem.body }}
        />

        {/* Gallery */}
        {newsItem.gallery && newsItem.gallery.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Gallery</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {newsItem.gallery.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`${newsItem.title} - Image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <Link
              to="/news"
              className="btn-outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News & Events
            </Link>
            
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              Back to top
            </button>
          </div>
        </footer>
      </article>
    </div>
  )
}
