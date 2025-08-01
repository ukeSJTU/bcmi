import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import config from "@payload-config"
import { unstable_cache } from "next/cache"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPayload } from "payload"
import type { Event, Media } from "../../../../payload-types"
import { ArrowLeft, Calendar, MapPin } from "lucide-react"
import { format } from "date-fns"

interface EventWithRelations extends Event {
  featuredImage?: Media
  gallery?: Array<{ image: Media; caption?: string }>
  speakers?: Array<{
    name: string
    affiliation?: string
    bio?: string
    photo?: Media
  }>
}

const getEventById = unstable_cache(
  async (id: string): Promise<EventWithRelations | null> => {
    try {
      const payload = await getPayload({ config })
      
      const event = await payload.findByID({
        collection: 'events',
        id: parseInt(id),
        depth: 2, // Populate relations
      })

      return event as EventWithRelations
    } catch (error) {
      console.error('Error fetching event:', error)
      return null
    }
  },
  ['event-detail'],
  {
    tags: ['events'],
    revalidate: 3600, // 1 hour
  }
)

const getAllEventIds = unstable_cache(
  async (): Promise<string[]> => {
    try {
      const payload = await getPayload({ config })
      
      const result = await payload.find({
        collection: 'events',
        where: {
          isPublished: {
            equals: true,
          },
        },
        limit: 1000,
        pagination: false,
      })

      return result.docs.map(event => event.id.toString())
    } catch (error) {
      console.error('Error fetching event IDs:', error)
      return []
    }
  },
  ['event-ids'],
  {
    tags: ['events'],
    revalidate: 3600,
  }
)

export async function generateStaticParams() {
  const ids = await getAllEventIds()
  
  return ids.map((id) => ({
    id: id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await getEventById(id)
  
  if (!event) {
    return {
      title: 'Event Not Found',
    }
  }

  return {
    title: `${event.title} - BCMI Lab`,
    description: event.description || `${event.eventType} at BCMI Lab`,
    openGraph: {
      title: event.title,
      description: event.description || `${event.eventType} at BCMI Lab`,
      images: event.featuredImage && typeof event.featuredImage === 'object' && event.featuredImage.url
        ? [{ url: event.featuredImage.url }]
        : undefined,
    },
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await getEventById(id)

  if (!event) {
    notFound()
  }

  const featuredImageUrl = event.featuredImage && typeof event.featuredImage === 'object' && event.featuredImage.url 
    ? event.featuredImage.url 
    : null

  const startDate = new Date(event.startDate)
  const endDate = event.endDate ? new Date(event.endDate) : null

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/events">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
      </Link>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="space-y-6">
          {featuredImageUrl && (
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src={featuredImageUrl}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority
              />
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{event.eventType}</Badge>
              <Badge variant={event.status === 'upcoming' ? 'default' : event.status === 'ongoing' ? 'destructive' : 'outline'}>
                {event.status}
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold">{event.title}</h1>
            
            {event.description && typeof event.description === 'string' && (
              <p className="text-xl text-muted-foreground">{event.description}</p>
            )}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          {/* Main Content */}
          <div className="space-y-6">
            {event.summary && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold">About This Event</h2>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line">{event.summary}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {event.speakers && event.speakers.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Speakers</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event.speakers.map((speaker, index) => (
                      <div key={index} className="flex gap-4 p-4 border rounded-lg">
                        {speaker.photo && typeof speaker.photo === 'object' && speaker.photo.url && (
                          <div className="w-16 h-16 relative rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={speaker.photo.url}
                              alt={speaker.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold">{speaker.name}</h3>
                          {speaker.affiliation && (
                            <p className="text-sm text-muted-foreground">{speaker.affiliation}</p>
                          )}
                          {speaker.bio && (
                            <p className="text-sm mt-2">{speaker.bio}</p>
                          )}
                        </div>
                      </div>
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
                <h3 className="text-lg font-semibold">Event Details</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {format(startDate, 'MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(startDate, 'h:mm a')}
                      {endDate && ` - ${format(endDate, 'h:mm a')}`}
                    </p>
                  </div>
                </div>

                {event.location && typeof event.location === 'object' && event.location.venue && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {event.location.venue}
                        {event.location.address && (
                          <>
                            <br />
                            {event.location.address}
                          </>
                        )}
                        {event.location.room && (
                          <>
                            <br />
                            Room: {event.location.room}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="font-medium">Event Type</p>
                  <p className="text-sm text-muted-foreground capitalize">{event.eventType}</p>
                </div>
              </CardContent>
            </Card>

            {event.organizer && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Organizer</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{event.organizer}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}