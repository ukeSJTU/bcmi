/**
 * Production seed script using original BCMI content data
 */

import path from 'path'
import { Payload } from 'payload'
import {
    NavSeedData,
    PositionSeedData,
    SeedResult,
    SeedSummary
} from './shared/types'
import {
    closePayload,
    generateSlug,
    initPayload,
    loadOriginalContent,
    uploadMediaFile,
    upsertDocument,
    validateEnvironment,
    wait,
} from './shared/utils'

const SEED_CONFIG = {
  environment: 'production' as const,
  clearExisting: false, // Don't clear existing data in production
  collections: ['members', 'positions', 'research-areas'],
  mediaPath: path.join(process.cwd(), 'public', 'media'),
}

async function seedPositions(payload: Payload): Promise<SeedResult> {
  console.log('🎯 Seeding positions from original content...')
  const result: SeedResult = {
    success: true,
    created: 0,
    updated: 0,
    errors: [],
    collection: 'positions',
  }

  // Load original members data to understand categories
  const membersData = loadOriginalContent('members.json')
  
  const positions: PositionSeedData[] = []
  let displayOrder = 1

  // Extract position categories from original content
  for (const category of membersData.categories) {
    const slug = generateSlug(category.name)
    
    positions.push({
      title: category.name,
      slug,
      description: `${category.name} of the BCMI laboratory`,
      displayOrder: displayOrder++,
      isVisible: category.active !== false,
      showMentorGrouping: category.name !== 'Faculty Members',
      showInNavigation: category.active !== false,
      requiresMentor: category.name !== 'Faculty Members',
    })
  }

  // Add Alumni category if not present
  if (!positions.find(p => p.title.toLowerCase().includes('alumni'))) {
    positions.push({
      title: 'Alumni',
      slug: 'alumni',
      description: 'Former members of the BCMI laboratory',
      displayOrder: displayOrder,
      isVisible: false,
      showMentorGrouping: false,
      showInNavigation: false,
    })
  }

  for (const position of positions) {
    try {
      await upsertDocument(payload, 'positions', position, 'slug')
      result.created++
    } catch (error) {
      result.errors.push(`Failed to create position ${position.slug}: ${error}`)
      result.success = false
    }
  }

  return result
}

async function seedMembers(payload: Payload): Promise<SeedResult> {
  console.log('👥 Seeding members from original content...')
  const result: SeedResult = {
    success: true,
    created: 0,
    updated: 0,
    errors: [],
    collection: 'members',
  }

  try {
    // Load original content
    const membersData = loadOriginalContent('members.json')
    
    // Get position references
    const positions = await payload.find({ collection: 'positions', limit: 100 })
    const positionMap = new Map()
    positions.docs.forEach(pos => {
      positionMap.set(pos.slug, pos.id.toString())
    })

    const facultyPosition = positions.docs.find(p => p.slug === 'faculty-members')
    const createdMembers: any[] = []

    // Process each category
    for (const category of membersData.categories) {
      const positionSlug = generateSlug(category.name)
      const positionId = positionMap.get(positionSlug)
      
      if (!positionId) {
        result.errors.push(`Position not found for category: ${category.name}`)
        continue
      }

      let displayOrder = 1
      for (const originalMember of category.members) {
        try {
          // Upload member photo if available
          let photoId = null
          if (originalMember.photo) {
            const photoPath = path.join(SEED_CONFIG.mediaPath, originalMember.photo)
            const uploadedPhoto = await uploadMediaFile(
              payload,
              photoPath,
              `Photo of ${originalMember.name}`,
              originalMember.photo
            )
            if (uploadedPhoto) {
              photoId = uploadedPhoto.id
            }
          }

          // Extract department and email if available
          const email = originalMember.email || generateEmailFromName(originalMember.name)
          
          const memberData: any = {
            name: originalMember.name,
            email,
            position: positionId,
            displayOrder: displayOrder++,
            title: originalMember.title || null,
            department: originalMember.department || null,
            researchInterests: originalMember.researchInterests || null,
            officeLocation: originalMember.office || null,
            phone: originalMember.phone || null,
            personalWebsite: originalMember.website || originalMember.homepage || null,
            isActive: category.active !== false,
            photo: photoId,
          }

          // Add mentor for non-faculty members
          if (category.name !== 'Faculty Members' && originalMember.mentor) {
            // Find mentor by name in already created faculty
            const mentor = createdMembers.find(m => 
              m.name === originalMember.mentor && 
              m.position === facultyPosition?.id.toString()
            )
            if (mentor) {
              memberData.mentor = mentor.id
            }
          }

          const created = await upsertDocument(payload, 'members', memberData, 'email')
          createdMembers.push(created)
          result.created++
          
          await wait(200) // Avoid overwhelming the database
        } catch (error) {
          result.errors.push(`Failed to create member ${originalMember.name}: ${error}`)
          result.success = false
        }
      }
    }

    return result
  } catch (error) {
    result.errors.push(`Failed to load original members data: ${error}`)
    result.success = false
    return result
  }
}

function generateEmailFromName(name: string): string {
  // Generate a reasonable email from the name
  const cleanName = name.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, '.')
  
  return `${cleanName}@sjtu.edu.cn`
}

async function seedResearchAreas(payload: Payload): Promise<SeedResult> {
  console.log('🔬 Seeding research areas from original content...')
  const result: SeedResult = {
    success: true,
    created: 0,
    updated: 0,
    errors: [],
    collection: 'research-areas',
  }

  try {
    const researchData = loadOriginalContent('research.json')
    
    let order = 1
    
    // Process research sections
    if (researchData.sections) {
      for (const section of researchData.sections) {
        try {
          const areaData: any = {
            title: section.title,
            anchor: generateSlug(section.title),
            description: section.description ? convertToRichText(section.description) : null,
            order: order++,
            isVisible: section.active !== false,
          }

          // Convert bullet points if available
          if (section.bulletPoints && Array.isArray(section.bulletPoints)) {
            areaData.bulletPoints = section.bulletPoints.map((point: string) => ({ point }))
          }

          await upsertDocument(payload, 'research-areas', areaData, 'anchor')
          result.created++
          
          await wait(200)
        } catch (error) {
          result.errors.push(`Failed to create research area ${section.title}: ${error}`)
          result.success = false
        }
      }
    }

    // Process research topics if available
    if (researchData.topics) {
      for (const topic of researchData.topics) {
        try {
          const areaData: any = {
            title: topic.name || topic.title,
            anchor: generateSlug(topic.name || topic.title),
            description: topic.description ? convertToRichText(topic.description) : null,
            order: order++,
            isVisible: true,
          }

          await upsertDocument(payload, 'research-areas', areaData, 'anchor')
          result.created++
          
          await wait(200)
        } catch (error) {
          result.errors.push(`Failed to create research topic ${topic.name || topic.title}: ${error}`)
          result.success = false
        }
      }
    }

    return result
  } catch (error) {
    result.errors.push(`Failed to load original research data: ${error}`)
    result.success = false
    return result
  }
}

function convertToRichText(content: string | any): any {
  // Simple conversion to Lexical rich text format
  if (typeof content === 'string') {
    return {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: content,
              },
            ],
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    }
  }
  
  return content
}

async function seedNavigation(payload: Payload): Promise<SeedResult> {
  console.log('🧭 Seeding navigation from original content...')
  const result: SeedResult = {
    success: true,
    created: 0,
    updated: 0,
    errors: [],
    collection: 'nav',
  }

  try {
    // Load homepage to understand navigation structure
    const homepageData = loadOriginalContent('homepage.json')
    
    const navData: NavSeedData = {
      items: [
        {
          label: 'Home',
          href: '/',
        },
        {
          label: 'Members',
          href: '/members',
        },
        {
          label: 'Research',
          href: '/research',
        },
        {
          label: 'Events',
          href: '/events',
        },
        {
          label: 'Resources',
          href: '/resources',
        },
      ],
    }

    // Add additional navigation items from original content if available
    if (homepageData.navigation) {
      for (const navItem of homepageData.navigation) {
        if (!navData.items.find(item => item.label === navItem.label)) {
          navData.items.push({
            label: navItem.label,
            href: navItem.url || navItem.href || '#',
          })
        }
      }
    }

    await payload.updateGlobal({
      slug: 'nav',
      data: navData,
    })
    
    result.created++
    return result
  } catch (error) {
    result.errors.push(`Failed to create navigation: ${error}`)
    result.success = false
    return result
  }
}

export async function runProductionSeed(): Promise<SeedSummary> {
  console.log('🏭 Starting production seed process...')
  const startTime = new Date()

  try {
    validateEnvironment()
    const payload = await initPayload()

    const summary: SeedSummary = {
      environment: 'production',
      startTime,
      endTime: new Date(),
      duration: 0,
      results: [],
      totalCreated: 0,
      totalUpdated: 0,
      totalErrors: 0,
    }

    try {
      // Don't clear existing data in production
      console.log('ℹ️  Production mode: Preserving existing data')

      // Seed data in order of dependencies
      const results = await Promise.all([
        seedPositions(payload),
        seedResearchAreas(payload),
      ])

      // Wait for positions to be created before seeding members
      await wait(2000)
      results.push(await seedMembers(payload))

      // Seed navigation last
      results.push(await seedNavigation(payload))

      summary.results = results
      summary.endTime = new Date()
      summary.duration = summary.endTime.getTime() - summary.startTime.getTime()
      summary.totalCreated = results.reduce((sum, r) => sum + r.created, 0)
      summary.totalUpdated = results.reduce((sum, r) => sum + r.updated, 0)
      summary.totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0)

      console.log('\n📊 Production Seed Summary:')
      console.log(`⏱️  Duration: ${summary.duration}ms`)
      console.log(`✨ Created: ${summary.totalCreated}`)
      console.log(`📝 Updated: ${summary.totalUpdated}`)
      console.log(`❌ Errors: ${summary.totalErrors}`)

      if (summary.totalErrors > 0) {
        console.log('\n❌ Errors encountered:')
        results.forEach(result => {
          result.errors.forEach(error => console.log(`   ${error}`))
        })
      }

      return summary
    } finally {
      await closePayload(payload)
    }
  } catch (error) {
    console.error('💥 Fatal error during production seeding:', error)
    throw error
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runProductionSeed()
    .then(() => {
      console.log('🎉 Production seeding completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Production seeding failed:', error)
      process.exit(1)
    })
}
