import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Heart, Globe, Star, Award, Building } from 'lucide-react'
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
    name: 'Students Served Since 1991',
    value: '35,000+',
    icon: Users,
    description: 'First-generation learners from rural Vidarbha'
  },
  {
    id: 2,
    name: 'Institutions & Programmes',
    value: '7',
    icon: Globe,
    description: 'Schools, colleges, ITI, pharmacy, and hostel'
  },
  {
    id: 3,
    name: 'Years of Service',
    value: '52+',
    icon: Star,
    description: 'Uninterrupted educational service since 1973'
  },
  {
    id: 4,
    name: 'Villages & Districts',
    value: '30+',
    icon: Heart,
    description: 'Communities reached across rural Wardha'
  }
]

const institutions = [
  { icon: '🏫', name: 'Oxford Public School, Waigaon', tagline: 'Quality school education · Waigaon, Wardha' },
  { icon: '🏫', name: 'Oxford Public School, Deoli', tagline: 'Quality school education · Deoli, Wardha' },
  { icon: '🔧', name: 'Chetana ITI', tagline: 'NCVT-registered vocational training · Wardha' },
  { icon: '💊', name: 'Chetana Institute of Pharmacy', tagline: 'D.Pharm education · Wardha' },
  { icon: '📚', name: 'Chetana B.Ed College', tagline: 'Teacher training · Wardha' },
  { icon: '🎓', name: 'Chetana Junior College', tagline: 'Science stream · Waigaon' },
  { icon: '🏠', name: 'Ramdas Magaswargiy Boys Hostel', tagline: 'Free residential hostel for underprivileged boys · Since 1994' },
  { icon: '🏗️', name: 'Chetana Girls Residential Campus', tagline: 'Under construction · 130 girls · Support needed' },
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
        title="Transforming Lives Through Education Since 1973"
        subtitle="Over five decades of quality education in rural Wardha — schools, colleges, ITI skill training, pharmacy education, and a free hostel for underprivileged boys."
        primaryCTA={{ text: 'Partner With Us', href: '/donate' }}
        secondaryCTA={{ text: 'Our Story', href: '/about' }}
        backgroundImage="http://chetanaeducationsociety.com/uploads/1781946807420_i8i6pnu8zw.jpeg"
      />

      {/* Award Badge Strip */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-y border-amber-200 dark:border-amber-700 py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
            <Award className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              🏆 Sakal Idols of Maharashtra Award 2022 — Education Category
            </p>
            <span className="hidden sm:inline text-amber-400">·</span>
            <Link
              to="/blogs/ces-mou-dhammakaya-foundation-thailand-2026"
              className="text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              🤝 New: International MoU with Dhammakaya Foundation, Thailand (April 2026)
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-primary-700 dark:bg-primary-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className="flex flex-col items-center text-center animate-bounce-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <dd className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-1">
                  {stat.value}
                </dd>
                <dt className="text-sm sm:text-base font-semibold text-primary-100 mb-1">
                  {stat.name}
                </dt>
                <p className="text-xs text-primary-200 max-w-[160px]">
                  {stat.description}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Who We Are Section */}
      {whoWeAre && (
        <section className="py-20 bg-white dark:bg-navy-900">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-sm font-semibold leading-7 text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">
                Who We Are
              </h2>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                Wardha's Educational Backbone for Over Five Decades
              </p>
              <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 mb-8">
                {whoWeAre}
              </p>
              <Link
                to="/about"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold group"
              >
                Read our full story
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Institutions Grid */}
      <section className="py-20 bg-gray-50 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Institutions & Programmes"
            subtitle="Seven institutions under one trust — bringing education to every level"
          />
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {institutions.map((inst) => (
              <div
                key={inst.name}
                className="card p-5 flex flex-col gap-2 hover-lift"
              >
                <span className="text-2xl">{inst.icon}</span>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                  {inst.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {inst.tagline}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-24 bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950 relative overflow-hidden">
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
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
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

      {/* Partner / Donate CTA */}
      <section className="py-24 bg-primary-50 dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="How You Can Make a Difference"
            subtitle="Your support creates lasting change in the lives of children and communities across rural Wardha"
          />

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
            <div className="card p-8 text-center hover-lift">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 mb-6">
                <Building className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                CSR Partnership
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                We are CSR-1 registered and 80G certified. Your contribution is tax-deductible and aligned with Schedule VII of the Companies Act.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                CSR-1: CSR00095049 · PAN: AAATC3478Q
              </p>
              <Link to="/donate" className="btn-primary w-full">
                Partner With Us
              </Link>
            </div>

            <div className="card p-8 text-center hover-lift">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
                <Heart className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Direct Donation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                ₹50,000 furnishes one hostel room for 3 girls. ₹25,000 equips one ITI student with a full trade toolkit.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Your donation is eligible for 80G income tax deduction.
              </p>
              <Link to="/donate" className="btn-outline w-full">
                Donate Now
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
