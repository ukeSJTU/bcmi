import { DynamicMainLayout } from "@/components/layout"
import { ResearchSection } from "@/components/research"
import { Separator } from "@/components/ui/separator"
import type { Demo, ResearchArea } from "@/types/research"
import config from "@payload-config"
import { getPayload } from "payload"

async function getResearchData(): Promise<{
  researchAreas: ResearchArea[]
  sidebarItems: Array<{ title: string; anchor: string; active?: boolean }>
}> {
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
    const demosByArea = demosResult.docs.reduce((acc, demo) => {
      const areaId = typeof demo.researchArea === 'object' 
        ? String(demo.researchArea.id)
        : String(demo.researchArea)
      
      if (!acc[areaId]) {
        acc[areaId] = []
      }
      
      acc[areaId].push({
        id: String(demo.id),
        title: demo.title,
        description: demo.description,
        image: demo.image ? {
          url: typeof demo.image === 'object' ? demo.image.url : '',
          alt: typeof demo.image === 'object' ? demo.image.alt : '',
        } : undefined,
        demoUrl: demo.demoUrl,
        isExternal: demo.isExternal,
        order: demo.order,
      } as Demo)
      
      return acc
    }, {} as Record<string, Demo[]>)

    // Transform research areas data
    const researchAreas: ResearchArea[] = researchAreasResult.docs.map(area => ({
      id: String(area.id),
      title: area.title,
      anchor: area.anchor,
      description: area.description,
      bulletPoints: area.bulletPoints,
      order: area.order,
      isVisible: area.isVisible,
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
}

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