import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* Lab name */}
          <div className="text-sm text-muted-foreground">
            Center for Brain-Like Computing and Machine Intelligence
          </div>
          
          {/* Contact information */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground">
            <div>Phone: +86(21)34204421</div>
            <Separator orientation="vertical" className="hidden sm:block h-4" />
            <div>3-East 307 SEIEE Building, No. 800 Dongchuan Road</div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Minhang District, Shanghai, 200240
          </div>
          
          {/* Quick links */}
          <div className="flex items-center space-x-6 text-sm">
            <Link 
              href="/" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link 
              href="/research" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Research
            </Link>
            <Link 
              href="/members" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Members
            </Link>
            <Link 
              href="/events" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Events
            </Link>
            <Link 
              href="/resources" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Resources
            </Link>
          </div>
          
          <Separator className="w-full max-w-md" />
          
          {/* Copyright */}
          <div className="text-xs text-muted-foreground">
            All Rights Reserved © 2013 - {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  )
}