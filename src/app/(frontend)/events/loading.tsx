import { DynamicMainLayout } from "@/components/layout"
import { EventCardSkeleton } from "@/components/ui/loading-skeletons"
import { Skeleton } from "@/components/ui/skeleton"

export default function EventsLoading() {
  const sidebarConfig = {
    title: "EVENT CATEGORIES",
    items: Array.from({ length: 4 }, (_, i) => ({
      title: `Category ${i + 1}`,
      anchor: `category-${i + 1}`,
      active: i === 0,
    })),
  }

  return (
    <DynamicMainLayout dynamicSidebar={sidebarConfig}>
      <div className="space-y-12">
        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <div key={sectionIndex}>
            <section className="scroll-mt-6 space-y-6">
              <div>
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-4 w-64 mb-6" />
              </div>

              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {Array.from({ length: 4 }).map((_, cardIndex) => (
                  <EventCardSkeleton key={cardIndex} />
                ))}
              </div>
            </section>
            
            {sectionIndex < 2 && (
              <div className="pt-8">
                <Skeleton className="h-px w-full" />
              </div>
            )}
          </div>
        ))}
      </div>
    </DynamicMainLayout>
  )
}