import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

/**
 * Class-based error boundary (React requires class components for this).
 * Catches any unexpected JS render error in its subtree and shows a
 * graceful fallback instead of a blank white page.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // In production this would send to an error reporting service (Sentry etc.)
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    // Also navigate home so the user isn't stuck on a broken route
    window.location.href = '/'
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'hsl(222 47% 11%)',
          padding: '2rem',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            padding: '2.5rem',
            borderRadius: '1rem',
            background: 'hsl(222 47% 14%)',
            border: '1px solid hsl(222 47% 20%)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
          }}
        >
          {/* Icon */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '1rem',
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.2)',
              marginBottom: '1.25rem',
            }}
          >
            <AlertTriangle style={{ width: '32px', height: '32px', color: '#f87171' }} />
          </div>

          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'hsl(213 31% 91%)',
              marginBottom: '0.5rem',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Something went wrong
          </h1>

          <p
            style={{
              fontSize: '0.875rem',
              color: 'hsl(215 20% 55%)',
              marginBottom: '1.75rem',
              lineHeight: '1.6',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            An unexpected error occurred in the application. The error has been
            logged. Click below to return to the home page.
          </p>

          {/* Error detail (collapsed in production) */}
          {import.meta.env.DEV && this.state.error && (
            <pre
              style={{
                fontSize: '0.7rem',
                background: 'hsl(222 47% 10%)',
                border: '1px solid hsl(222 47% 18%)',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                color: '#f87171',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '1.5rem',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {this.state.error.message}
            </pre>
          )}

          <button
            onClick={this.handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              background: 'hsl(221 83% 63%)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: 'Inter, system-ui, sans-serif',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <RefreshCw style={{ width: '16px', height: '16px' }} />
            Return to Home
          </button>
        </div>
      </div>
    )
  }
}
