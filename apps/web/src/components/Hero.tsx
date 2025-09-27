import { Link } from 'react-router-dom'

interface HeroProps {
  title: string
  subtitle: string
  primaryCTA?: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
  backgroundImage?: string
  overlay?: boolean
}

export default function Hero({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  overlay = true
}: HeroProps) {
  return (
    <section className="relative bg-star-pattern">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
          {overlay && (
            <div className="absolute inset-0 bg-gray-900/50 dark:bg-navy-950/60" />
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl animate-slide-up">
            {title}
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-300 max-w-2xl mx-auto sm:mt-6 sm:text-lg sm:leading-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {subtitle}
          </p>
          
          {(primaryCTA || secondaryCTA) && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              {primaryCTA && (
                <Link
                  to={primaryCTA.href}
                  className="btn-primary w-full sm:w-auto text-base sm:text-lg px-6 py-3 sm:px-8 animate-glow hover-lift"
                >
                  {primaryCTA.text}
                </Link>
              )}
              {secondaryCTA && (
                <Link
                  to={secondaryCTA.href}
                  className="btn-outline w-full sm:w-auto text-base sm:text-lg px-6 py-3 sm:px-8 bg-white/10 border-white text-white hover:bg-white hover:text-gray-900 hover-lift"
                >
                  {secondaryCTA.text}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
