import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Calendar, User, Share2, ArrowUp } from 'lucide-react'
import { blogApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import EmptyState from '@/components/EmptyState'

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()
  
  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogApi.getBlog(slug!).then(res => res.data),
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

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-4xl px-6 py-24">
          <EmptyState
            title="Blog post not found"
            description="The blog post you're looking for doesn't exist or has been removed."
            action={{
              text: 'Back to Blog',
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
          to="/blogs"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <time>{formatDate(blog.publishedAt)}</time>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            {blog.title}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {blog.excerpt}
          </p>

          {/* Share button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: blog.title,
                  text: blog.excerpt,
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
        {blog.coverUrl && (
          <img
            src={blog.coverUrl}
            alt={blog.title}
            className="w-full h-96 object-cover rounded-2xl mb-8"
          />
        )}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none text-gray-900 dark:text-gray-100"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <Link
              to="/blogs"
              className="btn-outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
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
