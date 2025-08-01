import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import config from "@payload-config"
import { unstable_cache } from "next/cache"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPayload } from "payload"
import type { Resource, Media } from "../../../../payload-types"
import { ArrowLeft, ExternalLink } from "lucide-react"

interface ResourceWithRelations extends Resource {
  thumbnail?: Media
  attachments?: Array<{ file: Media; title?: string }>
}

const getResourceById = unstable_cache(
  async (id: string): Promise<ResourceWithRelations | null> => {
    try {
      const payload = await getPayload({ config })
      
      const resource = await payload.findByID({
        collection: 'resources',
        id: parseInt(id),
        depth: 2, // Populate relations
      })

      return resource as ResourceWithRelations
    } catch (error) {
      console.error('Error fetching resource:', error)
      return null
    }
  },
  ['resource-detail'],
  {
    tags: ['resources'],
    revalidate: 3600, // 1 hour
  }
)

const getAllResourceIds = unstable_cache(
  async (): Promise<string[]> => {
    try {
      const payload = await getPayload({ config })
      
      const result = await payload.find({
        collection: 'resources',
        where: {
          isPublished: {
            equals: true,
          },
        },
        limit: 1000,
        pagination: false,
      })

      return result.docs.map(resource => resource.id.toString())
    } catch (error) {
      console.error('Error fetching resource IDs:', error)
      return []
    }
  },
  ['resource-ids'],
  {
    tags: ['resources'],
    revalidate: 3600,
  }
)

export async function generateStaticParams() {
  const ids = await getAllResourceIds()
  
  return ids.map((id) => ({
    id: id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const resource = await getResourceById(id)
  
  if (!resource) {
    return {
      title: 'Resource Not Found',
    }
  }

  return {
    title: `${resource.title} - BCMI Resources`,
    description: resource.description || `${resource.resourceType} resource from BCMI Lab`,
    openGraph: {
      title: resource.title,
      description: resource.description || `${resource.resourceType} resource from BCMI Lab`,
      images: resource.thumbnail && typeof resource.thumbnail === 'object' && resource.thumbnail.url
        ? [{ url: resource.thumbnail.url }]
        : undefined,
    },
  }
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const resource = await getResourceById(id)

  if (!resource) {
    notFound()
  }

  const thumbnailUrl = resource.thumbnail && typeof resource.thumbnail === 'object' && resource.thumbnail.url 
    ? resource.thumbnail.url 
    : null

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/resources">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Resources
        </Button>
      </Link>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="space-y-6">
          {thumbnailUrl && (
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src={thumbnailUrl}
                alt={resource.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority
              />
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{resource.resourceType}</Badge>
              <Badge variant={resource.accessLevel === 'public' ? 'default' : 'outline'}>
                {resource.accessLevel}
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold">{resource.title}</h1>
            
            {resource.description && typeof resource.description === 'string' && (
              <p className="text-xl text-muted-foreground">{resource.description}</p>
            )}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          {/* Main Content */}
          <div className="space-y-6">
            {resource.summary && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold">About This Resource</h2>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line">{resource.summary}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {resource.tags && resource.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Tags</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {typeof tag === 'string' ? tag : tag.tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Resource Details</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium mb-1">Type</p>
                  <p className="text-sm text-muted-foreground capitalize">{resource.resourceType}</p>
                </div>

                <div>
                  <p className="font-medium mb-1">Access Level</p>
                  <p className="text-sm text-muted-foreground capitalize">{resource.accessLevel}</p>
                </div>

                <div>
                  <p className="font-medium mb-1">Category</p>
                  <p className="text-sm text-muted-foreground capitalize">{resource.category || 'General'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            {resource.links && resource.links.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Links</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {resource.links.map((link, index) => (
                    <a 
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {link.title}
                      </Button>
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}