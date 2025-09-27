import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Story {
  id: string
  title: string
  slug: string
  excerpt: string
  coverUrl?: string
  createdAt: string
}

interface StoryCardProps {
  story: Story
  featured?: boolean
}

export default function StoryCard({ story, featured = false }: StoryCardProps) {
  return (
    <article className={`card-hover p-6 ${featured ? 'lg:p-8' : ''} animate-slide-up hover-lift`}>
      {story.coverUrl && (
        <img
          src={story.coverUrl}
          alt={story.title}
          className={`w-full object-cover rounded-lg mb-4 ${
            featured ? 'h-64' : 'h-48'
          }`}
        />
      )}
      
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
        <time>{formatDate(story.createdAt)}</time>
      </div>
      
      <h3 className={`font-semibold text-gray-900 dark:text-white mb-3 ${
        featured ? 'text-2xl' : 'text-xl'
      }`}>
        {story.title}
      </h3>
      
      <p className={`text-gray-600 dark:text-gray-300 mb-4 ${
        featured ? 'text-lg leading-relaxed' : ''
      }`}>
        {story.excerpt}
      </p>
      
      <Link
        to={`/impact/stories/${story.slug}`}
        className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium group"
      >
        Read the full story
        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </article>
  )
}
