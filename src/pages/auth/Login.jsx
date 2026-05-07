import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Mail, Zap } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { ROLES } from '../../utils/constants'
import { cn } from '../../utils/helpers'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

const DEMO_CREDENTIALS = [
  { label: 'Teacher Demo', email: 'teacher@example.com', password: 'password123', role: 'teacher' },
  { label: 'Principal Demo', email: 'principal@example.com', password: 'password123', role: 'principal' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = useCallback(
    async (data) => {
      setIsLoading(true)
      try {
        const user = await login(data.email, data.password)
        toast.success(`Welcome back, ${user.name}!`)
        if (user.role === ROLES.TEACHER) navigate('/teacher/dashboard')
        else if (user.role === ROLES.PRINCIPAL) navigate('/principal/dashboard')
      } catch (err) {
        toast.error(err?.message ?? 'Login failed. Please try again.')
      } finally {
        setIsLoading(false)
      }
    },
    [login, navigate]
  )

  const fillCredentials = useCallback(
    (creds) => {
      setValue('email', creds.email)
      setValue('password', creds.password)
    },
    [setValue]
  )

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
        <p className="text-muted-foreground mt-1 text-sm">Sign in to your EduCast account</p>
      </div>

      {/* Demo Credential Chips */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {DEMO_CREDENTIALS.map((cred) => (
          <button
            key={cred.role}
            type="button"
            onClick={() => fillCredentials(cred)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <Zap className="h-3 w-3" />
            {cred.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mb-6 -mt-3">
        Click a demo credential above to auto-fill
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="text-sm font-medium text-foreground">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register('email')}
              className={cn(
                'input-field pl-10',
                errors.email && 'border-destructive focus:ring-destructive/40'
              )}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="login-password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
              className={cn(
                'input-field pl-10 pr-10',
                errors.password && 'border-destructive focus:ring-destructive/40'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          id="login-submit-btn"
          className="btn-primary w-full justify-center py-3 text-base font-semibold"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </button>
      </form>
    </div>
  )
}
