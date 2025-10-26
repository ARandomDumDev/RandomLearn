import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg" />
      <Skeleton className="h-40 rounded-lg" />
    </div>
  )
}

export function LessonSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 rounded-lg" />
      <Skeleton className="h-32 rounded-lg" />
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
