import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Calendar, Tag, ArrowRight, Search } from 'lucide-react'
import { newsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import Hero from '@/components/Hero'
import EmptyState from '@/components/EmptyState'

export default function News() {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'NEWS' | 'EVENT'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['news', { type: activeFilter === 'ALL' ? undefined : activeFilter, q: searchQuery, page: currentPage }],
    queryFn: () => newsApi.getNews({
      type: activeFilter === 'ALL' ? undefined : activeFilter,
      q: searchQuery || undefined,
      page: currentPage,
      limit: 12
    }).then(res => res.data)
  })

  const filters = [
    { key: 'ALL', label: 'All' },
    { key: 'NEWS', label: 'News' },
    { key: 'EVENT', label: 'Events' },
  ] as const

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <Hero
        title="News & Events"
        subtitle="Stay updated with our latest news, upcoming events, and important announcements from our community."
        backgroundImage="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&h=1080&fit=crop"
      />

      {/* Filters and Search */}
      <section className="py-8 sm:py-12 bg-gray-50 dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Filter tabs */}
            <div className="flex space-x-1 bg-white dark:bg-navy-800 p-1 rounded-lg">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => {
                    setActiveFilter(filter.key)
                    setCurrentPage(1)
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeFilter === filter.key
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search news and events..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-navy-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 sm:py-24 bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="card p-6">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : data?.items && data.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
                {data.items.map((item, index) => (
                  <article 
                    key={item.id} 
                    className="card-hover p-6 animate-slide-up hover-lift"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {item.heroUrl && (
                      <img
                        src={item.heroUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <time>{formatDate(item.date)}</time>
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
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {item.title}
                    </h3>
                    
                    <div 
                      className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: item.body.substring(0, 150) + '...' }}
                    />
                    
                    <Link
                      to={`/news/${item.slug}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium group"
                    >
                      Read more
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {data.pagination.pages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === page
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(data.pagination.pages, prev + 1))}
                      disabled={currentPage === data.pagination.pages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No news or events found"
              description={searchQuery ? `No results found for "${searchQuery}"` : "Check back soon for updates and upcoming events."}
            />
          )}
        </div>
      </section>
    </div>
  )
}
