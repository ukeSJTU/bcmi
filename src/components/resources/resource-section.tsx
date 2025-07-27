import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ResourceCard } from "./resource-card"
import type { Media } from "@/payload-types"

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

interface ResourceSectionProps {
  title: string
  anchor: string
  resources: ResourceWithRelations[]
  description?: string
  emptyMessage?: string
  layout?: 'grid' | 'table'
}

export function ResourceSection({ 
  title, 
  anchor, 
  resources, 
  description,
  emptyMessage = "No resources found in this category.",
  layout = 'grid'
}: ResourceSectionProps) {
  // Separate featured resources from regular resources
  const featuredResources = resources.filter(resource => resource.isFeatured)
  const regularResources = resources.filter(resource => !resource.isFeatured)

  if (layout === 'table') {
    return <TableResourceSection 
      title={title}
      anchor={anchor}
      resources={resources}
      description={description}
      emptyMessage={emptyMessage}
    />
  }

  return (
    <section 
      id={anchor} 
      className="scroll-mt-6 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {title}
          {resources.length > 0 && (
            <Badge variant="secondary" className="ml-3">
              {resources.length} {resources.length === 1 ? 'resource' : 'resources'}
            </Badge>
          )}
        </h2>
        
        {description && (
          <p className="text-muted-foreground mb-6">
            {description}
          </p>
        )}
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Featured Resources */}
          {featuredResources.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600">Featured Resources</h3>
              <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
                {featuredResources.map((resource) => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource}
                    variant="featured"
                  />
                ))}
              </div>
              
              {regularResources.length > 0 && (
                <Separator className="my-6" />
              )}
            </div>
          )}
          
          {/* Regular Resources */}
          {regularResources.length > 0 && (
            <div className="space-y-4">
              {featuredResources.length > 0 && (
                <h3 className="text-lg font-semibold">All Resources</h3>
              )}
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {regularResources.map((resource) => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource}
                    variant="card"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function TableResourceSection({ 
  title, 
  anchor, 
  resources, 
  description,
  emptyMessage 
}: Omit<ResourceSectionProps, 'layout'>) {
  return (
    <section 
      id={anchor} 
      className="scroll-mt-6 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {title}
          {resources.length > 0 && (
            <Badge variant="secondary" className="ml-3">
              {resources.length} {resources.length === 1 ? 'resource' : 'resources'}
            </Badge>
          )}
        </h2>
        
        {description && (
          <p className="text-muted-foreground mb-6">
            {description}
          </p>
        )}
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-border rounded-lg">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Type</th>
                <th className="text-left p-4 font-semibold">Size/Info</th>
                <th className="text-left p-4 font-semibold">Description</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource, index) => (
                <tr key={resource.id} className={index < resources.length - 1 ? "border-b" : ""}>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-blue-600">{resource.title}</div>
                      {resource.category && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {resource.category}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary" className="capitalize">
                      {resource.resourceType}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm">
                    {resource.downloadInfo?.hasDownload && resource.downloadInfo.fileSize ? (
                      <div>
                        <div>{resource.downloadInfo.fileSize}</div>
                        {resource.downloadInfo.format && (
                          <div className="text-xs text-muted-foreground">
                            {resource.downloadInfo.format}
                          </div>
                        )}
                      </div>
                    ) : resource.courseInfo?.isCourse && resource.courseInfo.duration ? (
                      <div>
                        <div>{resource.courseInfo.duration}</div>
                        <div className="text-xs text-muted-foreground">
                          {resource.courseInfo.difficulty}
                        </div>
                      </div>
                    ) : resource.publicationInfo?.isPublication && resource.publicationInfo.year ? (
                      <div className="text-sm">
                        {resource.publicationInfo.year}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="p-4 text-sm">
                    <div className="line-clamp-2">
                      {resource.summary || 'No description available.'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {resource.downloadInfo?.hasDownload && (
                        <a
                          href={resource.downloadInfo.downloadUrl || (resource.downloadInfo.file && typeof resource.downloadInfo.file === 'object' ? resource.downloadInfo.file.url! : '#')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Download
                        </a>
                      )}
                      
                      {resource.links && resource.links.length > 0 && (
                        <a
                          href={resource.links[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {resource.links[0].title}
                        </a>
                      )}
                      
                      <button className="text-blue-600 hover:underline text-sm">
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}