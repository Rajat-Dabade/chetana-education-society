import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight, Search } from 'lucide-react'
import { blogApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import Hero from '@/components/Hero'
import EmptyState from '@/components/EmptyState'

export default function Blogs() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', { q: searchQuery, page: currentPage }],
    queryFn: () => blogApi.getBlogs({
      q: searchQuery || undefined,
      page: currentPage,
      limit: 12
    }).then(res => res.data)
  })

  const featuredBlog = data?.items?.[0]
  const regularBlogs = data?.items?.slice(1) || []

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <Hero
        title="Our Blog"
        subtitle="Insights, stories, and perspectives on community development, social change, and the work we do together."
        backgroundImage="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1920&h=1080&fit=crop"
      />

      {/* Search */}
      <section className="py-8 sm:py-12 bg-gray-50 dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-navy-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 sm:py-24 bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-12">
              {/* Featured blog skeleton */}
              <div className="animate-pulse">
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              
              {/* Regular blogs skeleton */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
            </div>
          ) : data?.items && data.items.length > 0 ? (
            <div className="space-y-16">
              {/* Featured Blog */}
              {featuredBlog && !searchQuery && (
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                  <div>
                    {featuredBlog.coverUrl && (
                      <img
                        src={featuredBlog.coverUrl}
                        alt={featuredBlog.title}
                        className="w-full h-96 object-cover rounded-2xl"
                      />
                    )}
                  </div>
                  <div className="mt-8 lg:mt-0">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{featuredBlog.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <time>{formatDate(featuredBlog.publishedAt)}</time>
                      </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      {featuredBlog.title}
                    </h2>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                      {featuredBlog.excerpt}
                    </p>
                    
                    <Link
                      to={`/blogs/${featuredBlog.slug}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-lg group"
                    >
                      Read the full post
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Regular Blog Grid */}
              {regularBlogs.length > 0 && (
                <div>
                  {featuredBlog && !searchQuery && (
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                      More Posts
                    </h3>
                  )}
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
                    {(searchQuery ? data.items : regularBlogs).map((blog, index) => (
                      <article 
                        key={blog.id} 
                        className="card-hover p-6 animate-slide-up hover-lift"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {blog.coverUrl && (
                          <img
                            src={blog.coverUrl}
                            alt={blog.title}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{blog.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <time>{formatDate(blog.publishedAt)}</time>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          {blog.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {blog.excerpt}
                        </p>
                        
                        <Link
                          to={`/blogs/${blog.slug}`}
                          className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium group"
                        >
                          Read more
                          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Pagination */}
              {data.pagination.pages > 1 && (
                <div className="flex justify-center">
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
            </div>
          ) : (
            <EmptyState
              title="No blog posts found"
              description={searchQuery ? `No results found for "${searchQuery}"` : "Check back soon for insights and stories from our community."}
            />
          )}
        </div>
      </section>
    </div>
  )
}
