import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { SectionErrorBoundary } from "@/components/ui/error-boundary"
import { EventCard } from "./event-card"
import type { Event, Media } from "@/payload-types"

// Extended event type with populated relations
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

interface EventSectionProps {
  title: string
  anchor: string
  events: EventWithRelations[]
  description?: string
  emptyMessage?: string
}

export function EventSection({ 
  title, 
  anchor, 
  events, 
  description,
  emptyMessage = "No events found in this category."
}: EventSectionProps) {
  // Separate featured events from regular events
  const featuredEvents = events.filter(event => event.isFeatured)
  const regularEvents = events.filter(event => !event.isFeatured)

  return (
    <SectionErrorBoundary sectionName={title}>
      <section 
        id={anchor} 
        className="scroll-mt-6 space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {title}
            {events.length > 0 && (
              <Badge variant="secondary" className="ml-3">
                {events.length} {events.length === 1 ? 'event' : 'events'}
              </Badge>
            )}
          </h2>
          
          {description && (
            <p className="text-muted-foreground mb-6">
              {description}
            </p>
          )}
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured Events */}
            {featuredEvents.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600">Featured Events</h3>
                <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
                  {featuredEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event}
                      variant="featured"
                    />
                  ))}
                </div>
                
                {regularEvents.length > 0 && (
                  <Separator className="my-6" />
                )}
              </div>
            )}
            
            {/* Regular Events */}
            {regularEvents.length > 0 && (
              <div className="space-y-4">
                {featuredEvents.length > 0 && (
                  <h3 className="text-lg font-semibold">All Events</h3>
                )}
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {regularEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event}
                      variant="card"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </SectionErrorBoundary>
  )
}