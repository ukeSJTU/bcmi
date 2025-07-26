import { CollectionConfig } from 'payload'

export const ResearchAreas: CollectionConfig = {
  slug: 'research-areas',
  labels: {
    singular: 'Research Area',
    plural: 'Research Areas',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'anchor', 'order', 'isVisible'],
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
      label: 'Research Area Title',
    },
    {
      name: 'anchor',
      type: 'text',
      required: true,
      unique: true,
      label: 'Anchor ID',
      admin: {
        description: 'Used for URL anchors (e.g., "cv", "bci"). Must be unique and URL-friendly.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
      admin: {
        description: 'Main description text for this research area',
      },
    },
    {
      name: 'bulletPoints',
      type: 'array',
      label: 'Research Focus Points',
      fields: [
        {
          name: 'point',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        description: 'Order in which this area appears in the sidebar and page',
      },
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      defaultValue: true,
      label: 'Visible on Website',
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.anchor) {
          // Auto-generate URL-friendly anchor from title if not provided
          data.anchor = data.anchor.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim('-')
        }
      },
    ],
    afterChange: [
      async ({ operation }) => {
        // Trigger revalidation when research area visibility or order changes
        if (operation === 'update' || operation === 'create') {
          try {
            const frontendUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
            const revalidationSecret = process.env.REVALIDATION_SECRET
            
            if (!revalidationSecret) {
              console.warn('[ResearchArea Hook] REVALIDATION_SECRET not configured, skipping revalidation')
              return
            }

            // Revalidate research page when research areas change
            const revalidateUrl = `${frontendUrl}/api/revalidate`
            
            console.log('[ResearchArea Hook] Triggering revalidation for research page')
            
            const response = await fetch(revalidateUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                tag: 'research-areas',
                secret: revalidationSecret,
              }),
            })

            if (!response.ok) {
              console.error('[ResearchArea Hook] Failed to revalidate:', await response.text())
            } else {
              console.log('[ResearchArea Hook] Successfully revalidated research page')
            }
          } catch (error) {
            console.error('[ResearchArea Hook] Revalidation error:', error)
          }
        }
      },
    ],
  },
}
