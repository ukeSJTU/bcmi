/**
 * Main seed script - detects environment and runs appropriate seeding
 */


async function main() {
  const environment = process.env.NODE_ENV || 'development'
  const seedType = process.argv[2] || environment

  console.log(`🌱 Running ${seedType} seed...`)

  try {
    if (seedType === 'production' || seedType === 'prod') {
      const { runProductionSeed } = await import('./production.js')
      await runProductionSeed()
    } else {
      const { runDevelopmentSeed } = await import('./development.js')
      await runDevelopmentSeed()
    }
    
    console.log('🎉 Seeding completed successfully!')
  } catch (error) {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  }
}

// Export functions for use in other scripts
export { runDevelopmentSeed } from './development'
export { runProductionSeed } from './production'

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
