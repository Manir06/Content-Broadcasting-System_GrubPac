import { useCallback, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/helpers'

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}) {
  const overlayRef = useRef(null)

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === overlayRef.current) onClose()
    },
    [onClose]
  )

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={cn(
          'glass-strong rounded-2xl w-full shadow-2xl shadow-black/40 animate-fade-in',
          sizes[size],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border/50">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors ml-4 mt-0.5 flex-shrink-0"
            type="button"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 pb-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
