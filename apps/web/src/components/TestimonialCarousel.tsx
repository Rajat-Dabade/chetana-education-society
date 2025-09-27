import { useState } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import StarRating from './StarRating'

interface Testimonial {
  id: string
  name: string
  role?: string
  quote: string
  rating: number
  avatarUrl?: string
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  if (!testimonials.length) return null

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="relative">
      {/* Main testimonial */}
      <div className="text-center max-w-4xl mx-auto animate-fade-in">
        <Quote className="mx-auto h-12 w-12 text-primary-600 dark:text-primary-400 mb-8 animate-pulse-slow" />
        
        <div className="flex justify-center mb-6">
          <StarRating rating={currentTestimonial.rating} size="lg" />
        </div>
        
        <blockquote className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900 dark:text-white leading-relaxed mb-6 sm:mb-8 px-4 sm:px-0">
          "{currentTestimonial.quote}"
        </blockquote>
        
        <div className="flex items-center justify-center space-x-4">
          {currentTestimonial.avatarUrl ? (
            <img
              src={currentTestimonial.avatarUrl}
              alt={currentTestimonial.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {getInitials(currentTestimonial.name)}
              </span>
            </div>
          )}
          
          <div className="text-left">
            <div className="font-semibold text-gray-900 dark:text-white">
              {currentTestimonial.name}
            </div>
            {currentTestimonial.role && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {currentTestimonial.role}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      {testimonials.length > 1 && (
        <>
          <button
            onClick={prevTestimonial}
            className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white dark:bg-navy-800 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transform hover:scale-110 hover:-translate-x-1"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white dark:bg-navy-800 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transform hover:scale-110 hover:translate-x-1"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                  index === currentIndex
                    ? 'bg-primary-600 dark:bg-primary-400 scale-110'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
