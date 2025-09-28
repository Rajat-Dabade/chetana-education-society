import { useQuery } from '@tanstack/react-query'
import { Calendar, Award } from 'lucide-react'
import { impactApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'
import StoryCard from '@/components/StoryCard'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import EmptyState from '@/components/EmptyState'
import MilestoneItem from '@/components/MilestoneItem'

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

  const currentYearStats = [
    { id: 1, name: 'Children Educated', value: '2,847', change: '+12%' },
    { id: 2, name: 'Communities Reached', value: '45', change: '+8%' },
    { id: 3, name: 'Teachers Trained', value: '156', change: '+25%' },
    { id: 4, name: 'Success Rate', value: '94%', change: '+3%' },
  ]

  return (
    <div className="min-h-screen">
      <Hero
        title="Our Impact"
        subtitle="Measuring the difference we make together"
        primaryCTA={{
          text: "Support Our Mission",
          href: "/donate"
        }}
        secondaryCTA={{
          text: "Read Success Stories",
          href: "#stories"
        }}
        backgroundImage="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&h=1080&fit=crop"
      />

      {/* Current Year Impact Stats */}
      <section className="py-16 sm:py-24 bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Real-Time Impact Dashboard
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Live updates from our ongoing programs and initiatives
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {currentYearStats.map((stat, index) => (
                <div 
                  key={stat.id} 
                  className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-navy-800 rounded-2xl animate-scale-in hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl sm:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {stat.name}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {stat.change} this year
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 bg-gray-50 dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="Success Stories"
            subtitle="Real stories of transformation and hope from our community"
          />
          
          {!storiesLoading && stories && stories.length > 0 ? (
            <div className="mt-16 grid gap-8 lg:grid-cols-2">
              {stories.slice(0, 4).map((story: any, index: number) => (
                <div 
                  key={story.id}
                  className="animate-slide-up hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <StoryCard story={story} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-16">
              <EmptyState
                title="No stories yet"
                description="Check back soon for inspiring stories from our community."
                icon={Calendar}
              />
            </div>
          )}
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="py-24 bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="Our Milestones"
            subtitle="Key achievements and moments that shaped our journey"
          />
          
          {!milestonesLoading && milestones && milestones.length > 0 ? (
            <div className="mt-16">
              <div className="relative max-w-6xl mx-auto">
                {/* Timeline line - central on desktop, left on mobile */}
                <div className="absolute left-6 lg:left-1/2 top-0 h-full w-1 bg-gradient-to-b from-primary-200 via-primary-400 to-primary-600 dark:from-primary-800 dark:via-primary-600 dark:to-primary-400 lg:transform lg:-translate-x-1/2"></div>
                
                <div className="space-y-12 lg:space-y-16">
                  {milestones.map((milestone: any, index: number) => (
                    <MilestoneItem 
                      key={milestone.id}
                      milestone={milestone}
                      index={index}
                    />
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
            {currentYearStats.map((stat, index) => (
              <div 
                key={stat.id} 
                className="text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-primary-100 mb-1">
                  {stat.name}
                </div>
                <div className="text-xs text-primary-200 font-medium">
                  {stat.change} this year
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
