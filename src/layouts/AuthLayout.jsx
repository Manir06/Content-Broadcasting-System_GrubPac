import { Outlet } from 'react-router-dom'
import { Zap } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/10 p-12">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative z-10 max-w-md text-center">
          <div className="flex justify-center mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary shadow-2xl shadow-primary/40">
              <Zap className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">EduCast</h1>
          <p className="text-lg text-muted-foreground mb-8">
            The next-generation content broadcasting system for educational institutions.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Active Schools', value: '240+' },
              { label: 'Content Items', value: '12K+' },
              { label: 'Students Reached', value: '80K+' },
            ].map(({ label, value }) => (
              <div key={label} className="glass rounded-xl p-4">
                <p className="text-2xl font-bold text-gradient">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">EduCast</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
