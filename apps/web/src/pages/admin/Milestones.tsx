import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Award, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { impactApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import MilestoneForm from '@/components/admin/MilestoneForm'
import EmptyState from '@/components/EmptyState'

export default function AdminMilestones() {
  const [showForm, setShowForm] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<any>(null)
  const queryClient = useQueryClient()

  const { data: milestones, isLoading } = useQuery({
    queryKey: ['admin-milestones'],
    queryFn: () => impactApi.getMilestones().then(res => res.data)
  })

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      await impactApi.deleteMilestone(id)
      toast.success('Milestone deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-milestones'] })
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to delete milestone')
    }
  }

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-milestones'] })
    queryClient.invalidateQueries({ queryKey: ['milestones'] })
  }

  const handleEdit = (milestone: any) => {
    setEditingMilestone(milestone)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingMilestone(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Milestones</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Track and manage organizational milestones and achievements.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Milestone
        </button>
      </div>

      {/* Content */}
      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-start space-x-4">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : milestones && milestones.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone: any) => (
                <div key={milestone.id} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 ring-8 ring-white dark:ring-gray-50">
                    <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  
                  {/* Content */}
                  <div className="ml-8 flex-1">
                    <div className="card p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <Calendar className="h-4 w-4" />
                            <time>{formatDate(milestone.achievedOn)}</time>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {milestone.title}
                          </h3>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEdit(milestone)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(milestone.id, milestone.title)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {milestone.description && (
                        <p className="text-gray-600 dark:text-gray-300">
                          {milestone.description}
                        </p>
                      )}
                      
                      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        Added {formatDate(milestone.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No milestones yet"
            description="Add your first organizational milestone to get started."
            icon={Award}
            action={{
              text: 'Add Milestone',
              onClick: () => setShowForm(true)
            }}
          />
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <MilestoneForm
          milestone={editingMilestone}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}
