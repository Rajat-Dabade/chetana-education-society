import { Award } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface MilestoneItemProps {
  milestone: any
  index: number
}

export default function MilestoneItem({ milestone, index }: MilestoneItemProps) {
  const { elementRef, isInView } = useScrollAnimation({
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
  })

  return (
    <div 
      ref={elementRef}
      className={`relative flex items-start lg:items-center transition-all duration-700 transform ${
        isInView 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      }`}
      style={{ 
        transitionDelay: isInView ? `${index * 0.2}s` : '0s'
      }}
    >
      {/* Mobile Layout: Icon on left, content on right */}
      <div className="flex lg:hidden items-start w-full">
        {/* Mobile Timeline Icon - smaller size */}
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ring-2 ring-white dark:ring-navy-900 hover-scale flex-shrink-0 ${
          index % 4 === 0 ? 'bg-blue-100 dark:bg-blue-900/20' :
          index % 4 === 1 ? 'bg-green-100 dark:bg-green-900/20' :
          index % 4 === 2 ? 'bg-purple-100 dark:bg-purple-900/20' :
          'bg-orange-100 dark:bg-orange-900/20'
        }`}>
          <Award className={`h-6 w-6 ${
            index % 4 === 0 ? 'text-blue-600 dark:text-blue-400' :
            index % 4 === 1 ? 'text-green-600 dark:text-green-400' :
            index % 4 === 2 ? 'text-purple-600 dark:text-purple-400' :
            'text-orange-600 dark:text-orange-400'
          }`} />
        </div>

        {/* Mobile Content Card - larger size */}
        <div className="ml-4 flex-1 min-w-0">
          <div className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {milestone.title}
              </h3>
              <time className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                {formatDate(milestone.achievedOn)}
              </time>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {milestone.description}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout: Alternating left/right with central icons */}
      <div className="hidden lg:flex w-full items-center">
        {/* Content positioning based on index */}
        <div className={`flex w-full items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
          {/* Content Card */}
          <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
            <div className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {milestone.title}
                </h3>
                <time className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4">
                  {formatDate(milestone.achievedOn)}
                </time>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {milestone.description}
              </p>
            </div>
          </div>

          {/* Central Icon */}
          <div className="w-2/12 flex justify-center">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full ring-4 ring-white dark:ring-navy-900 hover-scale ${
              index % 4 === 0 ? 'bg-blue-100 dark:bg-blue-900/20' :
              index % 4 === 1 ? 'bg-green-100 dark:bg-green-900/20' :
              index % 4 === 2 ? 'bg-purple-100 dark:bg-purple-900/20' :
              'bg-orange-100 dark:bg-orange-900/20'
            }`}>
              <Award className={`h-8 w-8 ${
                index % 4 === 0 ? 'text-blue-600 dark:text-blue-400' :
                index % 4 === 1 ? 'text-green-600 dark:text-green-400' :
                index % 4 === 2 ? 'text-purple-600 dark:text-purple-400' :
                'text-orange-600 dark:text-orange-400'
              }`} />
            </div>
          </div>

          {/* Spacer for opposite side */}
          <div className="w-5/12"></div>
        </div>
      </div>
    </div>
  )
}
