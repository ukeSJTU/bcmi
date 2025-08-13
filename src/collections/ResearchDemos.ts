import { CollectionConfig } from 'payload'
import { createDeleteRevalidationHook, createRevalidationHook } from './hooks/revalidation'

export const ResearchDemos: CollectionConfig = {
  slug: 'research-demos',
  labels: {
    singular: 'Research Demo',
    plural: 'Research Demos',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'researchArea', 'isFeatured', 'order'],
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
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Research',
      admin: {
        description: 'Featured research demos are highlighted in the homepage carousel',
      },
    },
    {
      name: 'carouselImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Carousel Image',
      admin: {
        description: 'High-quality image for homepage carousel (recommended: 1200x600px)',
        condition: (data) => data.isFeatured,
      },
    },
    {
      name: 'carouselTitle',
      type: 'text',
      label: 'Carousel Title',
      admin: {
        description: 'Optional custom title for carousel display (uses demo title if not provided)',
        condition: (data) => data.isFeatured,
      },
    },
    {
      name: 'carouselDescription',
      type: 'textarea',
      label: 'Carousel Description',
      admin: {
        description: 'Short description for carousel display (uses demo description if not provided)',
        condition: (data) => data.isFeatured,
      },
    },
  ],
  hooks: {
    afterChange: [
      createRevalidationHook({
        collectionName: 'ResearchDemos',
        tags: ['research-demos', 'research'],
        paths: ['/research'], // Research demos appear on research page
        dynamicPaths: (doc) => {
          const paths = [`/research/${doc.id}`]
          // If this is a featured research demo, also revalidate homepage
          if (doc.isFeatured) {
            paths.push('/')
          }
          return paths
        },
      })
    ],
    afterDelete: [
      createDeleteRevalidationHook({
        collectionName: 'ResearchDemos',
        tags: ['research-demos', 'research'],
        paths: ['/research'],
      })
    ],
  },
}
