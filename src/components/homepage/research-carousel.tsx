'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import type { ResearchDemo, ResearchArea, Media } from '../../payload-types'

interface FeaturedResearchDemo extends ResearchDemo {
  researchArea: ResearchArea
  carouselImage?: Media
}

interface ResearchCarouselProps {
  featuredResearch: FeaturedResearchDemo[]
}

export function ResearchCarousel({ featuredResearch }: ResearchCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying || featuredResearch.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === featuredResearch.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000) // Auto-advance every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, featuredResearch.length])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex(currentIndex === 0 ? featuredResearch.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex(currentIndex === featuredResearch.length - 1 ? 0 : currentIndex + 1)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  if (featuredResearch.length === 0) {
    return null
  }

  const currentDemo = featuredResearch[currentIndex]
  const imageUrl = currentDemo.carouselImage && typeof currentDemo.carouselImage === 'object' && currentDemo.carouselImage.url
    ? currentDemo.carouselImage.url
    : currentDemo.image && typeof currentDemo.image === 'object' && currentDemo.image.url
    ? currentDemo.image.url
    : null

  return (
    <section className="relative w-full bg-background">
      <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
        {/* Main carousel content */}
        <div className="relative w-full h-full">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={currentDemo.carouselTitle || currentDemo.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl text-white space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-white/80 uppercase tracking-wider">
                    {currentDemo.researchArea.title}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                    {currentDemo.carouselTitle || currentDemo.title}
                  </h1>
                </div>
                
                <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                  {currentDemo.carouselDescription || currentDemo.description || 
                   `Explore our latest research in ${currentDemo.researchArea.title}`}
                </p>
                
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <Link href={`/research/${currentDemo.id}`}>
                      <Play className="h-4 w-4 mr-2" />
                      View Demo
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    <Link href="/research">
                      Explore Research
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        {featuredResearch.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-0"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-0"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Slide indicators */}
        {featuredResearch.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {featuredResearch.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-white scale-110'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Optional: Pause/play control */}
      {featuredResearch.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white text-xs"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        >
          {isAutoPlaying ? 'Pause' : 'Play'}
        </Button>
      )}
    </section>
  )
}