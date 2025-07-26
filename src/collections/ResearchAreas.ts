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
  },
}
