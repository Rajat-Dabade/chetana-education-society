import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Heart, Globe, Star } from 'lucide-react'
import { impactApi, blogApi, settingsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import Hero from '@/components/Hero'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import StoryCard from '@/components/StoryCard'
import SectionHeader from '@/components/SectionHeader'
import EmptyState from '@/components/EmptyState'

const stats = [
  {
    id: 1,
    name: 'Children Educated',
    value: '12,500+',
    icon: Users,
    description: 'Students supported since our inception in 2018'
  },
  {
    id: 2,
    name: 'Schools Partnered',
    value: '85',
    icon: Globe,
    description: 'Educational institutions in our network'
  },
  {
    id: 3,
    name: 'Communities Served',
    value: '15',
    icon: Heart,
    description: 'Villages and districts where we operate'
  },
  {
    id: 4,
    name: 'Success Rate',
    value: '94%',
    icon: Star,
    description: 'Students who complete their education successfully'
  }
]

export default function Home() {
  const { data: stories } = useQuery({
    queryKey: ['stories'],
    queryFn: () => impactApi.getStories().then(res => res.data)
  })

  const { data: testimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => impactApi.getTestimonials().then(res => res.data)
  })

  const { data: blogs } = useQuery({
    queryKey: ['blogs', { limit: 3 }],
    queryFn: () => blogApi.getBlogs({ limit: 3 }).then(res => res.data)
  })

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.getSettings().then(res => res.data)
  })

  const featuredStory = stories?.[0]
  const featuredBlog = blogs?.items?.[0]
  const whoWeAre = settings?.whoWeAre

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <Hero
        title="Empowering Communities Through Education"
        subtitle="Our mission: Every child from disadvantaged communities completes quality education and becomes an empowered member of society. Together, we're building a future where education transforms lives."
        backgroundImage="https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1920&h=1080&fit=crop"
      />

      {/* Mission Statement */}
      <section className="py-16 bg-primary-600 dark:bg-primary-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Our Mission
            </h2>
            <blockquote className="text-lg sm:text-xl text-primary-100 max-w-4xl mx-auto leading-relaxed">
              "Every child from disadvantaged communities deserves access to quality education that empowers them to break cycles of poverty, develop critical thinking skills, and become confident leaders in their communities."
            </blockquote>
            <p className="mt-6 text-primary-200 max-w-2xl mx-auto">
              We believe education is not just about literacy—it's about creating opportunities, building confidence, and fostering lifelong learning.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      {whoWeAre && (
        <section className="py-24 bg-white dark:bg-navy-900">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
              <div className="lg:pr-8 lg:pt-4">
                <div className="lg:max-w-lg">
                  <h2 className="text-2xl sm:text-3xl font-semibold leading-7 text-primary-600 dark:text-primary-400 text-center">
                    Who We Are
                  </h2>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    Building Stronger Communities
                  </p>
                  <div className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {whoWeAre}
                  </div>
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop"
                alt="Community volunteers working together"
                className="w-full max-w-full rounded-xl shadow-xl ring-1 ring-gray-400/10 object-cover"
                width={800}
                height={600}
              />
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
                Our Impact in Numbers
              </h2>
              <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-300 sm:mt-4 sm:text-lg sm:leading-8">
                Every number represents real lives transformed and communities strengthened.
              </p>
            </div>
            <dl className="mt-12 grid grid-cols-1 gap-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:mt-20">
              {stats.map((stat, index) => (
                <div 
                  key={stat.id} 
                  className="flex flex-col items-center text-center animate-bounce-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-6 hover-scale ${
                    stat.id === 1 ? 'bg-green-100 dark:bg-green-900/20' :
                    stat.id === 2 ? 'bg-blue-100 dark:bg-blue-900/20' :
                    stat.id === 3 ? 'bg-purple-100 dark:bg-purple-900/20' :
                    'bg-orange-100 dark:bg-orange-900/20'
                  }`}>
                    <stat.icon className={`h-8 w-8 ${
                      stat.id === 1 ? 'text-green-600 dark:text-green-400' :
                      stat.id === 2 ? 'text-blue-600 dark:text-blue-400' :
                      stat.id === 3 ? 'text-purple-600 dark:text-purple-400' :
                      'text-orange-600 dark:text-orange-400'
                    }`} aria-hidden="true" />
                  </div>
                  <dt className="text-base leading-7 text-gray-600 dark:text-gray-300">
                    {stat.name}
                  </dt>
                  <dd className="order-first text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                    {stat.value}
                  </dd>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                    {stat.description}
                  </p>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-24 bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="h-1 w-16 bg-primary-600 dark:bg-primary-400 rounded-full"></div>
              <Heart className="mx-4 h-6 w-6 text-primary-600 dark:text-primary-400" />
              <div className="h-1 w-16 bg-primary-600 dark:bg-primary-400 rounded-full"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Stories of Impact
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real stories from the communities we serve and the lives we've touched together.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {/* Featured Story */}
            <div className="lg:pr-4">
              <div className="flex items-center mb-6">
                <div className="h-10 w-1 bg-primary-600 dark:bg-primary-400 rounded-full mr-3"></div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Featured Success Story
                </h3>
              </div>
              {featuredStory ? (
                <div className="transform hover:scale-[1.02] transition-transform duration-300">
                  <StoryCard story={featuredStory} featured />
                </div>
              ) : (
                <EmptyState
                  title="No stories yet"
                  description="Check back soon for inspiring success stories."
                />
              )}
            </div>

            {/* Featured Blog */}
            <div className="lg:pl-4">
              <div className="flex items-center mb-6">
                <div className="h-10 w-1 bg-primary-600 dark:bg-primary-400 rounded-full mr-3"></div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Latest from Our Blog
                </h3>
              </div>
              {featuredBlog ? (
                <article className="card p-6 transform hover:scale-[1.02] transition-transform duration-300 border-2 border-primary-100 dark:border-primary-900/50 hover:border-primary-300 dark:hover:border-primary-700 shadow-lg hover:shadow-xl">
                  {featuredBlog.coverUrl && (
                    <img
                      src={featuredBlog.coverUrl}
                      alt={featuredBlog.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>{featuredBlog.author}</span>
                    <span className="mx-2">•</span>
                    <time>{formatDate(featuredBlog.publishedAt)}</time>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {featuredBlog.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {featuredBlog.excerpt}
                  </p>
                  <Link
                    to={`/blogs/${featuredBlog.slug}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium group"
                  >
                    Read more
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </article>
              ) : (
                <EmptyState
                  title="No blog posts yet"
                  description="Check back soon for insights and updates."
                />
              )}
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              to="/impact"
              className="btn-primary group text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              View All Impact Stories
              <ArrowRight className="ml-2 h-5 w-5 inline group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* How You Can Help */}
      <section className="py-24 bg-primary-50 dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="How You Can Make a Difference"
            subtitle="Your support creates lasting change in the lives of children and communities"
          />
          
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
            <div className="card p-8 text-center hover-lift">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
                <Heart className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Sponsor a Child
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                For just ₹5,000 per year, you can provide a child with education, learning materials, and mentorship support.
              </p>
              <Link to="/donate" className="btn-primary w-full">
                Sponsor Now
              </Link>
            </div>
            
            
            <div className="card p-8 text-center hover-lift">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20 mb-6">
                <Globe className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Partner with Us
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Corporate partnerships help us scale our impact and reach more communities in need.
              </p>
              <Link to="/contact" className="btn-outline w-full">
                Partner
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="Voices from Our Community"
            subtitle="Hear from the students, families, and volunteers whose lives have been transformed"
          />
          <div className="mt-16">
            {testimonials && testimonials.length > 0 ? (
              <TestimonialCarousel testimonials={testimonials} />
            ) : (
              <EmptyState
                title="No testimonials yet"
                description="Check back soon to hear from our community members."
              />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
