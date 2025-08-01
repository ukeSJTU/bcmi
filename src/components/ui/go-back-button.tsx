'use client'

import { Button } from './button'
import { ArrowLeft } from 'lucide-react'

export function GoBackButton() {
  return (
    <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
      <ArrowLeft className="h-4 w-4" />
      Go Back
    </Button>
  )
}