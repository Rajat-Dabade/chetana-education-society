import { useQuery } from '@tanstack/react-query'
import { Users, FileText, Calendar, BookOpen, TrendingUp, Activity } from 'lucide-react'
import { impactApi, newsApi, blogApi } from '@/lib/api'

const StatCard = ({ title, value, icon: Icon, trend, colorIndex }: any) => (
  <div className="card p-6 animate-scale-in hover-lift">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className={`flex items-center justify-center h-12 w-12 rounded-md ${
          colorIndex === 0 ? 'bg-blue-100 dark:bg-blue-900/20' :
          colorIndex === 1 ? 'bg-green-100 dark:bg-green-900/20' :
          colorIndex === 2 ? 'bg-purple-100 dark:bg-purple-900/20' :
          'bg-orange-100 dark:bg-orange-900/20'
        }`}>
          <Icon className={`h-6 w-6 ${
            colorIndex === 0 ? 'text-blue-600 dark:text-blue-400' :
            colorIndex === 1 ? 'text-green-600 dark:text-green-400' :
            colorIndex === 2 ? 'text-purple-600 dark:text-purple-400' :
            'text-orange-600 dark:text-orange-400'
          }`} />
        </div>
      </div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {title}
          </dt>
          <dd className="flex items-baseline">
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </div>
            {trend && (
              <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                {trend}
              </div>
            )}
          </dd>
        </dl>
      </div>
    </div>
  </div>
)

export default function AdminDashboard() {
  const { data: testimonials } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => impactApi.getTestimonials().then(res => res.data)
  })

  const { data: stories } = useQuery({
    queryKey: ['admin-stories'],
    queryFn: () => impactApi.getStories().then(res => res.data)
  })

  // Removed milestones query since it's not used in dashboard

  const { data: news } = useQuery({
    queryKey: ['admin-news'],
    queryFn: () => newsApi.getNews({ limit: 50 }).then(res => res.data)
  })

  const { data: blogs } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: () => blogApi.getBlogs({ limit: 50 }).then(res => res.data)
  })

  const stats = [
    {
      title: 'Total Testimonials',
      value: testimonials?.length || 0,
      icon: Users,
      trend: '+12%'
    },
    {
      title: 'Success Stories',
      value: stories?.length || 0,
      icon: FileText,
      trend: '+8%'
    },
    {
      title: 'News & Events',
      value: news?.items?.length || 0,
      icon: Calendar,
      trend: '+15%'
    },
    {
      title: 'Blog Posts',
      value: blogs?.items?.length || 0,
      icon: BookOpen,
      trend: '+5%'
    }
  ]

  const recentNews = news?.items?.slice(0, 5) || []
  const recentBlogs = blogs?.items?.slice(0, 5) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your NGO website.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="animate-scale-in hover-lift"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <StatCard {...stat} colorIndex={index} />
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-6">
        {/* Recent News */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent News & Events
            </h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          
          {recentNews.length > 0 ? (
            <div className="space-y-3">
              {recentNews.map((item) => (
                <div key={item.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    item.type === 'NEWS' ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No recent news or events
            </p>
          )}
        </div>

        {/* Recent Blogs */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Blog Posts
            </h3>
            <BookOpen className="h-5 w-5 text-gray-400" />
          </div>
          
          {recentBlogs.length > 0 ? (
            <div className="space-y-3">
              {recentBlogs.map((blog) => (
                <div key={blog.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {blog.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      by {blog.author} • {new Date(blog.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No recent blog posts
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          <button className="btn-primary">
            Add Testimonial
          </button>
          <button className="btn-outline">
            Create Story
          </button>
          <button className="btn-outline">
            New Blog Post
          </button>
          <button className="btn-outline">
            Add News/Event
          </button>
        </div>
      </div>
    </div>
  )
}
