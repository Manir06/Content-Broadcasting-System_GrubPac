import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Calendar, Clock, Info, Send } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../hooks/useAuth'
import { contentService } from '../../services/content.service'
import { SUBJECTS, QUERY_KEYS } from '../../utils/constants'
import { FileUpload } from '../../components/forms/FileUpload'
import { cn } from '../../utils/helpers'

const uploadSchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters.').max(100),
    subject: z.string().min(1, 'Please select a subject.'),
    description: z.string().max(500).optional(),
    startTime: z.string().min(1, 'Start time is required.'),
    endTime: z.string().min(1, 'End time is required.'),
    rotationDuration: z
      .number({ invalid_type_error: 'Must be a number.' })
      .int()
      .min(5, 'Minimum 5 seconds.')
      .max(300, 'Maximum 300 seconds.'),
  })
  .refine((d) => new Date(d.endTime) > new Date(d.startTime), {
    message: 'End time must be after start time.',
    path: ['endTime'],
  })

function FormField({ id, label, error, required, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
        {hint && (
          <span className="group relative cursor-help">
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="absolute left-5 top-0 hidden group-hover:block w-48 text-xs text-muted-foreground bg-popover border border-border rounded-lg p-2 z-10 shadow-lg">
              {hint}
            </span>
          </span>
        )}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export default function UploadContent() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      subject: '',
      description: '',
      startTime: '',
      endTime: '',
      rotationDuration: 15,
    },
  })

  const mutation = useMutation({
    mutationFn: (data) =>
      contentService.uploadContent({
        ...data,
        teacherId: user?.id,
        teacherName: user?.name,
        fileUrl: file ? URL.createObjectURL(file) : null,
        fileName: file?.name ?? null,
        fileSize: file?.size ?? null,
      }),
    onSuccess: () => {
      toast.success('Content uploaded successfully! Awaiting principal approval.')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEACHER_CONTENT] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEACHER_STATS] })
      reset()
      setFile(null)
      setFileError(null)
      navigate('/teacher/my-content')
    },
    onError: (err) => {
      toast.error(err?.message ?? 'Upload failed. Please try again.')
    },
  })

  const handleFileChange = useCallback((f, err) => {
    setFile(f)
    setFileError(err)
  }, [])

  const onSubmit = useCallback(
    (data) => {
      if (!file) {
        setFileError('Please upload an image file.')
        return
      }
      if (fileError) return
      mutation.mutate(data)
    },
    [file, fileError, mutation]
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-ghost p-2"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Upload Content</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Submit content for principal review and broadcasting approval.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Section: Basic Info */}
        <section className="glass rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            Content Information
          </h2>

          <FormField id="upload-title" label="Title" required error={errors.title?.message}>
            <input
              id="upload-title"
              type="text"
              placeholder="e.g. Introduction to Algebra"
              {...register('title')}
              className={cn('input-field', errors.title && 'border-destructive')}
            />
          </FormField>

          <FormField id="upload-subject" label="Subject" required error={errors.subject?.message}>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <select
                  id="upload-subject"
                  {...field}
                  className={cn('input-field', errors.subject && 'border-destructive')}
                >
                  <option value="">Select a subject</option>
                  {SUBJECTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </FormField>

          <FormField id="upload-description" label="Description" error={errors.description?.message}>
            <textarea
              id="upload-description"
              rows={3}
              placeholder="Brief description of the content..."
              {...register('description')}
              className="input-field resize-none"
            />
          </FormField>
        </section>

        {/* Section: File Upload */}
        <section className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            Media File
          </h2>
          <FileUpload value={file} onChange={handleFileChange} error={fileError} />
        </section>

        {/* Section: Schedule */}
        <section className="glass rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Broadcast Schedule
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              id="upload-start"
              label="Start Time"
              required
              error={errors.startTime?.message}
            >
              <input
                id="upload-start"
                type="datetime-local"
                {...register('startTime')}
                className={cn('input-field', errors.startTime && 'border-destructive')}
              />
            </FormField>

            <FormField
              id="upload-end"
              label="End Time"
              required
              error={errors.endTime?.message}
            >
              <input
                id="upload-end"
                type="datetime-local"
                {...register('endTime')}
                className={cn('input-field', errors.endTime && 'border-destructive')}
              />
            </FormField>
          </div>

          <FormField
            id="upload-rotation"
            label="Rotation Duration (seconds)"
            error={errors.rotationDuration?.message}
            hint="How long this content displays before rotating to the next item."
          >
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="upload-rotation"
                type="number"
                min={5}
                max={300}
                {...register('rotationDuration', { valueAsNumber: true })}
                className={cn('input-field pl-10', errors.rotationDuration && 'border-destructive')}
              />
            </div>
          </FormField>
        </section>

        {/* Submit */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-ghost"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="upload-submit-btn"
            disabled={mutation.isPending}
            className="btn-primary min-w-[140px] justify-center"
          >
            {mutation.isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Uploading...
              </span>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit for Review
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
