import { useCallback, useRef, useState } from 'react'
import { CloudUpload, X, ImageIcon, FileCheck } from 'lucide-react'
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../../utils/constants'
import { formatFileSize } from '../../utils/helpers'
import { cn } from '../../utils/helpers'

export function FileUpload({ value, onChange, error }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleFile = useCallback(
    (file) => {
      if (!file) return

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        onChange(null, 'Only JPG, PNG, and GIF files are allowed.')
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        onChange(null, `File size must be under ${formatFileSize(MAX_FILE_SIZE)}.`)
        return
      }

      const url = URL.createObjectURL(file)
      setPreview(url)
      onChange(file, null)
    },
    [onChange]
  )

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleChange = useCallback(
    (e) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleRemove = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    onChange(null, null)
    if (inputRef.current) inputRef.current.value = ''
  }, [preview, onChange])

  return (
    <div className="space-y-2">
      {!value ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200',
            isDragging
              ? 'border-primary bg-primary/10 scale-[1.01]'
              : 'border-border hover:border-primary/50 hover:bg-primary/5',
            error && 'border-destructive/50 bg-destructive/5'
          )}
        >
          <div className={cn(
            'flex h-14 w-14 items-center justify-center rounded-2xl transition-colors',
            isDragging ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
          )}>
            <CloudUpload className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {isDragging ? 'Drop it here!' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports JPG, PNG, GIF — max {formatFileSize(MAX_FILE_SIZE)}
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_FILE_TYPES.join(',')}
            onChange={handleChange}
            className="sr-only"
            id="file-upload-input"
          />
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden">
          {preview && (
            <div className="relative h-48">
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-black/60 hover:bg-destructive flex items-center justify-center text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-3 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
              <FileCheck className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{value.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(value.size)}</p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}
