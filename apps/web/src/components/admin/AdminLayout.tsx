import { useEffect } from 'react'
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BookOpen, 
  Image, 
  Settings, 
  LogOut,
  Heart,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import BackToTop from '@/components/BackToTop'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { 
    name: 'Impact', 
    icon: Users,
    children: [
      { name: 'Testimonials', href: '/admin/impact/testimonials' },
      { name: 'Success Stories', href: '/admin/impact/stories' },
      { name: 'Milestones', href: '/admin/impact/milestones' },
    ]
  },
  { name: 'News & Events', href: '/admin/news', icon: Calendar },
  { name: 'Blog Posts', href: '/admin/blogs', icon: BookOpen },
  { name: 'Photo Gallery', href: '/admin/gallery', icon: Image },
  { name: 'Media Library', href: '/admin/media', icon: Image },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 sm:w-64 bg-gray-50 dark:bg-navy-900 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 border-r border-gray-200 dark:border-gray-700",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Admin Panel
            </span>
          </Link>
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <nav className="mt-6 px-2 sm:px-3">
          <div className="space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div>
                    <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </div>
                    <div className="ml-6 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className={cn(
                            "block px-3 py-2 text-sm rounded-md transition-all duration-300 hover:translate-x-2 hover:scale-105",
                            isActive(child.href)
                              ? "bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 hover:scale-105 hover:translate-x-1",
                      isActive(item.href)
                        ? "bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Mobile overlay when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white dark:bg-navy-900 shadow-sm border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-target"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6 text-gray-500" />
            </button>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                View Website
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-3 sm:p-4 lg:p-6 bg-gray-50 dark:bg-navy-950 min-h-screen">
          <Outlet />
        </main>
      </div>
      <BackToTop />
    </div>
  )
}
