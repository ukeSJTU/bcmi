import { CollectionConfig } from 'payload'
import { createDeleteRevalidationHook, createRevalidationHook } from './hooks/revalidation'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 400,
        position: 'centre',
      },
      {
        name: 'demo',
        width: 600,
        height: 400,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      admin: {
        description: 'Alternative text for screen readers and SEO',
      },
    },
  ],
  hooks: {
    afterChange: [
      createRevalidationHook({
        collectionName: 'Media',
        tags: ['media', 'members', 'research'], // Media can be used in members (photos) and research (demo images)
        paths: ['/members', '/research'], // Both pages may display media
      })
    ],
    afterDelete: [
      createDeleteRevalidationHook({
        collectionName: 'Media',
        tags: ['media', 'members', 'research'],
        paths: ['/members', '/research'],
      })
    ],
  },
}
