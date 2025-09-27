import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import ScrollToTop from '@/components/ScrollToTop'

// Public pages
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Impact from '@/pages/Impact'
import News from '@/pages/News'
import NewsDetail from '@/pages/NewsDetail'
import Blogs from '@/pages/Blogs'
import BlogDetail from '@/pages/BlogDetail'
import Contact from '@/pages/Contact'
import Donate from '@/pages/Donate'
import Gallery from '@/pages/Gallery'
import StoryDetail from '@/pages/StoryDetail'
import NotFound from '@/pages/NotFound'

// Admin pages
import AdminLayout from '@/components/admin/AdminLayout'
import AdminLogin from '@/pages/admin/Login'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminTestimonials from '@/pages/admin/Testimonials'
import AdminStories from '@/pages/admin/Stories'
import AdminMilestones from '@/pages/admin/Milestones'
import AdminNews from '@/pages/admin/News'
import AdminBlogs from '@/pages/admin/Blogs'
import AdminMedia from '@/pages/admin/Media'
import AdminGallery from '@/pages/admin/Gallery'
import AdminSettings from '@/pages/admin/Settings'

function App() {
  const { theme } = useTheme()

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <Router>
      <ScrollToTop />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="impact" element={<Impact />} />
          <Route path="impact/stories/:slug" element={<StoryDetail />} />
          <Route path="news" element={<News />} />
          <Route path="news/:slug" element={<NewsDetail />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/:slug" element={<BlogDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="donate" element={<Donate />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="impact/testimonials" element={<AdminTestimonials />} />
          <Route path="impact/stories" element={<AdminStories />} />
          <Route path="impact/milestones" element={<AdminMilestones />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
