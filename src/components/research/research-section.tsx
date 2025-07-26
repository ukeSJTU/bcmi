import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Demo {
  id: string
  title: string
  description?: string
  image?: {
    url: string
    alt?: string
  }
  demoUrl: string
  isExternal: boolean
}

interface ResearchArea {
  id: string
  title: string
  anchor: string
  description?: string
  bulletPoints?: Array<{ point: string }>
  demos?: Demo[]
}

interface ResearchSectionProps {
  researchArea: ResearchArea
}

export function ResearchSection({ researchArea }: ResearchSectionProps) {
  return (
    <section 
      id={researchArea.anchor} 
      className="scroll-mt-8 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {researchArea.title}
        </h2>
        
        {researchArea.description && (
          <div 
            className="text-muted-foreground mb-6 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: researchArea.description }}
          />
        )}
      </div>

      {researchArea.bulletPoints && researchArea.bulletPoints.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Our current research includes:</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            {researchArea.bulletPoints.map((bullet, index) => (
              <li key={index} className="leading-relaxed">
                {bullet.point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {researchArea.demos && researchArea.demos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Demos:</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {researchArea.demos.map((demo) => (
              <DemoCard key={demo.id} demo={demo} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

interface DemoCardProps {
  demo: Demo
}

function DemoCard({ demo }: DemoCardProps) {
  const LinkComponent = demo.isExternal ? 'a' : Link
  const linkProps = demo.isExternal 
    ? { href: demo.demoUrl, target: "_blank", rel: "noopener noreferrer" }
    : { href: demo.demoUrl }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {demo.image && (
        <div className="relative">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={demo.image.url}
              alt={demo.image.alt || demo.title}
              fill
              className="object-cover"
            />
          </AspectRatio>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {demo.title}
          {demo.isExternal && <ExternalLink className="h-4 w-4" />}
        </CardTitle>
      </CardHeader>
      
      {demo.description && (
        <CardContent className="pt-0 pb-3">
          <p className="text-sm text-muted-foreground">
            {demo.description}
          </p>
        </CardContent>
      )}
      
      <CardContent className="pt-0">
        <LinkComponent {...linkProps}>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            {demo.isExternal ? "View Demo" : "Learn More"}
            {demo.isExternal && <ExternalLink className="ml-2 h-4 w-4" />}
          </Button>
        </LinkComponent>
      </CardContent>
    </Card>
  )
}
