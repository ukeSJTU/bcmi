import { DynamicMainLayout } from "@/components/layout"
import { ResearchSection } from "@/components/research"
import { Separator } from "@/components/ui/separator"
import type { ResearchArea, ResearchDemo } from "@/payload-types"
import config from "@payload-config"
import { unstable_cache } from "next/cache"
import { getPayload } from "payload"

// Extend ResearchArea to include populated demos
interface ResearchAreaWithDemos extends ResearchArea {
  demos: ResearchDemo[]
}

const getResearchData = unstable_cache(
  async (): Promise<{
    researchAreas: ResearchAreaWithDemos[]
    sidebarItems: Array<{ title: string; anchor: string; active?: boolean }>
  }> => {
    try {
      const payload = await getPayload({ config })
      
      // Fetch research areas with their demos
    const researchAreasResult = await payload.find({
      collection: 'research-areas',
      where: {
        isVisible: {
          equals: true,
        },
      },
      sort: 'order',
      limit: 100,
    })

    // Fetch all demos and group by research area
    const demosResult = await payload.find({
      collection: 'research-demos',
      sort: 'order',
      limit: 1000,
      depth: 2, // Include media relations
    })

    // Group demos by research area
    const demosByArea = demosResult.docs.reduce((acc, demo: ResearchDemo) => {
      const areaId = typeof demo.researchArea === 'object' 
        ? String(demo.researchArea.id)
        : String(demo.researchArea)
      
      if (!acc[areaId]) {
        acc[areaId] = []
      }
      
      acc[areaId].push(demo)
      
      return acc
    }, {} as Record<string, ResearchDemo[]>)

    // Transform research areas data
    const researchAreas: ResearchAreaWithDemos[] = researchAreasResult.docs.map((area: ResearchArea) => ({
      ...area,
      demos: demosByArea[String(area.id)] || [],
    }))

    // Generate sidebar items
    const sidebarItems = researchAreas.map((area, index) => ({
      title: area.title,
      anchor: area.anchor,
      active: index === 0, // First item active by default
    }))

    return { researchAreas, sidebarItems }
  } catch (error) {
    console.error('Error fetching research data:', error)
    return { 
      researchAreas: [], 
      sidebarItems: [
        { title: "Brain Computer Interface and EEG Data Processing", anchor: "bci", active: true },
        { title: "Computer Vision", anchor: "cv" },
        { title: "Speech Recognition", anchor: "speech" },
        { title: "Natural Language Processing", anchor: "nlp" },
      ]
    }
  }
},
['research-data'], // cache key
{
  tags: ['research', 'research-areas', 'research-demos'], // cache tags for revalidation
  revalidate: 3600 // cache for 1 hour by default
}
)

export default async function Research() {
  const { researchAreas, sidebarItems } = await getResearchData()

  const dynamicSidebarConfig = {
    title: "RESEARCH TOPICS",
    items: sidebarItems,
  }

  return (
    <DynamicMainLayout dynamicSidebar={dynamicSidebarConfig}>
      <div className="space-y-12">
        {researchAreas.length > 0 ? (
          researchAreas.map((area, index) => (
            <div key={area.id}>
              <ResearchSection researchArea={area} />
              {index < researchAreas.length - 1 && (
                <div className="pt-8">
                  <Separator />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">No Research Areas Found</h2>
            <p className="text-muted-foreground">
              Research areas will appear here once they are added through the admin panel.
            </p>
          </div>
        )}
      </div>
    </DynamicMainLayout>
  )
}