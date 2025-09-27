import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Search, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { impactApi } from '@/lib/api'
import { formatDate, getInitials } from '@/lib/utils'
import TestimonialForm from '@/components/admin/TestimonialForm'
import EmptyState from '@/components/EmptyState'
import StarRating from '@/components/StarRating'

export default function AdminTestimonials() {
  const [showForm, setShowForm] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => impactApi.getTestimonials().then(res => res.data)
  })

  const filteredTestimonials = testimonials?.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    testimonial.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (testimonial.role && testimonial.role.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || []

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the testimonial from ${name}?`)) return

    try {
      await impactApi.deleteTestimonial(id)
      toast.success('Testimonial deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] })
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to delete testimonial')
    }
  }

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] })
    queryClient.invalidateQueries({ queryKey: ['testimonials'] })
  }

  const handleEdit = (testimonial: any) => {
    setEditingTestimonial(testimonial)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTestimonial(null)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage testimonials from your community members.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </button>
      </div>

      {/* Search */}
      <div className="mt-6 max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search testimonials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="card p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTestimonials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="card p-4 sm:p-6">
                <div className="flex items-start space-x-4">
                  {testimonial.avatarUrl ? (
                    <img
                      src={testimonial.avatarUrl}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 font-medium text-sm">
                        {getInitials(testimonial.name)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </h3>
                        {testimonial.role && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {testimonial.role}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(testimonial)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial.id, testimonial.name)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 mb-3">
                      <StarRating rating={testimonial.rating || 5} size="md" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      "{testimonial.quote}"
                    </p>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Added {formatDate(testimonial.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title={searchQuery ? "No testimonials found" : "No testimonials yet"}
            description={searchQuery ? `No results found for "${searchQuery}"` : "Add your first testimonial to get started."}
            icon={User}
            action={{
              text: 'Add Testimonial',
              onClick: () => setShowForm(true)
            }}
          />
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <TestimonialForm
          testimonial={editingTestimonial}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}
