import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { contactSchema, type ContactInput } from '@/lib/validations'
import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'

const contactInfo = [
  {
    name: 'Registered Office',
    value: 'B-62 Education Nagar\nCommunity District, State 229001\nIndia',
    icon: MapPin,
  },
  {
    name: 'Phone',
    value: '+91 98847 10411\n+91 80470 91716',
    icon: Phone,
  },
  {
    name: 'Email',
    value: 'info@chetanaeducation.org\nsupport@chetanaeducation.org',
    icon: Mail,
  },
  {
    name: 'Office Hours',
    value: 'Monday - Saturday\n9:00 AM - 6:00 PM IST',
    icon: Clock,
  },
]

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactInput) => {
    setIsSubmitting(true)
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Contact form submission:', data)
      toast.success('Thank you for your message! We\'ll get back to you soon.')
      reset()
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <Hero
        title="Get in Touch"
        subtitle="We'd love to hear from you. Whether you want to volunteer, partner with us, or learn more about our work, we're here to help."
        backgroundImage="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920&h=1080&fit=crop"
      />

      {/* Contact Information */}
      <section className="py-24 bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="Contact Information"
            subtitle="Reach out to us through any of these channels"
          />

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
            {contactInfo.map((item, index) => (
              <div key={item.name} className="text-center">
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-6 hover-scale ${
                  index === 0 ? 'bg-blue-100 dark:bg-blue-900/20' :
                  index === 1 ? 'bg-green-100 dark:bg-green-900/20' :
                  index === 2 ? 'bg-purple-100 dark:bg-purple-900/20' :
                  'bg-orange-100 dark:bg-orange-900/20'
                }`}>
                  <item.icon className={`h-8 w-8 ${
                    index === 0 ? 'text-blue-600 dark:text-blue-400' :
                    index === 1 ? 'text-green-600 dark:text-green-400' :
                    index === 2 ? 'text-purple-600 dark:text-purple-400' :
                    'text-orange-600 dark:text-orange-400'
                  }`} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Send us a message
              </h2>
              <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-300 sm:mt-4 sm:text-lg sm:leading-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="form-label">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name')}
                      className="form-input"
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="form-error">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="form-label">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      className="form-input"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="form-error">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="form-label">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    {...register('subject')}
                    className="form-input"
                    placeholder="What's this about?"
                  />
                  {errors.subject && (
                    <p className="form-error">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="form-label">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    {...register('message')}
                    className="form-input"
                    placeholder="Tell us more about how we can help..."
                  />
                  {errors.message && (
                    <p className="form-error">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Visit our office
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
                We welcome visitors during our office hours. Feel free to drop by for a chat!
              </p>

              <div className="mt-8 bg-white dark:bg-navy-950 rounded-2xl p-8 shadow-lg">
                {/* Map Placeholder */}
                <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Interactive Map</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      123 Hope Street, Community City
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Getting Here
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>• By car: Free parking available on-site</li>
                    <li>• By bus: Route 42 stops directly outside</li>
                    <li>• By train: Community Station is 0.5 miles away</li>
                    <li>• Wheelchair accessible entrance available</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer CTA */}
      <section className="py-24 bg-primary-600 dark:bg-primary-700">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to make a difference?
            </h2>
            <p className="mt-6 text-lg leading-8 text-primary-100">
              Join our community of volunteers and help us create lasting positive change.
            </p>
            <div className="mt-10 flex items-center justify-center">
              <a
                href="/donate"
                className="btn bg-white text-primary-600 hover:bg-gray-50 px-8 py-3"
              >
                Make a Donation
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
