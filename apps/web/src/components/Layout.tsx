import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import BackToTop from './BackToTop'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1 pt-16 sm:pt-20">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
