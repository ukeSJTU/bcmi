import { DynamicMainLayout } from "@/components/layout"
import { EventSection } from "@/components/events"
import { Separator } from "@/components/ui/separator"
import config from "@payload-config"
import { unstable_cache } from "next/cache"
import { getPayload } from "payload"
import type { Event, Media } from "../../../payload-types"

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

interface EventCategory {
  title: string
  anchor: string
  description?: string
  events: EventWithRelations[]
}

const getEventsData = unstable_cache(
  async (): Promise<{
    eventCategories: EventCategory[]
    sidebarItems: Array<{ title: string; anchor: string; active?: boolean }>
  }> => {
    try {
      const payload = await getPayload({ config })
      
      // Fetch all published events
      console.log('🔍 Fetching events from database...')
      const eventsResult = await payload.find({
        collection: 'events',
        where: {
          isPublished: {
            equals: true,
          },
        },
        sort: '-startDate', // Most recent first
        limit: 1000,
        depth: 2, // Populate media relations
      })

      console.log(`📊 Found ${eventsResult.docs.length} published events`)
      console.log('📋 Event titles:', eventsResult.docs.map(e => e.title))

      const allEvents = eventsResult.docs as EventWithRelations[]

      // Categorize events by status and type
      const now = new Date()
      console.log('🕐 Current time:', now.toISOString())
      
      // Upcoming events (start date is in the future)
      const upcomingEvents = allEvents.filter(event => 
        new Date(event.startDate) > now && event.status === 'upcoming'
      )
      console.log(`🚀 Upcoming events: ${upcomingEvents.length}`)
      
      // Ongoing events (current date is between start and end)
      const ongoingEvents = allEvents.filter(event => {
        const startDate = new Date(event.startDate)
        const endDate = event.endDate ? new Date(event.endDate) : startDate
        return startDate <= now && endDate >= now && event.status === 'ongoing'
      })
      console.log(`⏳ Ongoing events: ${ongoingEvents.length}`)
      
      // Completed events (end date is in the past or status is completed)
      const completedEvents = allEvents.filter(event => {
        const endDate = event.endDate ? new Date(event.endDate) : new Date(event.startDate)
        return endDate < now || event.status === 'completed'
      }).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()) // Most recent first
      console.log(`✅ Completed events: ${completedEvents.length}`)

      // Group by event type for additional categorization
      const eventsByType = allEvents.reduce((acc, event) => {
        if (!acc[event.eventType]) {
          acc[event.eventType] = []
        }
        acc[event.eventType].push(event)
        return acc
      }, {} as Record<string, EventWithRelations[]>)

      // Create categories
      const eventCategories: EventCategory[] = []
      
      // Add main status-based categories
      if (upcomingEvents.length > 0) {
        eventCategories.push({
          title: "Upcoming Events",
          anchor: "upcoming",
          description: "Events scheduled for the future",
          events: upcomingEvents.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) // Earliest first
        })
      }
      
      if (ongoingEvents.length > 0) {
        eventCategories.push({
          title: "Current Events",
          anchor: "current",
          description: "Events happening now",
          events: ongoingEvents
        })
      }
      
      if (completedEvents.length > 0) {
        eventCategories.push({
          title: "Past Events",
          anchor: "past",
          description: "Previously held events and activities",
          events: completedEvents.slice(0, 50) // Limit to 50 most recent past events
        })
      }

      // Add type-based categories for variety (optional - only if we have many events)
      const eventTypeLabels: Record<string, string> = {
        conference: "Conferences",
        workshop: "Workshops", 
        seminar: "Seminars",
        symposium: "Symposiums",
        lecture: "Lectures",
        competition: "Competitions",
        meeting: "Meetings",
        other: "Other Events"
      }

      // Only add type categories if we have many events to avoid clutter
      if (allEvents.length > 20) {
        Object.entries(eventsByType).forEach(([type, events]) => {
          if (events.length >= 3) { // Only show types with multiple events
            eventCategories.push({
              title: eventTypeLabels[type] || `${type.charAt(0).toUpperCase()}${type.slice(1)} Events`,
              anchor: `type-${type}`,
              events: events.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
            })
          }
        })
      }

      // Generate sidebar items
      const sidebarItems = eventCategories.map((category, index) => ({
        title: category.title,
        anchor: category.anchor,
        active: index === 0, // First item active by default
      }))

      console.log(`📂 Created ${eventCategories.length} event categories`)
      console.log('📋 Categories:', eventCategories.map(c => `${c.title} (${c.events.length} events)`))

      return { eventCategories, sidebarItems }
    } catch (error) {
      console.error('Error fetching events data:', error)
      return { 
        eventCategories: [], 
        sidebarItems: [
          { title: "Upcoming Events", anchor: "upcoming", active: true },
          { title: "Past Events", anchor: "past" },
          { title: "Conferences", anchor: "conferences" },
          { title: "Workshops", anchor: "workshops" },
        ]
      }
    }
  },
  ['events-data-debug'], // cache key - changed to force refresh
  {
    tags: ['events'], // cache tags for revalidation
    revalidate: 1800 // cache for 30 minutes (events change more frequently)
  }
)

export default async function Events() {
  const { eventCategories, sidebarItems } = await getEventsData()

  const dynamicSidebarConfig = {
    title: "EVENT CATEGORIES",
    items: sidebarItems,
  }

  return (
    <DynamicMainLayout dynamicSidebar={dynamicSidebarConfig}>
      <div className="space-y-12">
        {eventCategories.length > 0 ? (
          eventCategories.map((category, index) => (
            <div key={category.anchor}>
              <EventSection 
                title={category.title}
                anchor={category.anchor}
                events={category.events}
                description={category.description}
              />
              
              {index < eventCategories.length - 1 && (
                <div className="pt-8">
                  <Separator />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">No Events Found</h2>
            <p className="text-muted-foreground">
              Events will appear here once they are added through the admin panel.
            </p>
          </div>
        )}
      </div>
    </DynamicMainLayout>
  )
}