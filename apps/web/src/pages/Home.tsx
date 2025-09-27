import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Heart, Globe, Star } from 'lucide-react'
import { impactApi, blogApi } from '@/lib/api'
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

  const featuredStory = stories?.[0]
  const featuredBlog = blogs?.items?.[0]

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <Hero
        title="Empowering Communities Through Education"
        subtitle="Our mission: Every child from disadvantaged communities completes quality education and becomes an empowered member of society. Together, we're building a future where education transforms lives."
        primaryCTA={{
          text: 'Sponsor a Child - ₹5,000/year',
          href: '/donate'
        }}
        secondaryCTA={{
          text: 'Join as Volunteer',
          href: '/contact'
        }}
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

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white dark:bg-navy-900">
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

      {/* About Section */}
      <section className="py-24 bg-gray-50 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400">
                  About Our Mission
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  Building Stronger Communities
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  Hope for Tomorrow was founded with a simple yet powerful belief: every person deserves 
                  access to opportunities that can transform their life and strengthen their community.
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 dark:text-gray-300 lg:max-w-none">
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900 dark:text-white">
                      <Star className="absolute left-1 top-1 h-5 w-5 text-primary-600" aria-hidden="true" />
                      Education First.
                    </dt>
                    <dd className="inline">
                      We believe education is the foundation for breaking cycles of poverty and 
                      building sustainable futures.
                    </dd>
                  </div>
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900 dark:text-white">
                      <Star className="absolute left-1 top-1 h-5 w-5 text-primary-600" aria-hidden="true" />
                      Community-Driven.
                    </dt>
                    <dd className="inline">
                      Our programs are designed with and led by the communities we serve, 
                      ensuring sustainable impact.
                    </dd>
                  </div>
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900 dark:text-white">
                      <Star className="absolute left-1 top-1 h-5 w-5 text-primary-600" aria-hidden="true" />
                      Transparent Impact.
                    </dt>
                    <dd className="inline">
                      We measure and share our impact openly, ensuring every donation creates 
                      meaningful change.
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop"
              alt="Community volunteers working together"
              className="w-full max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
              width={2432}
              height={1442}
            />
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-24 bg-white dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="Stories of Impact"
            subtitle="Real stories from the communities we serve and the lives we've touched together."
          />

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {/* Featured Story */}
            <div className="lg:pr-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Featured Success Story
              </h3>
              {featuredStory ? (
                <StoryCard story={featuredStory} featured />
              ) : (
                <EmptyState
                  title="No stories yet"
                  description="Check back soon for inspiring success stories."
                />
              )}
            </div>

            {/* Featured Blog */}
            <div className="lg:pl-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Latest from Our Blog
              </h3>
              {featuredBlog ? (
                <article className="card p-6">
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
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                  >
                    Read more
                    <ArrowRight className="ml-1 h-4 w-4" />
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

          <div className="mt-10 flex justify-center">
            <Link
              to="/impact"
              className="btn-outline"
            >
              View All Impact Stories
              <ArrowRight className="ml-2 h-4 w-4" />
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
      {testimonials && testimonials.length > 0 && (
        <section className="py-24 bg-gray-50 dark:bg-navy-950">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader
              title="Voices from Our Community"
              subtitle="Hear from the students, families, and volunteers whose lives have been transformed"
            />
            <div className="mt-16">
              <TestimonialCarousel testimonials={testimonials} />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
