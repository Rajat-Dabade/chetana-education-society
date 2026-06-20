import { useQuery } from '@tanstack/react-query'
import { Eye, Target } from 'lucide-react'
import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'
import { settingsApi } from '@/lib/api'

const leadership = [
  { name: 'Shri Dinesh Baliram Sawai', title: 'Founder President' },
  { name: 'Dr. Chetana Dinesh Sawai', title: 'Secretary & Director' },
  { name: 'Shri Avinash D. Sawai', title: 'Founder Secretary' },
  { name: 'Shri Vimal S. Chate', title: 'Vice President' },
  { name: 'Shri Mayur Dafle', title: 'Trustee' },
]

export default function About() {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.getSettings().then(res => res.data)
  })

  const vision = settings?.vision || 'To light the lamp of knowledge in every child\'s heart — especially those who have been denied the chance to learn.'
  const missionArray = settings?.mission ? JSON.parse(settings.mission) : [
    'Provide accessible, quality education to first-generation learners in rural Vidarbha.',
    'Build vocational skills that create direct employment pathways for rural youth.',
    'Empower women through professional education — and support underprivileged boys through free residential care.'
  ]
  const founderStory = settings?.founderStory || 'A visionary educationist and community leader from Wardha, Shri Dinesh Baliram Sawai dedicated his life to making quality education accessible to the most underserved communities of Vidarbha.'

  const values = [
    { name: 'Vision', description: vision, icon: Eye },
    { name: 'Mission', description: missionArray.join(' '), icon: Target, missionPoints: missionArray },
  ]

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <Hero
        title="About Chetana Education Society"
        subtitle="Learn about our mission, values, and the principles that guide our work in empowering communities through quality education."
        backgroundImage="http://chetanaeducationsociety.com/uploads/1781946811582_brhadeta6bh.jpeg"
      />

      {/* Our Story */}
      <section className="py-24 bg-white dark:bg-navy-900">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <SectionHeader
            title="Our Story"
            subtitle="Five decades of building, one institution at a time"
          />
          <div className="mt-12 space-y-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            <p>
              Chetana Education Society was founded on <strong className="text-gray-900 dark:text-white">April 30, 1973</strong> by educationist and social reformer Shri Dinesh Baliram Sawai in Wardha, Maharashtra — with a conviction that quality education is the most lasting instrument of human dignity and community development.
            </p>
            <p>
              Over five decades, we have built a comprehensive educational network across Wardha district — one of Maharashtra's most underserved agricultural regions. From primary schooling to professional degrees, from teacher training to industrial skills, from pharmacy education to a free residential hostel — we have consistently expanded our reach to ensure that geography and economic background are never barriers to learning.
            </p>
            <p>
              More than <strong className="text-gray-900 dark:text-white">35,000 students</strong> have passed through our institutions since 1991. The majority are first-generation learners from rural families — young people for whom a Chetana institution was the door to a better life. When you educate one person from an underserved family, you transform an entire household. At scale, you transform a community.
            </p>
          </div>

          {/* Powerful Statement */}
          <blockquote className="mt-16 text-center border-l-4 border-primary-600 dark:border-primary-400 pl-6 py-4 bg-primary-50 dark:bg-primary-900/20 rounded-r-xl">
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              From a single institution in 1973 to 7 programmes serving 35,000+ students — Chetana Education Society has been Wardha's educational backbone for over five decades.
            </p>
          </blockquote>
        </div>
      </section>

      {/* Founder */}
      <section className="py-24 bg-gray-50 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-sm font-semibold leading-7 text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">
                Our Founder
              </h2>
              <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-2">
                Shri Dinesh Baliram Sawai
              </p>
              <p className="text-base text-primary-600 dark:text-primary-400 font-medium mb-6">
                Founder President, Chetana Education Society, Wardha
              </p>
              <p className="text-lg leading-8 text-gray-600 dark:text-gray-300">
                {founderStory}
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img
                  src="http://chetanaeducationsociety.com/uploads/1781946805628_54qovkp9167.jpeg"
                  alt="Shri Dinesh Baliram Sawai — Founder President, Chetana Education Society"
                  className="w-72 h-72 rounded-2xl object-cover shadow-2xl ring-4 ring-primary-100 dark:ring-primary-900"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary-600 text-white rounded-xl px-4 py-2 text-sm font-semibold shadow-lg">

                  Est. 1973
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="Our Foundation"
            subtitle="The core beliefs and goals that drive everything we do."
          />

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-8 lg:max-w-4xl lg:grid-cols-2 lg:mx-auto">
              {values.map((value, index) => (
                <div
                  key={value.name}
                  className="card p-8 relative overflow-hidden animate-scale-in hover-lift"
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {value.name}
                    </h3>
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                      value.name === 'Vision' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                  </div>

                  {value.name === 'Mission' && value.missionPoints ? (
                    <ul className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 space-y-3">
                      {value.missionPoints.map((point: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-primary-600 dark:text-primary-400 mr-2 mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                      {value.description}
                    </p>
                  )}

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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-24 bg-gray-50 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="Leadership Team"
            subtitle="The dedicated individuals who guide Chetana Education Society's mission"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {leadership.map((person) => {
              const initials = person.name.split(' ').filter(w => w.length > 2).slice(0, 2).map(w => w[0]).join('')
              return (
                <div key={person.name} className="card p-6 text-center hover-lift">
                  <div className="mx-auto w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary-700 dark:text-primary-300">{initials}</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">{person.name}</h3>
                  <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">{person.title}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Legal Credentials */}
      <section className="py-24 bg-white dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="Legal Credentials & Transparency"
            subtitle="We maintain the highest standards of accountability and transparency in all our operations"
          />

          <div className="mx-auto mt-16 max-w-4xl">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { label: '12A & 80G', sub: 'Tax-exempt donations · AAATC3478Q' },
                { label: 'CSR-1', sub: 'CSR00095049 · Companies Act 2013' },
                { label: 'Trust Reg.', sub: 'F/164/1973 · Bombay Public Trust Act' },
                { label: 'NCVT ITI', sub: 'PR27000776 · DVET 0772' },
              ].map(item => (
                <div key={item.label} className="text-center p-5 bg-gray-50 dark:bg-navy-800 rounded-xl">
                  <div className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                    {item.label}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.sub}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Chetana Education Society is registered under the Societies Registration Act and the Bombay Public Trust Act. Our financial records are audited annually by certified public accountants to ensure transparency and accountability to our donors and beneficiaries.
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
            subtitle="Measurable impact since our founding in 1973"
          />

          <div className="mx-auto mt-16 max-w-2xl lg:max-w-none">
            <dl className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
              {[
                { label: 'Years of Service', value: '52+' },
                { label: 'Students Served', value: '35,000+' },
                { label: 'Institutions', value: '7' },
                { label: 'Women in B.Ed', value: '60%+' },
                { label: 'Free Hostel Since', value: '1994' },
              ].map(stat => (
                <div key={stat.label} className="flex flex-col items-center text-center">
                  <dd className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    {stat.value}
                  </dd>
                  <dt className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  )
}
