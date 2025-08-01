import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GoBackButton } from '@/components/ui/go-back-button'
import { Search, Home } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">404 - Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist.
            </p>
            <p className="text-sm text-muted-foreground">
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <GoBackButton />
          </div>
          
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              You might be looking for:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="link" size="sm" asChild>
                <Link href="/members">Members</Link>
              </Button>
              <Button variant="link" size="sm" asChild>
                <Link href="/research">Research</Link>
              </Button>
              <Button variant="link" size="sm" asChild>
                <Link href="/events">Events</Link>
              </Button>
              <Button variant="link" size="sm" asChild>
                <Link href="/resources">Resources</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}