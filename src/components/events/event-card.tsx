import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Calendar, Clock, MapPin, Users, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
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

interface EventCardProps {
  event: EventWithRelations
  variant?: 'featured' | 'card' | 'compact'
}

export function EventCard({ event, variant = 'card' }: EventCardProps) {
  if (variant === 'featured') {
    return <FeaturedEventCard event={event} />
  }
  
  if (variant === 'compact') {
    return <CompactEventCard event={event} />
  }
  
  return <StandardEventCard event={event} />
}

function FeaturedEventCard({ event }: { event: EventWithRelations }) {
  const imageUrl = event.featuredImage && typeof event.featuredImage === 'object' 
    ? event.featuredImage.url 
    : null

  const startDate = new Date(event.startDate)
  const endDate = event.endDate ? new Date(event.endDate) : null

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      {imageUrl && (
        <div className="relative">
          <AspectRatio ratio={21 / 9}>
            <Image
              src={imageUrl}
              alt={event.title}
              fill
              className="object-cover"
            />
          </AspectRatio>
          <div className="absolute top-4 left-4">
            <Badge className="bg-blue-600 text-white">Featured Event</Badge>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className="capitalize">
            {event.eventType}
          </Badge>
          <Badge 
            variant={event.status === 'upcoming' ? 'default' : 
                     event.status === 'ongoing' ? 'destructive' : 'secondary'}
            className="capitalize"
          >
            {event.status}
          </Badge>
        </div>
        
        <CardTitle className="text-xl text-blue-600">
          {event.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {event.summary && (
          <p className="text-muted-foreground">
            {event.summary}
          </p>
        )}
        
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span>
              {startDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              {endDate && (
                <span> - {endDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              )}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>
              {startDate.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
              {endDate && (
                <span> - {endDate.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</span>
              )}
            </span>
          </div>
          
          {event.location?.venue && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>
                {event.location.venue}
                {event.location.room && `, ${event.location.room}`}
                {event.location.isOnline && (
                  <Badge variant="secondary" className="ml-2">Online</Badge>
                )}
              </span>
            </div>
          )}
          
          {event.organizer && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span>Organized by {event.organizer}</span>
            </div>
          )}
        </div>
        
        {event.externalLinks && event.externalLinks.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {event.externalLinks.slice(0, 2).map((link, index) => (
              <Button key={index} variant="outline" size="sm" asChild>
                <Link href={link.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  {link.title}
                </Link>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StandardEventCard({ event }: { event: EventWithRelations }) {
  const imageUrl = event.featuredImage && typeof event.featuredImage === 'object' 
    ? event.featuredImage.url 
    : null

  const startDate = new Date(event.startDate)
  const endDate = event.endDate ? new Date(event.endDate) : null

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {imageUrl && (
        <div className="relative">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={imageUrl}
              alt={event.title}
              fill
              className="object-cover"
            />
          </AspectRatio>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className="capitalize">
            {event.eventType}
          </Badge>
          <Badge 
            variant={event.status === 'upcoming' ? 'default' : 
                     event.status === 'ongoing' ? 'destructive' : 'secondary'}
            className="capitalize"
          >
            {event.status}
          </Badge>
        </div>
        
        <CardTitle className="text-lg">
          {event.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {event.summary && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.summary}
          </p>
        )}
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {startDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
              {endDate && endDate.toDateString() !== startDate.toDateString() && (
                <span> - {endDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              )}
            </span>
          </div>
          
          {event.location?.venue && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">
                {event.location.venue}
                {event.location.isOnline && (
                  <Badge variant="secondary" className="ml-2">Online</Badge>
                )}
              </span>
            </div>
          )}
        </div>
        
        {event.externalLinks && event.externalLinks.length > 0 && (
          <div className="pt-2">
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href={event.externalLinks[0].url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                {event.externalLinks[0].title}
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CompactEventCard({ event }: { event: EventWithRelations }) {
  const startDate = new Date(event.startDate)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0 text-center">
            <div className="bg-blue-50 rounded-lg p-2 min-w-[60px]">
              <div className="text-xs font-medium text-blue-600 uppercase">
                {startDate.toLocaleDateString('en-US', { month: 'short' })}
              </div>
              <div className="text-lg font-bold text-blue-600">
                {startDate.getDate()}
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1 mb-1">
              <Badge variant="outline" className="text-xs capitalize">
                {event.eventType}
              </Badge>
              <Badge 
                variant={event.status === 'upcoming' ? 'default' : 'secondary'}
                className="text-xs capitalize"
              >
                {event.status}
              </Badge>
            </div>
            
            <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">
              {event.title}
            </h3>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {startDate.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              
              {event.location?.venue && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{event.location.venue}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}