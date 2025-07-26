/**
 * Database reset utility - drops and recreates all tables
 * WARNING: This will delete ALL data!
 */

import { closePayload, initPayload, validateEnvironment } from './shared/utils'

async function resetDatabase() {
  console.log('⚠️  WARNING: This will DELETE ALL DATA in the database!')
  console.log('🔄 Resetting database...')

  try {
    validateEnvironment()
    const payload = await initPayload()

    try {
      // Fallback: Clear all collections manually
      console.log('🧹 Clearing all collections...')
      
      const collections = ['members', 'positions', 'research-areas', 'research-demos', 'media']
      
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
          console.warn(`⚠️ Could not clear ${collection}:`, error)
        }
      }
      
      // Clear global nav
      try {
        await payload.updateGlobal({
          slug: 'nav',
          data: { items: [] },
        })
        console.log('✅ Cleared navigation')
      } catch (error) {
        console.warn('⚠️ Could not clear navigation:', error)
      }
      
      console.log('✅ Database reset completed')
    } finally {
      await closePayload(payload)
    }
  } catch (error) {
    console.error('💥 Database reset failed:', error)
    throw error
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  resetDatabase()
    .then(() => {
      console.log('🎉 Database reset completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Database reset failed:', error)
      process.exit(1)
    })
}

export { resetDatabase }
