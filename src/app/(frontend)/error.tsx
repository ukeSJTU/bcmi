'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">
            Something went wrong!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              We encountered an unexpected error while loading this page.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 whitespace-pre-wrap break-words rounded bg-muted p-3 text-xs">
                  {error.message}
                  {error.digest && (
                    <>
                      <br />
                      <br />
                      Digest: {error.digest}
                    </>
                  )}
                </pre>
              </details>
            )}
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => reset()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
          
          <div className="pt-4 text-sm text-muted-foreground">
            <p>
              If this error persists, please contact the BCMI Lab administrators.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}