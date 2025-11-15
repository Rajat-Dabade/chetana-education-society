import { useQuery } from '@tanstack/react-query'
import { Eye, Target, Lightbulb, Heart, UserCheck, Leaf } from 'lucide-react'
import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'
import { settingsApi } from '@/lib/api'

const principles = [
  {
    name: 'Community-Centered',
    description: 'We work with communities, not for them. Every program is designed with input from the people we serve.',
    icon: UserCheck,
  },
  {
    name: 'Sustainable Impact',
    description: 'We focus on long-term solutions that communities can maintain and expand independently.',
    icon: Leaf,
  },
  {
    name: 'Compassionate Action',
    description: 'We approach every situation with empathy, respect, and understanding of local contexts.',
    icon: Heart,
  },
]

export default function About() {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.getSettings().then(res => res.data)
  })

  const vision = settings?.vision || 'To create a knowledgeable and empowered society where every child, regardless of their background, has access to quality education that transforms their life and strengthens their community.'
  const missionArray = settings?.mission ? JSON.parse(settings.mission) : ['Ensuring education of deprived children by connecting passionate volunteers, leveraging technology, and working with communities to provide quality learning opportunities that break cycles of poverty.']
  const founderStory = settings?.founderStory || 'Our organization was founded with a vision to empower communities through quality education and sustainable development.'

  const values = [
    {
      name: 'Vision',
      description: vision,
      icon: Eye,
    },
    {
      name: 'Mission',
      description: missionArray.join(' '),
      icon: Target,
      missionPoints: missionArray,
    },
    {
      name: 'Values',
      description: 'We believe in selfless service, passionate commitment to education, unwavering integrity, and relentless execution of programs that create measurable impact in children\'s lives.',
      icon: Lightbulb,
    },
  ]
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <Hero
        title="About Chetana Education Society"
        subtitle="Learn about our mission, values, and the principles that guide our work in empowering communities through quality education."
        backgroundImage="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&h=1080&fit=crop"
      />

      {/* Mission, Vision, Aim */}
      <section className="py-24 bg-gray-50 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="Our Foundation"
            subtitle="The core beliefs and goals that drive everything we do."
          />

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-8 lg:max-w-none lg:grid-cols-3">
              {values.map((value, index) => (
                <div 
                  key={value.name} 
                  className="card p-8 relative overflow-hidden animate-scale-in hover-lift"
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  
                  {/* Colored indicator dot */}
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {value.name}
                    </h3>
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                      value.name === 'Vision' ? 'bg-blue-500' :
                      value.name === 'Mission' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`}></div>
                  </div>
                  
                  {value.name === 'Mission' && value.missionPoints ? (
                    <ul className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 space-y-3">
                      {value.missionPoints.map((point: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                      {value.description}
                    </p>
                  )}
                  
                  {/* Key aspects as colored oval badges - matching your reference */}
                  <div className="space-y-2">
                    {value.name === 'Vision' && (
                      <>
                        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                          Knowledgeable Society
                        </div>
                        <br />
                        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                          Quality Education
                        </div>
                      </>
                    )}
                    
                    {value.name === 'Mission' && (
                      <>
                        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          Reaching the Unreached
                        </div>
                        <br />
                        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                          Transforming Lives
                        </div>
                      </>
                    )}
                    
                    {value.name === 'Values' && (
                      <>
                        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                          <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                          Integrity
                        </div>
                        <br />
                        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                          <span className="w-2 h-2 rounded-full bg-violet-500 mr-2"></span>
                          Measurable Impact
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      {founderStory && (
        <section className="py-24 bg-white dark:bg-navy-900">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start">
              <div className="lg:pr-4 lg:pt-4">
                <div className="lg:max-w-lg">
                  <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400">
                    Our Story
                  </h2>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    The Journey of Our Founder
                  </p>
                  <div className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {founderStory}
                  </div>
                </div>
              </div>
            <div className="sm:px-6 lg:px-0">
              <div className="relative isolate overflow-hidden bg-primary-600 px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pl-16 sm:pr-0 sm:pt-16 lg:mx-0 lg:max-w-none">
                <div
                  className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-30deg] bg-primary-100 opacity-20 ring-1 ring-inset ring-white"
                  aria-hidden="true"
                />
                <div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
                  <img
                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=600&fit=crop"
                    alt="Team meeting discussing community programs"
                    width={2432}
                    height={1442}
                    className="w-full max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                  />
                </div>
                <div
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 sm:rounded-3xl"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Our Principles */}
      <section className="py-24 bg-gray-50 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="Our Principles"
            subtitle="The values that guide our approach to community development and social change."
          />

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {principles.map((principle) => (
                <div key={principle.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <div className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg ${
                      principle.name === 'Community-Centered' ? 'bg-blue-100 dark:bg-blue-900/20' :
                      principle.name === 'Sustainable Impact' ? 'bg-green-100 dark:bg-green-900/20' :
                      'bg-purple-100 dark:bg-purple-900/20'
                    }`}>
                      <principle.icon className={`h-6 w-6 ${
                        principle.name === 'Community-Centered' ? 'text-blue-600 dark:text-blue-400' :
                        principle.name === 'Sustainable Impact' ? 'text-green-600 dark:text-green-400' :
                        'text-purple-600 dark:text-purple-400'
                      }`} aria-hidden="true" />
                    </div>
                    {principle.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                    {principle.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Legal Credentials & Trust */}
      <section className="py-24 bg-white dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="Legal Credentials & Transparency"
            subtitle="We maintain the highest standards of accountability and transparency in all our operations"
          />

          <div className="mx-auto mt-16 max-w-4xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center p-6 bg-gray-50 dark:bg-navy-800 rounded-xl">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  12A & 80G
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Registered under Income Tax Department for tax-exempt donations
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 dark:bg-navy-800 rounded-xl">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  FCRA
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Licensed to receive foreign contributions under Government of India
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 dark:bg-navy-800 rounded-xl">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  Audited
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Annual financial audits ensure transparent fund utilization
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Chetana Education Society is registered under the Societies Registration Act and maintains 
                all required legal compliance. Our financial records are audited annually by certified 
                public accountants to ensure transparency and accountability to our donors and beneficiaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-24 bg-gray-50 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="Our Journey in Numbers"
            subtitle="Measurable impact since our founding in 2018"
          />

          <div className="mx-auto mt-16 max-w-2xl lg:max-w-none">
            <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Years of Service
                </dt>
                <dd className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  6+
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Children Educated
                </dt>
                <dd className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  12,500+
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Active Volunteers
                </dt>
                <dd className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  200+
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Partner Schools
                </dt>
                <dd className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  85
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  )
}
