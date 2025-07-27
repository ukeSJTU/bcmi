/**
 * Type definitions for seeding operations
 * Uses generated Payload types to ensure schema consistency
 */

import type {
    Event,
    Member,
    Nav,
    Position,
    ResearchArea,
    ResearchDemo
} from '@/payload-types'

export interface SeedConfig {
  environment: 'development' | 'production'
  clearExisting: boolean
  collections: string[]
  dataSource: 'faker' | 'original-content'
}

// Use actual Payload types for seeding data, but make relationships string references for easier seeding
export interface PositionSeedData extends Omit<Position, 'id' | 'updatedAt' | 'createdAt'> {
  // All fields from Position except auto-generated ones
}

export interface MemberSeedData extends Omit<Member, 'id' | 'updatedAt' | 'createdAt' | 'position' | 'mentor' | 'photo'> {
  position: number // Numeric ID for seeding
  mentor?: number // Numeric ID for seeding  
  photo?: string // file path for seeding, will become media relationship
}

export interface EventSeedData extends Omit<Event, 'id' | 'updatedAt' | 'createdAt' | 'featuredImage' | 'gallery' | 'speakers'> {
  featuredImage?: string // file path for seeding, will become media relationship
  gallery?: Array<{ image: string; caption?: string }> // file paths for seeding
  speakers?: Array<{
    name: string
    affiliation?: string
    bio?: string
    photo?: string // file path for seeding
  }>
}

export interface ResearchAreaSeedData extends Omit<ResearchArea, 'id' | 'updatedAt' | 'createdAt'> {
  // All fields from ResearchArea except auto-generated ones
}

export interface ResearchDemoSeedData extends Omit<ResearchDemo, 'id' | 'updatedAt' | 'createdAt' | 'researchArea' | 'image'> {
  researchArea: number // Numeric ID for seeding
  image?: string // file path for seeding, will become media relationship
}

export interface MediaSeedData {
  filename: string
  alt: string
  filePath: string
}

export interface NavSeedData extends Omit<Nav, 'id' | 'updatedAt' | 'createdAt'> {
  // All fields from Nav except auto-generated ones
}

export interface SeedResult {
  success: boolean
  created: number
  updated: number
  errors: string[]
  collection: string
}

export interface SeedSummary {
  environment: string
  startTime: Date
  endTime: Date
  duration: number
  results: SeedResult[]
  totalCreated: number
  totalUpdated: number
  totalErrors: number
}
