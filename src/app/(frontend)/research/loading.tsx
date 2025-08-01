import { DynamicMainLayout } from "@/components/layout"
import { ResearchSectionSkeleton } from "@/components/ui/loading-skeletons"
import { Skeleton } from "@/components/ui/skeleton"

export default function ResearchLoading() {
  const sidebarConfig = {
    title: "RESEARCH TOPICS",
    items: Array.from({ length: 4 }, (_, i) => ({
      title: `Topic ${i + 1}`,
      anchor: `topic-${i + 1}`,
      active: i === 0,
    })),
  }

  return (
    <DynamicMainLayout dynamicSidebar={sidebarConfig}>
      <div className="space-y-12">
        {Array.from({ length: 4 }).map((_, sectionIndex) => (
          <div key={sectionIndex}>
            <ResearchSectionSkeleton />
            
            {sectionIndex < 3 && (
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