import { CollectionConfig } from 'payload'

export const Positions: CollectionConfig = {
  slug: 'positions',
  labels: {
    singular: 'Position',
    plural: 'Positions',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'displayOrder', 'isVisible', 'showMentorGrouping'],
    listSearchableFields: ['title'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Position Title',
      admin: {
        description: 'Display name for this position (e.g., "Faculty Members", "PhD Students")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'URL-friendly identifier (auto-generated from title)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Optional description for this position category',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        description: 'Order in which this position appears in the sidebar (lower numbers first)',
      },
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      defaultValue: true,
      label: 'Visible in Sidebar',
      admin: {
        description: 'Whether this position should be shown in the members sidebar',
      },
    },
    {
      name: 'showMentorGrouping',
      type: 'checkbox',
      defaultValue: false,
      label: 'Group by Mentor',
      admin: {
        description: 'Whether members in this position should be grouped by their mentor',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.title && !data?.slug) {
          // Auto-generate slug from title
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .trim()
        }
      },
    ],
    afterChange: [
      async ({ operation }) => {
        // Trigger revalidation when position visibility or order changes
        if (operation === 'update' || operation === 'create') {
          try {
            const frontendUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
            const revalidationSecret = process.env.REVALIDATION_SECRET
            
            if (!revalidationSecret) {
              console.warn('[Position Hook] REVALIDATION_SECRET not configured, skipping revalidation')
              return
            }

            // Revalidate using cache tags for more granular control
            const tagsToRevalidate = ['positions', 'members']
            
            for (const tag of tagsToRevalidate) {
              const revalidateUrl = `${frontendUrl}/api/revalidate`
              
              console.log(`[Position Hook] Triggering revalidation for tag: ${tag}`)
              
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
                console.error(`[Position Hook] Failed to revalidate tag ${tag}:`, await response.text())
              } else {
                console.log(`[Position Hook] Successfully revalidated tag ${tag}`)
              }
            }
          } catch (error) {
            console.error('[Position Hook] Revalidation error:', error)
          }
        }
      },
    ],
  },
}