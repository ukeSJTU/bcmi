import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import config from "@payload-config"
import { unstable_cache } from "next/cache"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPayload } from "payload"
import type { Media, Member, Position } from "../../../../payload-types"
import { ArrowLeft, Building2, Calendar, Globe, Mail, MapPin, Phone, User } from "lucide-react"

interface MemberWithRelations extends Member {
  position: Position
  mentor?: MemberWithRelations
  photo?: Media
}

const getMemberById = unstable_cache(
  async (id: string): Promise<MemberWithRelations | null> => {
    try {
      const payload = await getPayload({ config })
      
      const member = await payload.findByID({
        collection: 'members',
        id: parseInt(id),
        depth: 2, // Populate relations
      })

      return member as MemberWithRelations
    } catch (error) {
      console.error('Error fetching member:', error)
      return null
    }
  },
  ['member-detail'],
  {
    tags: ['members'],
    revalidate: 3600,
  }
)

const getAllMemberIds = unstable_cache(
  async (): Promise<string[]> => {
    try {
      const payload = await getPayload({ config })
      
      const result = await payload.find({
        collection: 'members',
        limit: 1000,
        pagination: false,
      })

      return result.docs.map(member => member.id.toString())
    } catch (error) {
      console.error('Error fetching member IDs:', error)
      return []
    }
  },
  ['member-ids'],
  {
    tags: ['members'],
    revalidate: 3600,
  }
)

export async function generateStaticParams() {
  const ids = await getAllMemberIds()
  
  return ids.map((id) => ({
    id: id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await getMemberById(id)
  
  if (!member) {
    return {
      title: 'Member Not Found',
    }
  }

  return {
    title: `${member.name} - BCMI Lab`,
    description: member.researchInterests || `${member.title || ''} at BCMI Lab`,
  }
}

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await getMemberById(id)

  if (!member) {
    notFound()
  }

  const photoUrl = member.photo && typeof member.photo === 'object' && member.photo.url 
    ? member.photo.url 
    : null

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/members">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Members
        </Button>
      </Link>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        {/* Left Column - Photo and Basic Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-square relative mb-4 bg-muted rounded-lg overflow-hidden">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <h1 className="text-2xl font-bold mb-2">{member.name}</h1>
              
              {member.title && (
                <p className="text-lg text-muted-foreground mb-4">{member.title}</p>
              )}
              
              <Badge variant="secondary" className="mb-4">
                {member.position.title}
              </Badge>

              {member.mentor && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Mentor</p>
                  <Link 
                    href={`/members/${member.mentor.id}`}
                    className="text-primary hover:underline"
                  >
                    {member.mentor.name}
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Contact Information</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {member.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <a 
                    href={`mailto:${member.email}`}
                    className="text-sm hover:underline break-all"
                  >
                    {member.email}
                  </a>
                </div>
              )}
              
              {member.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span className="text-sm">{member.phone}</span>
                </div>
              )}
              
              {member.officeLocation && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span className="text-sm">{member.officeLocation}</span>
                </div>
              )}
              
              {member.personalWebsite && (
                <div className="flex items-start gap-3">
                  <Globe className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <a 
                    href={member.personalWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline break-all"
                  >
                    {member.personalWebsite}
                  </a>
                </div>
              )}
              
              {member.department && (
                <div className="flex items-start gap-3">
                  <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span className="text-sm">{member.department}</span>
                </div>
              )}
              
              {member.joinDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span className="text-sm">
                    Joined {new Date(member.joinDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="space-y-8">
          {member.researchInterests && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Research Interests</h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">
                  {member.researchInterests}
                </p>
              </CardContent>
            </Card>
          )}

          {member.bio && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Biography</h2>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {/* Rich text content would be rendered here */}
                  <div className="text-muted-foreground">
                    {typeof member.bio === 'object' && member.bio.root && (
                      <p>Biography content available</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {member.education && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Education</h2>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {/* Rich text content would be rendered here */}
                  <div className="text-muted-foreground">
                    {typeof member.education === 'object' && member.education.root && (
                      <p>Education information available</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!member.isActive && (
            <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
              <CardContent className="pt-6">
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  This member is no longer active at BCMI Lab (Alumni)
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}