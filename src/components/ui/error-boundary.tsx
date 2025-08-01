'use client'

import React from 'react'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      const reset = () => {
        this.setState({ hasError: false, error: undefined })
      }

      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} reset={reset} />
      }

      return <DefaultErrorFallback error={this.state.error} reset={reset} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ reset }: { error?: Error; reset: () => void }) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <CardTitle className="text-lg font-semibold text-destructive">
          Something went wrong
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          We encountered an error while loading this section.
        </p>
        
        <Button onClick={reset} size="sm" className="gap-2">
          <RefreshCw className="h-3 w-3" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  )
}

// Lightweight error boundary for specific sections
function SectionErrorBoundary({ children, sectionName }: { children: React.ReactNode; sectionName: string }) {
  return (
    <ErrorBoundary
      fallback={({ reset }) => (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="font-semibold text-destructive">
              Error loading {sectionName}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            We couldn&apos;t load this section. Please try again.
          </p>
          <Button onClick={reset} size="sm" variant="outline">
            <RefreshCw className="h-3 w-3 mr-2" />
            Retry
          </Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

export { ErrorBoundary, SectionErrorBoundary }