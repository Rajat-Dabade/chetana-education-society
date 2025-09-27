import { useQuery } from '@tanstack/react-query'
import { Calendar, Award } from 'lucide-react'
import { impactApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'
import StoryCard from '@/components/StoryCard'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import EmptyState from '@/components/EmptyState'

export default function Impact() {
  const { data: stories, isLoading: storiesLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: () => impactApi.getStories().then(res => res.data)
  })

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => impactApi.getTestimonials().then(res => res.data)
  })

  const { data: milestones, isLoading: milestonesLoading } = useQuery({
    queryKey: ['milestones'],
    queryFn: () => impactApi.getMilestones().then(res => res.data)
  })

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <Hero
        title="Our Impact"
        subtitle="Discover the real stories of transformation, the milestones we've achieved, and the voices of those whose lives have been touched by our work."
        backgroundImage="https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1920&h=1080&fit=crop"
      />

      {/* Success Stories */}
      <section className="py-16 sm:py-24 bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Success Stories"
            subtitle="Real stories of transformation and hope from the communities we serve"
          />

          {storiesLoading ? (
            <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="card p-6">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : stories && stories.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 sm:gap-8 sm:mt-16">
              {stories.map((story: any) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <div className="mt-16">
              <EmptyState
                title="No success stories yet"
                description="Check back soon for inspiring stories of transformation and hope."
              />
            </div>
          )}
        </div>
      </section>

      {/* Milestones */}
      <section className="py-24 bg-gray-50 dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="Our Milestones"
            subtitle="Key achievements and moments that mark our journey of creating positive change"
          />

          {milestonesLoading ? (
            <div className="mt-16 space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-start space-x-4">
                  <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : milestones && milestones.length > 0 ? (
            <div className="mt-16">
              <div className="relative max-w-6xl mx-auto">
                {/* Timeline line - central on desktop, left on mobile */}
                <div className="absolute left-6 lg:left-1/2 top-0 h-full w-1 bg-gradient-to-b from-primary-200 via-primary-400 to-primary-600 dark:from-primary-800 dark:via-primary-600 dark:to-primary-400 lg:transform lg:-translate-x-1/2"></div>
                
                <div className="space-y-12 lg:space-y-16">
                  {milestones.map((milestone: any, index: number) => (
                    <div 
                      key={milestone.id} 
                      className="relative flex items-start lg:items-center animate-bounce-in"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {/* Mobile Layout: Icon on left, content on right */}
                      <div className="flex lg:hidden items-start w-full">
                        {/* Mobile Timeline Icon - smaller size */}
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ring-2 ring-white dark:ring-navy-900 hover-scale flex-shrink-0 ${
                          index % 4 === 0 ? 'bg-blue-100 dark:bg-blue-900/20' :
                          index % 4 === 1 ? 'bg-green-100 dark:bg-green-900/20' :
                          index % 4 === 2 ? 'bg-purple-100 dark:bg-purple-900/20' :
                          'bg-orange-100 dark:bg-orange-900/20'
                        }`}>
                          <Award className={`h-6 w-6 ${
                            index % 4 === 0 ? 'text-blue-600 dark:text-blue-400' :
                            index % 4 === 1 ? 'text-green-600 dark:text-green-400' :
                            index % 4 === 2 ? 'text-purple-600 dark:text-purple-400' :
                            'text-orange-600 dark:text-orange-400'
                          }`} />
                        </div>
                        
                        {/* Mobile Content - larger cards */}
                        <div className="ml-6 flex-1">
                          <div className="card p-6">
                            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                              <Calendar className="h-4 w-4" />
                              <time>{formatDate(milestone.achievedOn)}</time>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                              {milestone.title}
                            </h3>
                            {milestone.description && (
                              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                                {milestone.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Desktop Layout: Alternating sides with central icons */}
                      <div className="hidden lg:flex lg:items-center lg:w-full lg:relative">
                        {/* Content Card - alternating sides */}
                        <div className={`w-5/12 ${
                          index % 2 === 0 
                            ? 'pr-8 lg:ml-0' 
                            : 'pl-8 lg:ml-auto'
                        }`}>
                          <div className="card p-6">
                            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                              <Calendar className="h-4 w-4" />
                              <time>{formatDate(milestone.achievedOn)}</time>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                              {milestone.title}
                            </h3>
                            {milestone.description && (
                              <p className="text-gray-600 dark:text-gray-300">
                                {milestone.description}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Desktop Central Timeline Icon */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                          <div className={`flex h-16 w-16 items-center justify-center rounded-full ring-4 ring-white dark:ring-navy-900 hover-scale ${
                            index % 4 === 0 ? 'bg-blue-100 dark:bg-blue-900/20' :
                            index % 4 === 1 ? 'bg-green-100 dark:bg-green-900/20' :
                            index % 4 === 2 ? 'bg-purple-100 dark:bg-purple-900/20' :
                            'bg-orange-100 dark:bg-orange-900/20'
                          }`}>
                            <Award className={`h-8 w-8 ${
                              index % 4 === 0 ? 'text-blue-600 dark:text-blue-400' :
                              index % 4 === 1 ? 'text-green-600 dark:text-green-400' :
                              index % 4 === 2 ? 'text-purple-600 dark:text-purple-400' :
                              'text-orange-600 dark:text-orange-400'
                            }`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-16">
              <EmptyState
                title="No milestones yet"
                description="Check back soon for updates on our achievements and progress."
                icon={Award}
              />
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      {!testimonialsLoading && testimonials && testimonials.length > 0 && (
        <section className="py-24 bg-white dark:bg-navy-950">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader
              title="Voices from Our Community"
              subtitle="Hear directly from the people whose lives have been touched by our programs"
            />
            <div className="mt-16">
              <TestimonialCarousel testimonials={testimonials} />
            </div>
          </div>
        </section>
      )}

      {/* Current Year Impact */}
      <section className="py-24 bg-primary-600 dark:bg-primary-700">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Impact in Academic Year 2024-25
            </h2>
            <p className="mt-4 text-lg leading-8 text-primary-100">
              Real-time impact across our education programs and community initiatives
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">2,850</div>
              <div className="mt-2 text-primary-100">Students Currently Supported</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">85</div>
              <div className="mt-2 text-primary-100">Partner Schools</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">15</div>
              <div className="mt-2 text-primary-100">Districts Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">94%</div>
              <div className="mt-2 text-primary-100">Retention Rate</div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-primary-200 max-w-3xl mx-auto">
              Since our inception in 2018, we have supported over 12,500 children across 15 communities, 
              with a 94% success rate in completing their education and transitioning to higher studies or vocational training.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
