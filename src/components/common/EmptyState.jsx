import { FileX, Inbox, Search } from 'lucide-react'
import { cn } from '../../utils/helpers'

const iconMap = {
  empty: Inbox,
  search: Search,
  error: FileX,
}

export function EmptyState({
  icon = 'empty',
  title = 'Nothing here yet',
  description = 'There is no data to display at the moment.',
  action = null,
  className,
}) {
  const Icon = typeof icon === 'string' ? iconMap[icon] ?? Inbox : icon

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-4">
        <Icon className="h-8 w-8 text-primary/60" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {action}
    </div>
  )
}
