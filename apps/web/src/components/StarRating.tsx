import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  className?: string
}

export default function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md', 
  interactive = false, 
  onChange,
  className 
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  const handleStarClick = (starRating: number) => {
    if (interactive && onChange) {
      onChange(starRating)
    }
  }

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starNumber = index + 1
        const isFilled = starNumber <= rating
        
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleStarClick(starNumber)}
            disabled={!interactive}
            className={cn(
              'transition-all duration-300',
              interactive ? 'cursor-pointer hover:scale-125 hover:rotate-12 hover:text-yellow-300' : 'cursor-default',
              isFilled 
                ? 'text-yellow-400 drop-shadow-sm' 
                : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200'
            )}
            aria-label={`${starNumber} star${starNumber > 1 ? 's' : ''}`}
          >
            <Star 
              className={cn(
                sizeClasses[size],
                isFilled ? 'fill-current' : ''
              )} 
            />
          </button>
        )
      })}
      {!interactive && (
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          ({rating}/{maxRating})
        </span>
      )}
    </div>
  )
}
