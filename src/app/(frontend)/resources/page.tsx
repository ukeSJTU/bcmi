import { DynamicMainLayout } from "@/components/layout"
import { ResourceSection } from "@/components/resources"
import { Separator } from "@/components/ui/separator"
import config from "@payload-config"
import { unstable_cache } from "next/cache"
import { getPayload } from "payload"
import type { Media } from "../../../payload-types"

// Extended resource type with populated relations
interface ResourceWithRelations {
  id: number
  title: string
  slug: string
  description?: unknown
  summary?: string | null
  resourceType: 'dataset' | 'software' | 'course' | 'tutorial' | 'documentation' | 'publication' | 'code' | 'other'
  category?: string | null
  tags?: Array<{ tag: string; id?: string | null }> | null
  featuredImage?: Media
  gallery?: Array<{ image: Media; caption?: string }>
  downloadInfo?: {
    hasDownload?: boolean
    file?: Media
    downloadUrl?: string
    fileSize?: string
    format?: string
    requirements?: string
  }
  courseInfo?: {
    isCourse?: boolean
    instructor?: string
    duration?: string
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    prerequisites?: string
    syllabus?: unknown
  }
  publicationInfo?: {
    isPublication?: boolean
    authors?: string
    journal?: string
    year?: number
    doi?: string
    abstract?: unknown
  }
  links?: Array<{
    title: string
    url: string
    type: 'website' | 'github' | 'docs' | 'demo' | 'download' | 'publication' | 'video' | 'other'
  }>
  displayOrder?: number | null
  isPublished?: boolean | null
  isFeatured?: boolean | null
  accessLevel?: 'public' | 'members' | 'restricted' | null
  downloadCount?: number | null
  viewCount?: number | null
  updatedAt: string
  createdAt: string
}

interface ResourceCategory {
  title: string
  anchor: string
  description?: string
  resources: ResourceWithRelations[]
  layout?: 'grid' | 'table'
}

const getResourcesData = unstable_cache(
  async (): Promise<{
    resourceCategories: ResourceCategory[]
    sidebarItems: Array<{ title: string; anchor: string; active?: boolean }>
  }> => {
    try {
      const payload = await getPayload({ config })
      
      // Fetch all published resources
      const resourcesResult = await payload.find({
        collection: 'resources',
        where: {
          isPublished: {
            equals: true,
          },
        },
        sort: 'displayOrder',
        limit: 1000,
        depth: 2, // Populate media relations
      })

      const allResources = resourcesResult.docs as ResourceWithRelations[]

      // Group resources by type and category
      const resourcesByType = allResources.reduce((acc, resource) => {
        if (!acc[resource.resourceType]) {
          acc[resource.resourceType] = []
        }
        acc[resource.resourceType].push(resource)
        return acc
      }, {} as Record<string, ResourceWithRelations[]>)

      // Group resources by category
      const resourcesByCategory = allResources.reduce((acc, resource) => {
        const category = resource.category || 'Uncategorized'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(resource)
        return acc
      }, {} as Record<string, ResourceWithRelations[]>)

      // Create categories
      const resourceCategories: ResourceCategory[] = []

      // Type-based categories with specific layouts
      const typeCategories = [
        {
          type: 'dataset',
          title: 'Data Sets',
          description: 'Research datasets and corpora for machine learning and AI research',
          layout: 'table' as const
        },
        {
          type: 'course',
          title: 'Courses & Tutorials',
          description: 'Educational content, courses, and learning materials',
          layout: 'grid' as const
        },
        {
          type: 'tutorial',
          title: 'Tutorials & Guides',
          description: 'Step-by-step guides and tutorials',
          layout: 'grid' as const
        },
        {
          type: 'software',
          title: 'Software & Tools',
          description: 'Research software, tools, and applications',
          layout: 'grid' as const
        },
        {
          type: 'publication',
          title: 'Publications & Papers',
          description: 'Research publications and academic papers',
          layout: 'grid' as const
        },
        {
          type: 'code',
          title: 'Code Repositories',
          description: 'Source code and implementation repositories',
          layout: 'grid' as const
        }
      ]

      // Add type-based categories
      typeCategories.forEach(({ type, title, description, layout }) => {
        if (resourcesByType[type] && resourcesByType[type].length > 0) {
          resourceCategories.push({
            title,
            anchor: type,
            description,
            resources: resourcesByType[type].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
            layout
          })
        }
      })

      // Add category-based groupings if we have many resources
      if (allResources.length > 20) {
        Object.entries(resourcesByCategory).forEach(([category, resources]) => {
          if (resources.length >= 3 && category !== 'Uncategorized') {
            resourceCategories.push({
              title: category,
              anchor: `category-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
              resources: resources.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
              layout: 'grid'
            })
          }
        })
      }

      // Add featured resources section if any exist
      const featuredResources = allResources.filter(resource => resource.isFeatured)
      if (featuredResources.length > 0) {
        resourceCategories.unshift({
          title: 'Featured Resources',
          anchor: 'featured',
          description: 'Highlighted resources and popular downloads',
          resources: featuredResources,
          layout: 'grid'
        })
      }

      // Generate sidebar items
      const sidebarItems = resourceCategories.map((category, index) => ({
        title: category.title,
        anchor: category.anchor,
        active: index === 0, // First item active by default
      }))

      return { resourceCategories, sidebarItems }
    } catch (error) {
      console.error('Error fetching resources data:', error)
      return { 
        resourceCategories: [], 
        sidebarItems: [
          { title: "Data Sets", anchor: "dataset", active: true },
          { title: "Courses & Tutorials", anchor: "course" },
          { title: "Software & Tools", anchor: "software" },
          { title: "Publications", anchor: "publication" },
        ]
      }
    }
  },
  ['resources-data'], // cache key
  {
    tags: ['resources'], // cache tags for revalidation
    revalidate: 3600 // cache for 1 hour
  }
)

export default async function Resources() {
  const { resourceCategories, sidebarItems } = await getResourcesData()

  const dynamicSidebarConfig = {
    title: "RESOURCE CATEGORIES",
    items: sidebarItems,
  }

  return (
    <DynamicMainLayout dynamicSidebar={dynamicSidebarConfig}>
      <div className="space-y-12">
        {resourceCategories.length > 0 ? (
          resourceCategories.map((category, index) => (
            <div key={category.anchor}>
              <ResourceSection 
                title={category.title}
                anchor={category.anchor}
                resources={category.resources}
                description={category.description}
                layout={category.layout}
              />
              
              {index < resourceCategories.length - 1 && (
                <div className="pt-8">
                  <Separator />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">No Resources Found</h2>
            <p className="text-muted-foreground">
              Resources will appear here once they are added through the admin panel.
            </p>
          </div>
        )}
      </div>
    </DynamicMainLayout>
  )
}