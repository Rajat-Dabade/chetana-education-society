import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '@/lib/api'
import { loginSchema, type LoginInput } from '@/lib/validations'

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      navigate('/admin')
    }
  }, [navigate])

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true)
    try {
      const response = await authApi.login(data)
      const { token } = response.data
      
      localStorage.setItem('admin_token', token)
      toast.success('Welcome back!')
      navigate('/admin')
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          {/* Logo */}
          <Link to="/" className="flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Heart className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                Chetana Education Society
              </span>
            </div>
          </Link>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to manage your NGO website
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className="form-input"
                placeholder="admin@ngo.org"
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  className="form-input pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full text-lg py-3"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              ← Back to website
            </Link>
          </div>
        </form>

        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Demo Credentials
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Email: admin@ngo.org<br />
            Password: ChangeMe123!
          </p>
        </div>
      </div>
    </div>
  )
}
