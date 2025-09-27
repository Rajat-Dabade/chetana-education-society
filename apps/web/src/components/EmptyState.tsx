import { FileX } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ComponentType<any>
  action?: {
    text: string
    onClick: () => void
  }
}

export default function EmptyState({ 
  title, 
  description, 
  icon: Icon = FileX,
  action 
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Icon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 btn-primary"
        >
          {action.text}
        </button>
      )}
    </div>
  )
}
