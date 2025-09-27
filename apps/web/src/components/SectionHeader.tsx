interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
}

export default function SectionHeader({ 
  title, 
  subtitle, 
  centered = true 
}: SectionHeaderProps) {
  return (
    <div className={centered ? 'text-center' : ''}>
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}
