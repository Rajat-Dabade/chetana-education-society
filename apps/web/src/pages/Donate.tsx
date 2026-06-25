import { BookOpen, Wrench, GraduationCap, Home, Shield, Phone, Mail } from 'lucide-react'
import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'

const csrAreas = [
  {
    icon: BookOpen,
    title: 'Education',
    description: 'Quality schooling and professional education for first-generation learners in rural Vidarbha.',
    clause: 'Schedule VII Clause (ii)',
    color: 'blue',
  },
  {
    icon: Wrench,
    title: 'Skill Development',
    description: 'NCVT ITI vocational training — upcoming EV Mechanic trade, AI & Solar — direct rural employment.',
    clause: 'Schedule VII Clause (ii)',
    color: 'orange',
  },
  {
    icon: GraduationCap,
    title: 'Women Empowerment',
    description: 'B.Ed professional education — 60%+ women students — creating independent earning women educators.',
    clause: 'Schedule VII Clause (iii)',
    color: 'purple',
  },
  {
    icon: Home,
    title: 'Social Welfare',
    description: 'Ramdas Magaswargiy Boys Hostel (since 1994) + Chetana Girls Residential Campus (under construction · 130 girls).',
    clause: 'Schedule VII Clause (i)',
    color: 'green',
  },
]

const girlsHostelTiers = [
  { amount: '₹50,000', impact: 'Furnishes one room — 3 girls get a safe home' },
  { amount: '₹1,00,000', impact: 'Completes plastering of one full floor' },
  { amount: '₹5,00,000', impact: 'Complete electrification — entire hostel building' },
  { amount: '₹15,00,000', impact: 'Mess building construction — dining for 130 girls' },
  { amount: '₹50,00,000', impact: 'Complete hostel campus — 130 girls housed and supported' },
]

const generalTiers = [
  { amount: '₹10,000', impact: 'Funds one month of a B.Ed student\'s education' },
  { amount: '₹25,000', impact: 'Equips one ITI student with a complete trade toolkit' },
  { amount: '₹50,000', impact: 'Sponsors one semester for a D.Pharm student' },
  { amount: '₹1,00,000', impact: 'Funds one complete EV workshop bay setup' },
  { amount: '₹5,00,000', impact: 'Sponsors one full ITI batch of 30 students for a year' },
]

export default function Donate() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <Hero
        title="Partner With Us"
        subtitle="Your CSR investment with Chetana Education Society reaches real communities in rural Wardha — creating measurable, auditable, and lasting change across education, skill development, and social welfare."
        backgroundImage="https://chetanaeducationsociety.com/uploads/1781946808104_t8w0inhfso.jpeg"
      />

      {/* Opening Statement */}
      <section className="py-16 bg-primary-700 dark:bg-primary-800">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <p className="text-lg sm:text-xl text-primary-100 leading-relaxed">
            We align with <strong className="text-white">Schedule VII of the Companies Act 2013</strong> — making us a natural fit for corporate CSR mandates in education, skill development, women empowerment, and rural development.
          </p>
          <p className="mt-4 text-primary-200">
            Your donation is eligible for <strong className="text-white">80G income tax deduction.</strong>
          </p>
        </div>
      </section>

      {/* International Recognition */}
      <section className="py-12 bg-amber-50 dark:bg-amber-900/20 border-y border-amber-200 dark:border-amber-700">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-lg font-bold text-amber-800 dark:text-amber-300 mb-3">
            International Recognition & Partnerships
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed max-w-3xl mx-auto">
            In April 2026, Chetana Education Society signed a Framework Memorandum of Understanding with the <strong>Dhammakaya Foundation, Thailand</strong> (through its Indian branch, Dhammacakka Foundation Trust), marking the beginning of joint education and community development programmes in India. The agreement was signed by Dr. Chetana Sawai, Secretary of CES, and Bhante Anusorn, President of Dhammacakka Foundation Trust.
          </p>
          <p className="mt-3 text-sm text-amber-700 dark:text-amber-400">
            This partnership reflects CES's growing international profile — built on 53 years of grassroots work in Wardha.
          </p>
        </div>
      </section>

      {/* CSR Focus Areas */}
      <section className="py-24 bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="CSR Focus Areas"
            subtitle="Where your investment creates impact"
          />
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {csrAreas.map((area) => {
              const colorMap: Record<string, string> = {
                blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
                orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
                purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
                green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
              }
              return (
                <div key={area.title} className="card p-6 text-center hover-lift">
                  <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 ${colorMap[area.color]}`}>
                    <area.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{area.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{area.description}</p>
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
                    {area.clause}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Funding Priority 1 — EV Mechanic */}
      <section className="py-24 bg-gray-50 dark:bg-navy-900">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="card p-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                Funding Priority 1
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              EV Mechanic Trade at Chetana ITI
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              India's electric vehicle revolution is creating massive demand for trained mechanics. Chetana ITI proposes to introduce the EV Mechanic trade — equipping rural Wardha youth with future-ready skills for the growing green economy.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">₹15,00,000</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total requirement</p>
              </div>
              <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">30</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Students per batch</p>
              </div>
              <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">₹15–25K</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monthly earning post-placement</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Schedule VII alignment: Clause (ii) — Education & Skill Development
            </p>
          </div>
        </div>
      </section>

      {/* Funding Priority 2 — Girls Hostel */}
      <section className="py-24 bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="card p-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                Funding Priority 2
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Chetana Girls Residential Campus, Wardha
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              3-floor building constructed · 42 rooms · Capacity 130 girls · Needs completion, electrification & furnishing · Target: March 2027
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              For a girl from a village 50km away — a safe hostel is not a convenience. It is the difference between pursuing her education and staying home. Rural Maharashtra loses thousands of girls to early marriage and dropout every year — simply because there is nowhere safe to stay near their college.
            </p>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">What your contribution achieves:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {girlsHostelTiers.map(tier => (
                <div key={tier.amount} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-navy-800 rounded-xl">
                  <span className="text-base font-bold text-primary-600 dark:text-primary-400 flex-shrink-0">{tier.amount}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{tier.impact}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Schedule VII: Clause (i) Social Welfare · Clause (ii) Education · Clause (iii) Women Empowerment
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Construction photos available on request — contact chetana.sawai@gmail.com
            </p>
          </div>
        </div>
      </section>

      {/* General Giving Guide */}
      <section className="py-24 bg-gray-50 dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="General Giving Guide"
            subtitle="What your contribution achieves across our institutions"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 max-w-6xl mx-auto">
            {generalTiers.map(tier => (
              <div key={tier.amount} className="card p-6 text-center hover-lift">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-3">{tier.amount}</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{tier.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Card */}
      <section className="py-24 bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <SectionHeader
            title="Compliance Details"
            subtitle="All public government registry information — bank details shared only on request"
          />
          <div className="mt-12 card p-8">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                CSR & Legal Registration
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
              {[
                { label: 'CSR-1 Registration', value: 'CSR00095049' },
                { label: 'PAN', value: 'AAATC3478Q' },
                { label: '12A Certificate', value: 'AAATC3478QE 20241 · Valid' },
                { label: '80G Certificate', value: 'AAATC3478QF 20241 · Valid · Tax Deductible' },
                { label: 'Trust Registration', value: 'F/164/1973 · Bombay Public Trust Act · Wardha' },
                { label: 'ITI NCVT Registration', value: 'PR27000776 · DVET 0772' },
                { label: 'NGO Darpan', value: 'Registered · NITI Aayog portal' },
                { label: 'Bank Details', value: 'Available on request — email chetana.sawai@gmail.com' },
              ].map(item => (
                <div key={item.label} className="p-3 bg-gray-50 dark:bg-navy-800 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white text-xs uppercase tracking-wide mb-1">{item.label}</p>
                  <p className="text-gray-600 dark:text-gray-300">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 bg-primary-700 dark:bg-primary-800">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-primary-100 mb-8">
            Ready to partner with us? Contact Dr. Chetana Dinesh Sawai, Secretary, Chetana Education Society
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="tel:+917499231645"
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors"
            >
              <Phone className="h-5 w-5" />
              +91 74992 31645
            </a>
            <a
              href="mailto:chetana.sawai@gmail.com"
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors"
            >
              <Mail className="h-5 w-5" />
              chetana.sawai@gmail.com
            </a>
          </div>
          <p className="mt-8 text-primary-200 text-sm">
            Bank details available on verified request only
          </p>
        </div>
      </section>
    </div>
  )
}
