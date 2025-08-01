import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import config from "@payload-config"
import { unstable_cache } from "next/cache"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPayload } from "payload"
import type { ResearchDemo, ResearchArea, Media } from "../../../../payload-types"
import { ArrowLeft, ExternalLink } from "lucide-react"

interface ResearchDemoWithRelations extends ResearchDemo {
  researchArea: ResearchArea
  thumbnail?: Media
  gallery?: Array<{ image: Media; caption?: string }>
}

const getResearchDemoById = unstable_cache(
  async (id: string): Promise<ResearchDemoWithRelations | null> => {
    try {
      const payload = await getPayload({ config })
      
      const demo = await payload.findByID({
        collection: 'research-demos',
        id: parseInt(id),
        depth: 2, // Populate relations
      })

      return demo as ResearchDemoWithRelations
    } catch (error) {
      console.error('Error fetching research demo:', error)
      return null
    }
  },
  ['research-demo-detail'],
  {
    tags: ['research-demos', 'research'],
    revalidate: 3600, // 1 hour
  }
)

const getAllResearchDemoIds = unstable_cache(
  async (): Promise<string[]> => {
    try {
      const payload = await getPayload({ config })
      
      const result = await payload.find({
        collection: 'research-demos',
        limit: 1000,
        pagination: false,
      })

      return result.docs.map(demo => demo.id.toString())
    } catch (error) {
      console.error('Error fetching research demo IDs:', error)
      return []
    }
  },
  ['research-demo-ids'],
  {
    tags: ['research-demos'],
    revalidate: 3600,
  }
)

export async function generateStaticParams() {
  const ids = await getAllResearchDemoIds()
  
  return ids.map((id) => ({
    id: id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const demo = await getResearchDemoById(id)
  
  if (!demo) {
    return {
      title: 'Research Demo Not Found',
    }
  }

  return {
    title: `${demo.title} - BCMI Research`,
    description: demo.description || `Research demo in ${demo.researchArea.title}`,
    openGraph: {
      title: demo.title,
      description: demo.description || `Research demo in ${demo.researchArea.title}`,
      images: demo.thumbnail && typeof demo.thumbnail === 'object' && demo.thumbnail.url
        ? [{ url: demo.thumbnail.url }]
        : undefined,
    },
  }
}

export default async function ResearchDemoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const demo = await getResearchDemoById(id)

  if (!demo) {
    notFound()
  }

  const thumbnailUrl = demo.thumbnail && typeof demo.thumbnail === 'object' && demo.thumbnail.url 
    ? demo.thumbnail.url 
    : null

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/research">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Research
        </Button>
      </Link>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="space-y-6">
          {thumbnailUrl && (
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src={thumbnailUrl}
                alt={demo.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority
              />
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{demo.researchArea.title}</Badge>
            </div>
            
            <h1 className="text-4xl font-bold">{demo.title}</h1>
            
            {demo.description && typeof demo.description === 'string' && (
              <p className="text-xl text-muted-foreground">{demo.description}</p>
            )}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Basic demo information - using available fields */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Demo Information</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>This research demo showcases work from the {demo.researchArea.title} research area.</p>
                  {demo.description && (
                    <p className="whitespace-pre-line mt-4">{demo.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Research Details</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium mb-1">Research Area</p>
                  <Link 
                    href={`/research#${demo.researchArea.anchor}`}
                    className="text-primary hover:underline"
                  >
                    {demo.researchArea.title}
                  </Link>
                </div>

                <div>
                  <p className="font-medium mb-1">Type</p>
                  <p className="text-sm text-muted-foreground">Research Demo</p>
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Resources</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {demo.demoUrl && (
                  <a 
                    href={demo.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Demo
                    </Button>
                  </a>
                )}

              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}