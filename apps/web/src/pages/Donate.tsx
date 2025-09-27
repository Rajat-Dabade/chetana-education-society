import { CreditCard, Smartphone, Building, Shield } from 'lucide-react'
import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'

const donationMethods = [
  {
    name: 'Online Donation',
    description: 'Quick and secure online donations via credit card or PayPal',
    icon: CreditCard,
    available: true,
  },
  {
    name: 'Mobile Payment',
    description: 'UPI payments for quick donations from your mobile device',
    icon: Smartphone,
    available: true,
  },
  {
    name: 'Bank Transfer',
    description: 'Direct bank transfers for larger donations',
    icon: Building,
    available: true,
  },
]

const impactLevels = [
  {
    amount: '₹1,500',
    impact: 'Provides school supplies and books for one child for 3 months',
    supporters: '250+ sponsors',
    popular: false
  },
  {
    amount: '₹5,000',
    impact: 'Sponsors complete education support for one child for a full year',
    supporters: '180+ sponsors',
    popular: true
  },
  {
    amount: '₹15,000',
    impact: 'Supports 3 children\'s education with learning materials and mentorship',
    supporters: '85+ sponsors',
    popular: false
  },
  {
    amount: '₹50,000',
    impact: 'Establishes a learning center in an underserved community',
    supporters: '12+ sponsors',
    popular: false
  },
]

export default function Donate() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <Hero
        title="Make a Difference Today"
        subtitle="Your donation directly supports education, emergency response, and sustainable development programs that transform communities."
        backgroundImage="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1920&h=1080&fit=crop"
      />

      {/* QR Code Section */}
      <section className="py-24 bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Quick Donation
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Scan the QR code below to make an instant donation
              </p>
            </div>
            
            <div className="mt-16 flex justify-center">
              <div className="bg-white dark:bg-navy-900 p-8 rounded-2xl shadow-lg">
                {/* QR Code Placeholder */}
                <div className="w-64 h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">QR Code</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Donation Link</p>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Scan with your phone's camera
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Levels */}
      <section className="py-24 bg-gray-50 dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="Your Impact"
            subtitle="See how your donation makes a real difference in people's lives"
          />

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
            {impactLevels.map((level) => (
              <div key={level.amount} className={`card p-6 text-center relative ${level.popular ? 'ring-2 ring-primary-500 scale-105' : ''}`}>
                {level.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                  {level.amount}
                </div>
                <p className="text-gray-900 dark:text-white font-medium mb-4">
                  {level.impact}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {level.supporters}
                </p>
                <button className={`w-full ${level.popular ? 'btn-primary' : 'btn-outline'}`}>
                  Donate {level.amount}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Donations Are Used */}
      <section className="py-24 bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="How We Use Your Donations"
            subtitle="We believe in complete transparency about how your contributions create change"
          />

          <div className="mx-auto mt-16 max-w-2xl lg:max-w-4xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">75%</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                  Direct Programs
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Education, emergency response, and community development programs
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">20%</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                  Operations
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Staff, infrastructure, and program management
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">5%</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                  Fundraising
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Donor outreach and fundraising activities
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Methods */}
      <section className="py-24 bg-gray-50 dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="Ways to Donate"
            subtitle="Choose the donation method that works best for you"
          />

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              {donationMethods.map((method) => (
                <div key={method.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <div className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg ${
                      method.name === 'Credit Card' ? 'bg-blue-100 dark:bg-blue-900/20' :
                      method.name === 'Bank Transfer' ? 'bg-green-100 dark:bg-green-900/20' :
                      method.name === 'PayPal' ? 'bg-purple-100 dark:bg-purple-900/20' :
                      'bg-orange-100 dark:bg-orange-900/20'
                    }`}>
                      <method.icon className={`h-6 w-6 ${
                        method.name === 'Credit Card' ? 'text-blue-600 dark:text-blue-400' :
                        method.name === 'Bank Transfer' ? 'text-green-600 dark:text-green-400' :
                        method.name === 'PayPal' ? 'text-purple-600 dark:text-purple-400' :
                        'text-orange-600 dark:text-orange-400'
                      }`} aria-hidden="true" />
                    </div>
                    {method.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                    {method.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Bank Details */}
          <div className="mt-16 bg-white dark:bg-navy-950 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bank Transfer Details
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Account Name</p>
                <p className="text-gray-600 dark:text-gray-300">Hope for Tomorrow NGO</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Account Number</p>
                <p className="text-gray-600 dark:text-gray-300">1234567890123456</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Bank Name</p>
                <p className="text-gray-600 dark:text-gray-300">Community Trust Bank</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">SWIFT Code</p>
                <p className="text-gray-600 dark:text-gray-300">CTBANK123</p>
              </div>
            </div>
            <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
              Please include your name and contact information in the transfer reference for tax receipt purposes.
            </p>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-24 bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-primary-600 dark:text-primary-400" />
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Your Donation is Secure
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We use industry-standard security measures to protect your donation and personal information. 
              All donations are tax-deductible and you'll receive a receipt for your records.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
