import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Download, ExternalLink, FileText, GraduationCap, Database, Code, Eye, Calendar, User, BookOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
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

interface ResourceCardProps {
  resource: ResourceWithRelations
  variant?: 'featured' | 'card' | 'compact'
}

export function ResourceCard({ resource, variant = 'card' }: ResourceCardProps) {
  if (variant === 'featured') {
    return <FeaturedResourceCard resource={resource} />
  }
  
  if (variant === 'compact') {
    return <CompactResourceCard resource={resource} />
  }
  
  return <StandardResourceCard resource={resource} />
}

function FeaturedResourceCard({ resource }: { resource: ResourceWithRelations }) {
  const imageUrl = resource.featuredImage && typeof resource.featuredImage === 'object' 
    ? resource.featuredImage.url 
    : null

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'dataset': return <Database className="h-5 w-5" />
      case 'software': return <Code className="h-5 w-5" />
      case 'course': return <GraduationCap className="h-5 w-5" />
      case 'tutorial': return <BookOpen className="h-5 w-5" />
      case 'publication': return <FileText className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'dataset': return 'bg-blue-600'
      case 'software': return 'bg-green-600'
      case 'course': return 'bg-purple-600'
      case 'tutorial': return 'bg-orange-600'
      case 'publication': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-gradient-to-br from-slate-50 to-blue-50 border-blue-200">
      {imageUrl && (
        <div className="relative">
          <AspectRatio ratio={21 / 9}>
            <Image
              src={imageUrl}
              alt={resource.title}
              fill
              className="object-cover"
            />
          </AspectRatio>
          <div className="absolute top-4 left-4">
            <Badge className="bg-blue-600 text-white">Featured Resource</Badge>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className={`${getTypeColor(resource.resourceType)} text-white border-0`}>
            {getResourceIcon(resource.resourceType)}
            <span className="ml-1 capitalize">{resource.resourceType}</span>
          </Badge>
          {resource.category && (
            <Badge variant="secondary">{resource.category}</Badge>
          )}
        </div>
        
        <CardTitle className="text-xl text-blue-600">
          {resource.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {resource.summary && (
          <p className="text-muted-foreground">
            {resource.summary}
          </p>
        )}

        {/* Course-specific info */}
        {resource.courseInfo?.isCourse && (
          <div className="grid gap-2 text-sm">
            {resource.courseInfo.instructor && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <span>Instructor: {resource.courseInfo.instructor}</span>
              </div>
            )}
            {resource.courseInfo.duration && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>Duration: {resource.courseInfo.duration}</span>
              </div>
            )}
            {resource.courseInfo.difficulty && (
              <div className="flex items-center gap-2">
                <Badge 
                  variant={
                    resource.courseInfo.difficulty === 'beginner' ? 'default' :
                    resource.courseInfo.difficulty === 'intermediate' ? 'secondary' : 'destructive'
                  }
                  className="text-xs"
                >
                  {resource.courseInfo.difficulty}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Dataset-specific info */}
        {resource.downloadInfo?.hasDownload && (
          <div className="grid gap-2 text-sm">
            {resource.downloadInfo.fileSize && (
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-blue-600" />
                <span>Size: {resource.downloadInfo.fileSize}</span>
              </div>
            )}
            {resource.downloadInfo.format && (
              <Badge variant="outline" className="w-fit">
                {resource.downloadInfo.format}
              </Badge>
            )}
          </div>
        )}

        {/* Publication-specific info */}
        {resource.publicationInfo?.isPublication && (
          <div className="grid gap-2 text-sm">
            {resource.publicationInfo.authors && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <span>{resource.publicationInfo.authors}</span>
              </div>
            )}
            {resource.publicationInfo.journal && resource.publicationInfo.year && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>{resource.publicationInfo.journal} ({resource.publicationInfo.year})</span>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 4).map((tagItem, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tagItem.tag}
              </Badge>
            ))}
            {resource.tags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{resource.tags.length - 4} more
              </Badge>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {resource.downloadInfo?.hasDownload && (
            <Button variant="default" size="sm" asChild>
              <Link 
                href={resource.downloadInfo.downloadUrl || (resource.downloadInfo.file && typeof resource.downloadInfo.file === 'object' ? resource.downloadInfo.file.url! : '#')}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Link>
            </Button>
          )}
          
          {resource.links && resource.links.length > 0 && (
            <Button variant="outline" size="sm" asChild>
              <Link href={resource.links[0].url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                {resource.links[0].title}
              </Link>
            </Button>
          )}

          <Button variant="ghost" size="sm">
            <Eye className="h-3 w-3 mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function StandardResourceCard({ resource }: { resource: ResourceWithRelations }) {
  const imageUrl = resource.featuredImage && typeof resource.featuredImage === 'object' 
    ? resource.featuredImage.url 
    : null

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'dataset': return <Database className="h-4 w-4" />
      case 'software': return <Code className="h-4 w-4" />
      case 'course': return <GraduationCap className="h-4 w-4" />
      case 'tutorial': return <BookOpen className="h-4 w-4" />
      case 'publication': return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {imageUrl && (
        <div className="relative">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={imageUrl}
              alt={resource.title}
              fill
              className="object-cover"
            />
          </AspectRatio>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="capitalize">
            {getResourceIcon(resource.resourceType)}
            <span className="ml-1">{resource.resourceType}</span>
          </Badge>
          {resource.category && (
            <Badge variant="secondary" className="text-xs">{resource.category}</Badge>
          )}
        </div>
        
        <CardTitle className="text-lg line-clamp-2">
          {resource.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {resource.summary && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {resource.summary}
          </p>
        )}
        
        {/* Quick info based on type */}
        <div className="text-xs text-muted-foreground space-y-1">
          {resource.downloadInfo?.hasDownload && resource.downloadInfo.fileSize && (
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{resource.downloadInfo.fileSize}</span>
            </div>
          )}
          
          {resource.courseInfo?.isCourse && resource.courseInfo.instructor && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{resource.courseInfo.instructor}</span>
            </div>
          )}
          
          {resource.publicationInfo?.isPublication && resource.publicationInfo.year && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{resource.publicationInfo.year}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          {resource.downloadInfo?.hasDownload && (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link 
                href={resource.downloadInfo.downloadUrl || (resource.downloadInfo.file && typeof resource.downloadInfo.file === 'object' ? resource.downloadInfo.file.url! : '#')}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Link>
            </Button>
          )}
          
          {resource.links && resource.links.length > 0 && !resource.downloadInfo?.hasDownload && (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={resource.links[0].url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                View
              </Link>
            </Button>
          )}
          
          {!resource.downloadInfo?.hasDownload && (!resource.links || resource.links.length === 0) && (
            <Button variant="ghost" size="sm" className="flex-1">
              <Eye className="h-3 w-3 mr-1" />
              Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function CompactResourceCard({ resource }: { resource: ResourceWithRelations }) {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'dataset': return <Database className="h-4 w-4" />
      case 'software': return <Code className="h-4 w-4" />
      case 'course': return <GraduationCap className="h-4 w-4" />
      case 'tutorial': return <BookOpen className="h-4 w-4" />
      case 'publication': return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="bg-blue-50 rounded-lg p-3">
              {getResourceIcon(resource.resourceType)}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1 mb-1">
              <Badge variant="outline" className="text-xs capitalize">
                {resource.resourceType}
              </Badge>
              {resource.category && (
                <Badge variant="secondary" className="text-xs">
                  {resource.category}
                </Badge>
              )}
            </div>
            
            <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">
              {resource.title}
            </h3>
            
            <div className="text-xs text-muted-foreground space-y-1">
              {resource.downloadInfo?.hasDownload && resource.downloadInfo.fileSize && (
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  <span>{resource.downloadInfo.fileSize}</span>
                </div>
              )}
              
              {resource.courseInfo?.isCourse && resource.courseInfo.instructor && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="truncate">{resource.courseInfo.instructor}</span>
                </div>
              )}
            </div>
            
            {resource.downloadInfo?.hasDownload && (
              <div className="mt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link 
                    href={resource.downloadInfo.downloadUrl || (resource.downloadInfo.file && typeof resource.downloadInfo.file === 'object' ? resource.downloadInfo.file.url! : '#')}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}