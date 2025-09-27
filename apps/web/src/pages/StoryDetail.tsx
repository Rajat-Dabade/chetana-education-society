import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Calendar, Share2, ArrowUp } from 'lucide-react'
import { impactApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import EmptyState from '@/components/EmptyState'

export default function StoryDetail() {
  const { slug } = useParams<{ slug: string }>()
  
  const { data: story, isLoading, error } = useQuery({
    queryKey: ['story', slug],
    queryFn: () => impactApi.getStory(slug!).then(res => res.data),
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

  if (error || !story) {
    return (
      <div className="min-h-screen bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-4xl px-6 py-24">
          <EmptyState
            title="Story not found"
            description="The success story you're looking for doesn't exist or has been removed."
            action={{
              text: 'Back to Impact',
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
          to="/impact"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Our Impact
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Calendar className="h-4 w-4" />
            <time>{formatDate(story.createdAt)}</time>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            {story.title}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {story.excerpt}
          </p>

          {/* Share button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: story.title,
                  text: story.excerpt,
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

        {/* Cover image */}
        {story.coverUrl && (
          <img
            src={story.coverUrl}
            alt={story.title}
            className="w-full h-96 object-cover rounded-2xl mb-8"
          />
        )}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none text-gray-900 dark:text-gray-100"
          dangerouslySetInnerHTML={{ __html: story.content }}
        />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <Link
              to="/impact"
              className="btn-outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Our Impact
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
