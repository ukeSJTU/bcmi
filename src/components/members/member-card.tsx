'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Globe, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Member, Position, Media } from "../../payload-types"

// Extended member type with populated relations
interface MemberWithRelations extends Member {
  position: Position
  mentor?: MemberWithRelations
  photo?: Media
}

interface MemberCardProps {
  member: MemberWithRelations
  variant?: 'detailed' | 'compact'
}

export function MemberCard({ member, variant = 'detailed' }: MemberCardProps) {
  if (variant === 'compact') {
    return <CompactMemberCard member={member} />
  }
  
  return <DetailedMemberCard member={member} />
}

function CompactMemberCard({ member }: { member: MemberWithRelations }) {
  const imageUrl = member.photo && typeof member.photo === 'object' ? member.photo.url : null
  
  return (
    <Link href={`/members/${member.id}`} className="block">
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4 text-center">
          <div className="mb-3">
            <div className="w-20 h-20 mx-auto relative rounded-full overflow-hidden bg-muted">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-medium text-muted-foreground">
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-center leading-tight">
              {member.name}
            </h3>
            {member.title && (
              <p className="text-xs text-muted-foreground mt-1">
                {member.title}
              </p>
            )}
          </div>
          
          {member.email && (
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => {
                  e.preventDefault()
                  window.location.href = `mailto:${member.email}`
                }}
              >
                <Mail className="h-3 w-3 mr-1" />
                Contact
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

function DetailedMemberCard({ member }: { member: MemberWithRelations }) {
  const imageUrl = member.photo && typeof member.photo === 'object' ? member.photo.url : null
  
  return (
    <Link href={`/members/${member.id}`} className="block">
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Photo */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-muted">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xl font-medium text-muted-foreground">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="mb-3">
                <h3 className="text-xl font-semibold text-blue-600 mb-1 hover:text-blue-800">
                  {member.name}
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {member.title && (
                    <Badge variant="secondary">{member.title}</Badge>
                  )}
                  <Badge variant="outline">{member.position.title}</Badge>
                </div>
                
                {member.department && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {member.department}
                  </p>
                )}
              </div>
              
              {member.researchInterests && (
                <div className="mb-4">
                  <p className="text-sm">
                    <strong>Research Interests:</strong> {member.researchInterests}
                  </p>
                </div>
              )}
              
              {/* Contact Info */}
              <div className="flex flex-wrap gap-3 text-sm">
                {member.email && (
                  <span 
                    onClick={(e) => {
                      e.preventDefault()
                      window.location.href = `mailto:${member.email}`
                    }}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Mail className="h-4 w-4" />
                    {member.email}
                  </span>
                )}
                
                {member.personalWebsite && (
                  <span 
                    onClick={(e) => {
                      e.preventDefault()
                      window.open(member.personalWebsite!, '_blank', 'noopener,noreferrer')
                    }}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </span>
                )}
                
                {member.officeLocation && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {member.officeLocation}
                  </span>
                )}
                
                {member.phone && (
                  <span 
                    onClick={(e) => {
                      e.preventDefault()
                      window.location.href = `tel:${member.phone}`
                    }}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Phone className="h-4 w-4" />
                    {member.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}