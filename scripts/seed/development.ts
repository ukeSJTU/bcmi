/**
 * Development seed script using faker.js for generating test data
 */

import { faker } from '@faker-js/faker'
import { Payload } from 'payload'
import {
    EventSeedData,
    MemberSeedData,
    NavSeedData,
    PositionSeedData,
    ResearchAreaSeedData,
    ResearchDemoSeedData,
    SeedResult,
    SeedSummary,
} from './shared/types'
import {
    clearCollections,
    closePayload,
    generateSlug,
    initPayload,
    upsertDocument,
    validateEnvironment,
    wait,
} from './shared/utils'

// Temporary interface for seeding with email references that get resolved to IDs
interface TempMemberSeedData extends Omit<MemberSeedData, 'mentor'> {
  mentor?: string // Email reference during seeding
}

const SEED_CONFIG = {
  environment: 'development' as const,
  clearExisting: true,
  collections: ['members', 'positions', 'research-areas', 'research-demos', 'events'],
  positions: {
    count: 5,
  },
  members: {
    faculty: 8,
    phd: 12,
    masters: 15,
    undergraduate: 10,
  },
  researchAreas: {
    count: 6,
  },
  demos: {
    count: 12,
  },
  events: {
    upcoming: 8,
    ongoing: 2,
    completed: 20,
  },
}

async function seedPositions(payload: Payload): Promise<SeedResult> {
  console.log('🎯 Seeding positions...')
  const result: SeedResult = {
    success: true,
    created: 0,
    updated: 0,
    errors: [],
    collection: 'positions',
  }

  const positions: PositionSeedData[] = [
    {
      title: 'Faculty Members',
      slug: 'faculty-members',
      description: 'Principal investigators and faculty members',
      displayOrder: 1,
      isVisible: true,
      showMentorGrouping: false,
    },
    {
      title: 'PhD Students',
      slug: 'phd-students',
      description: 'Doctoral candidates in various research areas',
      displayOrder: 2,
      isVisible: true,
      showMentorGrouping: true,
    },
    {
      title: 'Master Students',
      slug: 'master-students',
      description: 'Graduate students pursuing Master degrees',
      displayOrder: 3,
      isVisible: true,
      showMentorGrouping: true,
    },
    {
      title: 'Undergraduate Students',
      slug: 'undergraduate-students',
      description: 'Undergraduate research assistants',
      displayOrder: 4,
      isVisible: true,
      showMentorGrouping: true,
    },
    {
      title: 'Alumni',
      slug: 'alumni',
      description: 'Former lab members',
      displayOrder: 5,
      isVisible: false,
      showMentorGrouping: false,
    },
  ]

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
  console.log('👥 Seeding members...')
  const result: SeedResult = {
    success: true,
    created: 0,
    updated: 0,
    errors: [],
    collection: 'members',
  }

  // Get position IDs for references
  const positions = await payload.find({ collection: 'positions', limit: 100 })
  const facultyPosition = positions.docs.find(p => p.slug === 'faculty-members')
  const phdPosition = positions.docs.find(p => p.slug === 'phd-students')
  const mastersPosition = positions.docs.find(p => p.slug === 'master-students')
  const undergraduatePosition = positions.docs.find(p => p.slug === 'undergraduate-students')

  if (!facultyPosition || !phdPosition || !mastersPosition || !undergraduatePosition) {
    throw new Error('Required positions not found. Make sure to seed positions first.')
  }

  const members: TempMemberSeedData[] = []

  // Generate faculty members
  for (let i = 0; i < SEED_CONFIG.members.faculty; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const name = `${firstName} ${lastName}`
    
    members.push({
      name,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      position: facultyPosition.id, // Use numeric ID directly
      displayOrder: i + 1,
      title: faker.helpers.arrayElement(['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer']),
      department: 'Department of Computer Science and Engineering, Shanghai Jiao Tong University',
      researchInterests: generateResearchInterests(),
      officeLocation: `Room ${faker.number.int({ min: 100, max: 999 })}, SEIEE Building`,
      phone: faker.phone.number(),
      personalWebsite: `https://${firstName.toLowerCase()}-${lastName.toLowerCase()}.sjtu.edu.cn`,
      isActive: true,
      joinDate: faker.date.past({ years: 10 }).toISOString().split('T')[0],
    })
  }

  // Generate PhD students
  const facultyMembers = members.slice(0, SEED_CONFIG.members.faculty)
  for (let i = 0; i < SEED_CONFIG.members.phd; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const name = `${firstName} ${lastName}`
    const mentor = faker.helpers.arrayElement(facultyMembers)
    
    members.push({
      name,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      position: phdPosition.id,
      mentor: mentor.email!, // We'll resolve this to ID after creating faculty
      displayOrder: i + 1,
      researchInterests: generateResearchInterests(),
      isActive: true,
      joinDate: faker.date.past({ years: 5 }).toISOString().split('T')[0],
    })
  }

  // Generate Master students
  for (let i = 0; i < SEED_CONFIG.members.masters; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const name = `${firstName} ${lastName}`
    const mentor = faker.helpers.arrayElement(facultyMembers)
    
    members.push({
      name,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      position: mastersPosition.id,
      mentor: mentor.email!,
      displayOrder: i + 1,
      researchInterests: generateResearchInterests(),
      isActive: true,
      joinDate: faker.date.past({ years: 3 }).toISOString().split('T')[0],
    })
  }

  // Generate Undergraduate students
  for (let i = 0; i < SEED_CONFIG.members.undergraduate; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const name = `${firstName} ${lastName}`
    const mentor = faker.helpers.arrayElement(facultyMembers)
    
    members.push({
      name,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      position: undergraduatePosition.id,
      mentor: mentor.email!,
      displayOrder: i + 1,
      isActive: true,
      joinDate: faker.date.past({ years: 2 }).toISOString().split('T')[0],
    })
  }

  // Create members in two passes - first faculty, then students
  const createdMembers: any[] = []

  // First pass: Create faculty members
  for (const member of members.slice(0, SEED_CONFIG.members.faculty)) {
    try {
      const created = await upsertDocument(payload, 'members', member, 'email')
      createdMembers.push(created)
      result.created++
      await wait(100) // Small delay to avoid overwhelming the database
    } catch (error) {
      result.errors.push(`Failed to create faculty member ${member.name}: ${error}`)
      result.success = false
    }
  }

  // Second pass: Create students with mentor references
  for (const member of members.slice(SEED_CONFIG.members.faculty)) {
    try {
      // Find mentor by email
      const mentorMember = createdMembers.find(m => m.email === member.mentor)
      const memberData = {
        ...member,
        mentor: mentorMember?.id || undefined, // Use numeric ID or undefined
      }
      
      await upsertDocument(payload, 'members', memberData, 'email')
      result.created++
      await wait(100)
    } catch (error) {
      result.errors.push(`Failed to create student ${member.name}: ${error}`)
      result.success = false
    }
  }

  return result
}

function generateResearchInterests(): string {
  const areas = [
    'Machine Learning',
    'Deep Learning',
    'Computer Vision',
    'Natural Language Processing',
    'Brain-Computer Interfaces',
    'Neural Networks',
    'Artificial Intelligence',
    'Pattern Recognition',
    'Signal Processing',
    'Cognitive Computing',
    'Reinforcement Learning',
    'Data Mining',
    'Bioinformatics',
    'Medical Imaging',
    'Robotics',
  ]

  const selectedAreas = faker.helpers.arrayElements(areas, { min: 2, max: 4 })
  return selectedAreas.join(', ')
}

function convertToRichText(content: string): any {
  // Convert plain text to Lexical rich text format
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

async function seedResearchAreas(payload: Payload): Promise<SeedResult> {
  console.log('🔬 Seeding research areas...')
  const result: SeedResult = {
    success: true,
    created: 0,
    updated: 0,
    errors: [],
    collection: 'research-areas',
  }

  const researchTopics = [
    {
      title: 'Computer Vision',
      description: 'Advanced computer vision techniques for object detection, recognition, and scene understanding',
      bulletPoints: [
        'Deep learning for image classification',
        'Object detection and tracking',
        'Scene understanding and segmentation',
        'Real-time video processing'
      ]
    },
    {
      title: 'Brain-Computer Interfaces',
      description: 'Direct communication pathways between the brain and external devices',
      bulletPoints: [
        'EEG signal processing',
        'Neural signal decoding',
        'Assistive technologies',
        'Brain state monitoring'
      ]
    },
    {
      title: 'Natural Language Processing',
      description: 'Understanding and generating human language using machine learning',
      bulletPoints: [
        'Text classification and sentiment analysis',
        'Language model development',
        'Information extraction',
        'Machine translation'
      ]
    },
    {
      title: 'Machine Learning Theory',
      description: 'Fundamental research in machine learning algorithms and theory',
      bulletPoints: [
        'Statistical learning theory',
        'Optimization algorithms',
        'Model selection and validation',
        'Unsupervised learning methods'
      ]
    },
    {
      title: 'Medical AI',
      description: 'Artificial intelligence applications in healthcare and medical diagnosis',
      bulletPoints: [
        'Medical image analysis',
        'Clinical decision support',
        'Drug discovery assistance',
        'Personalized medicine'
      ]
    },
    {
      title: 'Robotics and Autonomous Systems',
      description: 'Intelligent robots and autonomous systems for real-world applications',
      bulletPoints: [
        'Robot perception and control',
        'Path planning and navigation',
        'Human-robot interaction',
        'Autonomous vehicle systems'
      ]
    },
  ]

  for (let i = 0; i < researchTopics.length; i++) {
    const topic = researchTopics[i]
    const area: ResearchAreaSeedData = {
      title: topic.title,
      anchor: generateSlug(topic.title),
      description: convertToRichText(topic.description),
      bulletPoints: topic.bulletPoints.map(point => ({ point })),
      order: i + 1,
      isVisible: true,
    }

    try {
      await upsertDocument(payload, 'research-areas', area, 'anchor')
      result.created++
    } catch (error) {
      result.errors.push(`Failed to create research area ${area.anchor}: ${error}`)
      result.success = false
    }
  }

  return result
}

async function seedResearchDemos(payload: Payload): Promise<SeedResult> {
  console.log('🧪 Seeding research demos...')
  const result: SeedResult = {
    success: true,
    created: 0,
    updated: 0,
    errors: [],
    collection: 'research-demos',
  }

  // Get research areas first
  const researchAreas = await payload.find({ collection: 'research-areas', limit: 100 })
  if (researchAreas.docs.length === 0) {
    result.errors.push('No research areas found. Please seed research areas first.')
    result.success = false
    return result
  }

  const demoTitles = [
    'Neural Style Transfer Playground',
    'Real-time Emotion Recognition',
    'Brain Signal Classification',
    'Automated Medical Diagnosis',
    'Intelligent Tutoring System',
    'Vision-based Navigation',
    'Speech Recognition Interface',
    'Gesture Control System',
    'Recommendation Engine',
    'Anomaly Detection Dashboard',
    'Text Sentiment Analyzer',
    'Image Captioning Tool',
  ]

  for (let i = 0; i < SEED_CONFIG.demos.count; i++) {
    const title = demoTitles[i] || `Demo ${i + 1}`
    const randomArea = faker.helpers.arrayElement(researchAreas.docs)
    
    const demo: ResearchDemoSeedData = {
      title,
      description: faker.lorem.paragraph({ min: 2, max: 3 }),
      demoUrl: `https://demo.bcmi.sjtu.edu.cn/${generateSlug(title)}`,
      isExternal: faker.datatype.boolean(0.3), // 30% chance of being external
      researchArea: randomArea.id,
      order: i + 1,
    }

    try {
      await upsertDocument(payload, 'research-demos', demo, 'title')
      result.created++
    } catch (error) {
      result.errors.push(`Failed to create research demo ${demo.title}: ${error}`)
      result.success = false
    }
  }

  return result
}

async function seedEvents(payload: Payload): Promise<SeedResult> {
  console.log('🎉 Seeding events...')
  const result: SeedResult = {
    success: true,
    created: 0,
    updated: 0,
    errors: [],
    collection: 'events',
  }

  const eventTypes = ['conference', 'workshop', 'seminar', 'symposium', 'lecture', 'competition', 'meeting']
  const eventTitles = [
    'International Conference on Machine Learning',
    'Deep Learning Workshop',
    'AI Ethics Symposium',
    'Computer Vision Seminar',
    'Neural Networks Lecture Series',
    'Data Science Competition',
    'Research Progress Meeting',
    'Brain-Computer Interface Workshop',
    'Natural Language Processing Conference',
    'Robotics and Automation Symposium',
    'Medical AI Workshop',
    'Quantum Computing Seminar',
    'Cognitive Science Conference',
    'Pattern Recognition Workshop',
    'Artificial Intelligence Summit',
    'Machine Learning Theory Seminar',
    'Computer Graphics Conference',
    'Bioinformatics Workshop',
    'Computational Neuroscience Meeting',
    'Data Mining Conference',
    'Virtual Reality Symposium',
    'Cybersecurity Workshop',
    'Digital Health Conference',
    'Smart Systems Seminar',
    'Innovation Showcase',
    'Research Collaboration Meeting',
    'Technology Transfer Workshop',
    'Industry Partnership Forum',
    'Graduate Student Symposium',
    'Faculty Research Presentations'
  ]

  const venues = [
    'BCMI Laboratory Conference Room',
    'SEIEE Building Auditorium',
    'Shanghai Jiao Tong University Main Campus',
    'Online (Zoom)',
    'Hybrid (In-person + Online)',
    'Academic Activity Center',
    'Engineering Building Hall',
    'International Conference Center'
  ]

  const organizers = [
    'BCMI Laboratory',
    'Shanghai Jiao Tong University',
    'IEEE Shanghai Section',
    'ACM Shanghai Chapter',
    'Chinese Association for Artificial Intelligence',
    'China Computer Federation',
    'International Conference Committee'
  ]

  // Generate upcoming events
  for (let i = 0; i < SEED_CONFIG.events.upcoming; i++) {
    const title = faker.helpers.arrayElement(eventTitles)
    const eventType = faker.helpers.arrayElement(eventTypes)
    const startDate = faker.date.future({ years: 1 })
    const endDate = faker.datatype.boolean(0.3) ? faker.date.future({ years: 1, refDate: startDate }) : undefined

    const event: EventSeedData = {
      title: `${title} ${new Date().getFullYear() + 1}`,
      slug: generateSlug(`${title}-${new Date().getFullYear() + 1}`),
      description: convertToRichText(faker.lorem.paragraphs(2, '\n\n')),
      summary: faker.lorem.paragraph(),
      eventType: eventType as 'conference' | 'workshop' | 'seminar' | 'symposium' | 'lecture' | 'competition' | 'meeting' | 'other',
      status: 'upcoming',
      startDate: startDate.toISOString(),
      endDate: endDate?.toISOString(),
      timezone: 'Asia/Shanghai',
      location: {
        venue: faker.helpers.arrayElement(venues),
        address: faker.location.streetAddress() + ', Shanghai, China',
        room: faker.datatype.boolean(0.6) ? `Room ${faker.number.int({ min: 100, max: 999 })}` : undefined,
        isOnline: faker.datatype.boolean(0.3),
      },
      organizer: faker.helpers.arrayElement(organizers),
      speakers: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => ({
        name: faker.person.fullName(),
        affiliation: faker.helpers.arrayElement([
          'Shanghai Jiao Tong University',
          'Tsinghua University', 
          'Peking University',
          'MIT',
          'Stanford University',
          'Google Research',
          'Microsoft Research',
          'OpenAI'
        ]),
        bio: faker.lorem.paragraph(),
      })),
      tags: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => ({
        tag: faker.helpers.arrayElement(['AI', 'ML', 'Deep Learning', 'Computer Vision', 'NLP', 'Robotics', 'BCI', 'Research'])
      })),
      externalLinks: [
        {
          title: 'Registration',
          url: `https://registration.bcmi.sjtu.edu.cn/${generateSlug(title)}`,
          type: 'registration',
        },
        {
          title: 'Event Website', 
          url: `https://events.bcmi.sjtu.edu.cn/${generateSlug(title)}`,
          type: 'website',
        }
      ],
      displayOrder: i + 1,
      isPublished: true,
      isFeatured: faker.datatype.boolean(0.3),
    }

    try {
      await upsertDocument(payload, 'events', event, 'slug')
      result.created++
    } catch (error) {
      result.errors.push(`Failed to create upcoming event ${event.title}: ${error}`)
      result.success = false
    }
  }

  // Generate ongoing events
  for (let i = 0; i < SEED_CONFIG.events.ongoing; i++) {
    const title = faker.helpers.arrayElement(eventTitles)
    const eventType = faker.helpers.arrayElement(eventTypes)
    const startDate = faker.date.recent({ days: 7 })
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + faker.number.int({ min: 1, max: 14 }))

    const event: EventSeedData = {
      title: `${title} ${new Date().getFullYear()}`,
      slug: generateSlug(`${title}-${new Date().getFullYear()}-ongoing`),
      description: convertToRichText(faker.lorem.paragraphs(2, '\n\n')),
      summary: faker.lorem.paragraph(),
      eventType: eventType as 'conference' | 'workshop' | 'seminar' | 'symposium' | 'lecture' | 'competition' | 'meeting' | 'other',
      status: 'ongoing',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      timezone: 'Asia/Shanghai',
      location: {
        venue: faker.helpers.arrayElement(venues),
        address: faker.location.streetAddress() + ', Shanghai, China',
        room: `Room ${faker.number.int({ min: 100, max: 999 })}`,
        isOnline: faker.datatype.boolean(0.4),
      },
      organizer: faker.helpers.arrayElement(organizers),
      speakers: Array.from({ length: faker.number.int({ min: 2, max: 6 }) }, () => ({
        name: faker.person.fullName(),
        affiliation: faker.helpers.arrayElement([
          'Shanghai Jiao Tong University',
          'Fudan University',
          'East China Normal University',
          'Chinese Academy of Sciences',
          'Industry Partner'
        ]),
        bio: faker.lorem.paragraph(),
      })),
      tags: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () => ({
        tag: faker.helpers.arrayElement(['Workshop', 'Hands-on', 'Tutorial', 'Networking', 'Collaboration'])
      })),
      externalLinks: [
        {
          title: 'Live Stream',
          url: `https://live.bcmi.sjtu.edu.cn/${generateSlug(title)}`,
          type: 'website',
        }
      ],
      displayOrder: SEED_CONFIG.events.upcoming + i + 1,
      isPublished: true,
      isFeatured: true, // Ongoing events are typically featured
    }

    try {
      await upsertDocument(payload, 'events', event, 'slug')
      result.created++
    } catch (error) {
      result.errors.push(`Failed to create ongoing event ${event.title}: ${error}`)
      result.success = false
    }
  }

  // Generate completed events
  for (let i = 0; i < SEED_CONFIG.events.completed; i++) {
    const title = faker.helpers.arrayElement(eventTitles)
    const eventType = faker.helpers.arrayElement(eventTypes)
    const startDate = faker.date.past({ years: 3 })
    const endDate = faker.datatype.boolean(0.4) ? new Date(startDate.getTime() + faker.number.int({ min: 1, max: 5 }) * 24 * 60 * 60 * 1000) : undefined

    const event: EventSeedData = {
      title: `${title} ${startDate.getFullYear()}`,
      slug: generateSlug(`${title}-${startDate.getFullYear()}`),
      description: convertToRichText(faker.lorem.paragraphs(2, '\n\n')),
      summary: faker.lorem.paragraph(),
      eventType: eventType as 'conference' | 'workshop' | 'seminar' | 'symposium' | 'lecture' | 'competition' | 'meeting' | 'other',
      status: 'completed',
      startDate: startDate.toISOString(),
      endDate: endDate?.toISOString(),
      timezone: 'Asia/Shanghai',
      location: {
        venue: faker.helpers.arrayElement(venues),
        address: faker.location.streetAddress() + ', Shanghai, China',
        room: faker.datatype.boolean(0.7) ? `Room ${faker.number.int({ min: 100, max: 999 })}` : undefined,
        isOnline: faker.datatype.boolean(0.2),
      },
      organizer: faker.helpers.arrayElement(organizers),
      speakers: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
        name: faker.person.fullName(),
        affiliation: faker.helpers.arrayElement([
          'Shanghai Jiao Tong University',
          'International University',
          'Research Institute',
          'Technology Company',
          'Academic Institution'
        ]),
        bio: faker.lorem.paragraph(),
      })),
      tags: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () => ({
        tag: faker.helpers.arrayElement(['Research', 'Publication', 'Collaboration', 'Innovation', 'Success'])
      })),
      externalLinks: [
        {
          title: 'Event Recording',
          url: `https://archive.bcmi.sjtu.edu.cn/${generateSlug(title)}`,
          type: 'recording',
        },
        {
          title: 'Materials',
          url: `https://materials.bcmi.sjtu.edu.cn/${generateSlug(title)}`,
          type: 'materials',
        }
      ],
      displayOrder: SEED_CONFIG.events.upcoming + SEED_CONFIG.events.ongoing + i + 1,
      isPublished: true,
      isFeatured: faker.datatype.boolean(0.1), // Few completed events are featured
      attendeeCount: faker.number.int({ min: 20, max: 200 }),
      outcomes: convertToRichText(faker.lorem.paragraph()),
    }

    try {
      await upsertDocument(payload, 'events', event, 'slug')
      result.created++
    } catch (error) {
      result.errors.push(`Failed to create completed event ${event.title}: ${error}`)
      result.success = false
    }
  }

  return result
}

async function seedNavigation(payload: Payload): Promise<SeedResult> {
  console.log('🧭 Seeding navigation...')
  const result: SeedResult = {
    success: true,
    created: 0,
    updated: 0,
    errors: [],
    collection: 'nav',
  }

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

  try {
    // Update or create the global nav
    await payload.updateGlobal({
      slug: 'nav',
      data: navData,
    })
    result.created++
  } catch (error) {
    result.errors.push(`Failed to create navigation: ${error}`)
    result.success = false
  }

  return result
}

export async function runDevelopmentSeed(): Promise<SeedSummary> {
  console.log('🌱 Starting development seed process...')
  const startTime = new Date()

  try {
    validateEnvironment()
    const payload = await initPayload()

    const summary: SeedSummary = {
      environment: 'development',
      startTime,
      endTime: new Date(),
      duration: 0,
      results: [],
      totalCreated: 0,
      totalUpdated: 0,
      totalErrors: 0,
    }

    try {
      // Clear existing data if configured
      if (SEED_CONFIG.clearExisting) {
        await clearCollections(payload, SEED_CONFIG.collections)
      }

      // Seed data in order of dependencies
      const results = await Promise.all([
        seedPositions(payload),
        seedResearchAreas(payload),
      ])

      // Wait for positions to be created before seeding members
      await wait(1000)
      results.push(await seedMembers(payload))

      // Wait before seeding demos
      await wait(1000)
      results.push(await seedResearchDemos(payload))

      // Seed events (independent of other collections)
      await wait(1000)
      results.push(await seedEvents(payload))

      // Seed navigation last
      results.push(await seedNavigation(payload))

      summary.results = results
      summary.endTime = new Date()
      summary.duration = summary.endTime.getTime() - summary.startTime.getTime()
      summary.totalCreated = results.reduce((sum, r) => sum + r.created, 0)
      summary.totalUpdated = results.reduce((sum, r) => sum + r.updated, 0)
      summary.totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0)

      console.log('\n📊 Development Seed Summary:')
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
    console.error('💥 Fatal error during seeding:', error)
    throw error
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDevelopmentSeed()
    .then(() => {
      console.log('🎉 Development seeding completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Development seeding failed:', error)
      process.exit(1)
    })
}
