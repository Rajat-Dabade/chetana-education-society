import { Link } from 'react-router-dom'
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const footerNavigation = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'Our Impact', href: '/impact' },
    { name: 'News & Events', href: '/news' },
    { name: 'Blog', href: '/blogs' },
    { name: 'Contact', href: '/contact' },
  ],
  support: [
    { name: 'Donate Now', href: '/donate' },
    { name: 'Volunteer', href: '/contact' },
    { name: 'Partner with Us', href: '/contact' },
    { name: 'Sponsorship', href: '/contact' },
  ],
  social: [
    {
      name: 'Facebook',
      href: '#',
      icon: Facebook,
    },
    {
      name: 'Twitter',
      href: '#',
      icon: Twitter,
    },
    {
      name: 'Instagram',
      href: '#',
      icon: Instagram,
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: Linkedin,
    },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-navy-950" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-12 sm:px-6 sm:pb-8 sm:pt-16 lg:px-8 lg:pt-24 xl:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand section */}
          <div className="space-y-8">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">
                Chetana Education Society
              </span>
            </div>
            <p className="text-sm leading-6 text-gray-300">
              Creating lasting positive change in underserved communities through education, 
              emergency response, and sustainable development programs.
            </p>
            <div className="space-y-2">
              <div className="flex items-start space-x-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>B-62 Education Nagar, Community District, State 229001, India</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+91 98847 10411</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4" />
                <span>info@chetanaeducation.org</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400 mb-2">Legal Status:</p>
              <p className="text-sm text-gray-300">
                Registered under Societies Registration Act | 12A & 80G Certified | FCRA Approved
              </p>
            </div>
            <div className="flex space-x-6">
              {footerNavigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                  aria-label={item.name}
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation sections */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Organization</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.main.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Get Involved</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter signup */}
            <div className="md:grid md:grid-cols-1">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Subscribe to our newsletter
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-300">
                  Get the latest updates on our programs and impact.
                </p>
                <form className="mt-6 sm:flex sm:max-w-md">
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email-address"
                    id="email-address"
                    autoComplete="email"
                    required
                    className="w-full min-w-0 appearance-none rounded-md border-0 bg-white/5 px-3 py-1.5 text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
                    placeholder="Enter your email"
                  />
                  <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                    <button
                      type="submit"
                      className="btn-primary w-full sm:w-auto"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-gray-400">
              &copy; {new Date().getFullYear()} Chetana Education Society. All rights reserved.
            </p>
            <div className="mt-4 flex space-x-6 sm:mt-0">
              <a href="#" className="text-xs leading-5 text-gray-400 hover:text-gray-300">
                Privacy Policy
              </a>
              <a href="#" className="text-xs leading-5 text-gray-400 hover:text-gray-300">
                Terms of Service
              </a>
              <a href="#" className="text-xs leading-5 text-gray-400 hover:text-gray-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
