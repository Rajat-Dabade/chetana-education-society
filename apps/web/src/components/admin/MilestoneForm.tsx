import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import { milestoneSchema, type MilestoneInput } from '@/lib/validations'
import { impactApi } from '@/lib/api'

interface MilestoneFormProps {
  milestone?: any
  onClose: () => void
  onSuccess: () => void
}

export default function MilestoneForm({ milestone, onClose, onSuccess }: MilestoneFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!milestone

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MilestoneInput>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: milestone ? {
      ...milestone,
      achievedOn: new Date(milestone.achievedOn).toISOString().slice(0, 10)
    } : {
      title: '',
      description: '',
      achievedOn: new Date().toISOString().slice(0, 10)
    }
  })

  const onSubmit = async (data: MilestoneInput) => {
    const submitData = {
      ...data,
      achievedOn: new Date(data.achievedOn).toISOString() // Convert to ISO format
    }
    
    setIsSubmitting(true)
    try {
      if (isEditing) {
        await impactApi.updateMilestone(milestone.id, submitData)
        toast.success('Milestone updated successfully')
      } else {
        await impactApi.createMilestone(submitData)
        toast.success('Milestone created successfully')
      }
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Milestone' : 'Add New Milestone'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className="form-input"
              placeholder="Milestone title"
            />
            {errors.title && (
              <p className="form-error">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="achievedOn" className="form-label">
              Date Achieved *
            </label>
            <input
              type="date"
              id="achievedOn"
              {...register('achievedOn')}
              className="form-input"
            />
            {errors.achievedOn && (
              <p className="form-error">{errors.achievedOn.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className="form-input"
              placeholder="Optional description of this milestone..."
              maxLength={500}
            />
            {errors.description && (
              <p className="form-error">{errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
