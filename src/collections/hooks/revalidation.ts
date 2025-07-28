/**
 * Utility function for triggering Next.js revalidation from Payload hooks
 */

interface RevalidationConfig {
  tags?: string[]
  paths?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dynamicPaths?: (doc: any) => string[]
  collectionName: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function triggerRevalidation(config: RevalidationConfig, doc?: any): Promise<void> {
  const { tags = [], paths = [], dynamicPaths, collectionName } = config
  
  // Add dynamic paths if provided
  const allPaths = [...paths]
  if (dynamicPaths && doc) {
    allPaths.push(...dynamicPaths(doc))
  }
  
  try {
    const frontendUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const revalidationSecret = process.env.REVALIDATION_SECRET
    
    if (!revalidationSecret) {
      console.warn(`[${collectionName} Hook] REVALIDATION_SECRET not configured, skipping revalidation`)
      return
    }

    const revalidateUrl = `${frontendUrl}/api/revalidate`

    // Revalidate by tags
    for (const tag of tags) {
      console.log(`[${collectionName} Hook] Triggering revalidation for tag: ${tag}`)
      
      const response = await fetch(revalidateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tag,
          secret: revalidationSecret,
        }),
      })

      if (!response.ok) {
        console.error(`[${collectionName} Hook] Failed to revalidate tag ${tag}:`, await response.text())
      } else {
        console.log(`[${collectionName} Hook] Successfully revalidated tag ${tag}`)
      }
    }

    // Revalidate by paths
    for (const path of allPaths) {
      console.log(`[${collectionName} Hook] Triggering revalidation for path: ${path}`)
      
      const response = await fetch(revalidateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path,
          secret: revalidationSecret,
        }),
      })

      if (!response.ok) {
        console.error(`[${collectionName} Hook] Failed to revalidate path ${path}:`, await response.text())
      } else {
        console.log(`[${collectionName} Hook] Successfully revalidated path ${path}`)
      }
    }
  } catch (error) {
    console.error(`[${collectionName} Hook] Revalidation error:`, error)
  }
}

/**
 * Standard afterChange hook that can be used across collections
 */
export function createRevalidationHook(config: Omit<RevalidationConfig, 'collectionName'> & { collectionName: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async ({ doc, operation }: { doc: any, operation: string }) => {
    if (operation === 'update' || operation === 'create' || operation === 'delete') {
      await triggerRevalidation(config, doc)
    }
  }
}

/**
 * Standard afterDelete hook that can be used across collections
 */
export function createDeleteRevalidationHook(config: Omit<RevalidationConfig, 'collectionName'> & { collectionName: string }) {
  return async () => {
    await triggerRevalidation(config)
  }
}

/**
 * Standard afterChange hook for globals
 */
export function createGlobalRevalidationHook(config: Omit<RevalidationConfig, 'collectionName'> & { globalName: string }) {
  return async () => {
    await triggerRevalidation({
      ...config,
      collectionName: config.globalName,
    })
  }
}
