import config from '@payload-config'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload, Payload } from 'payload'

/**
 * Initialize Payload for seeding operations
 */
export async function initPayload(): Promise<Payload> {
  const payload = await getPayload({
    config,
  })
  
  console.log('✅ Payload initialized for seeding')
  return payload
}

/**
 * Safely close Payload connection
 */
export async function closePayload(payload: Payload): Promise<void> {
  try {
    if (payload.db && typeof payload.db.destroy === 'function') {
      await payload.db.destroy()
    }
    console.log('✅ Payload connection closed')
  } catch (error) {
    console.warn('⚠️ Error closing Payload connection:', error)
  }
}

/**
 * Clear all data from collections (useful for development resets)
 */
export async function clearCollections(payload: Payload, collections: string[]): Promise<void> {
  console.log('🧹 Clearing collections...')
  
  for (const collection of collections) {
    try {
      const { docs } = await payload.find({
        collection: collection as any,
        limit: 1000,
      })
      
      for (const doc of docs) {
        await payload.delete({
          collection: collection as any,
          id: doc.id,
        })
      }
      
      console.log(`✅ Cleared ${docs.length} documents from ${collection}`)
    } catch (error) {
      console.warn(`⚠️ Error clearing ${collection}:`, error)
    }
  }
}

/**
 * Upsert a document (create if not exists, update if exists)
 */
export async function upsertDocument(
  payload: Payload,
  collection: string,
  data: any,
  uniqueField: string = 'slug'
): Promise<any> {
  try {
    // Try to find existing document
    const existing = await payload.find({
      collection: collection as any,
      where: {
        [uniqueField]: {
          equals: data[uniqueField],
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      // Update existing
      const updated = await payload.update({
        collection: collection as any,
        id: existing.docs[0].id,
        data,
      })
      console.log(`📝 Updated ${collection}: ${data[uniqueField]}`)
      return updated
    } else {
      // Create new
      const created = await payload.create({
        collection: collection as any,
        data,
      })
      console.log(`✨ Created ${collection}: ${data[uniqueField]}`)
      return created
    }
  } catch (error) {
    console.error(`❌ Error upserting ${collection} ${data[uniqueField]}:`, error)
    throw error
  }
}

/**
 * Load JSON data from original content files
 */
export function loadOriginalContent(filename: string): any {
  const filePath = path.join(process.cwd(), 'data', 'original-content', filename)
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Original content file not found: ${filePath}`)
  }
  
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

/**
 * Upload media file and return media document
 */
export async function uploadMediaFile(
  payload: Payload,
  filePath: string,
  alt?: string,
  filename?: string
): Promise<any> {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Media file not found: ${filePath}`)
      return null
    }

    const stats = fs.statSync(filePath)
    const file = {
      data: fs.readFileSync(filePath),
      mimetype: getMimeType(filePath),
      name: filename || path.basename(filePath),
      size: stats.size,
    }

    const media = await payload.create({
      collection: 'media',
      data: {
        alt: alt || filename || path.basename(filePath),
      },
      file,
    })

    console.log(`📷 Uploaded media: ${media.filename}`)
    return media
  } catch (error) {
    console.error(`❌ Error uploading media ${filePath}:`, error)
    return null
  }
}

/**
 * Get MIME type from file extension
 */
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
  }
  
  return mimeTypes[ext] || 'application/octet-stream'
}

/**
 * Generate a slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Wait for a specified amount of time (useful for avoiding rate limits)
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Validate environment variables required for seeding
 */
export function validateEnvironment(): void {
  const required = ['DATABASE_URI', 'PAYLOAD_SECRET']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
  
  console.log('✅ Environment variables validated')
}
