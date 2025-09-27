import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-navy-950 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-primary-600 dark:text-primary-400">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-300">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="btn-primary"
          >
            <Home className="h-4 w-4 mr-2" />
            Go back home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="text-sm font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
          >
            <ArrowLeft className="h-4 w-4 mr-1 inline" />
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}
