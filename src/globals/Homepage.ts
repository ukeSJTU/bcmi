import { GlobalConfig } from 'payload'
import { createGlobalRevalidationHook } from '../collections/hooks/revalidation'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage Content',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'heroTitle',
      type: 'text',
      label: 'Hero Section Title',
      required: false,
      admin: {
        description: 'Main headline for the fallback hero section',
      },
    },
    {
      name: 'heroSubtitle',
      type: 'text',
      label: 'Hero Section Subtitle',
      required: false,
      admin: {
        description: 'Subtitle text for the fallback hero section',
      },
    },
    {
      name: 'aboutContent',
      type: 'textarea',
      label: 'About Section Content',
      required: false,
      admin: {
        description: 'Main description of the BCMI laboratory (plain text)',
        rows: 8,
      },
    },
    {
      name: 'contactPhone',
      type: 'text',
      label: 'Contact Phone',
      required: false,
      admin: {
        description: 'Laboratory contact phone number',
      },
    },
    {
      name: 'contactAddress',
      type: 'text',
      label: 'Contact Address',
      required: false,
      admin: {
        description: 'Laboratory physical address',
      },
    },
  ],
  hooks: {
    afterChange: [
      createGlobalRevalidationHook({
        globalName: 'Homepage',
        tags: ['homepage'],
        paths: ['/'], // Homepage only
      })
    ],
  },
}