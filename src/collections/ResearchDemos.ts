import { CollectionConfig } from 'payload'

export const ResearchDemos: CollectionConfig = {
  slug: 'research-demos',
  labels: {
    singular: 'Research Demo',
    plural: 'Research Demos',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'researchArea', 'order'],
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
      label: 'Demo Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Demo Description',
      admin: {
        description: 'Optional description of the demo',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Demo Image',
      admin: {
        description: 'Optional image to showcase the demo',
      },
    },
    {
      name: 'demoUrl',
      type: 'text',
      required: true,
      label: 'Demo URL',
      admin: {
        description: 'Link to the demo detail page or external demo',
      },
    },
    {
      name: 'isExternal',
      type: 'checkbox',
      defaultValue: false,
      label: 'External Link',
      admin: {
        description: 'Check if this link goes to an external website',
      },
    },
    {
      name: 'researchArea',
      type: 'relationship',
      relationTo: 'research-areas',
      required: true,
      label: 'Research Area',
      admin: {
        description: 'Which research area this demo belongs to',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        description: 'Order in which this demo appears within its research area',
      },
    },
  ],
}
