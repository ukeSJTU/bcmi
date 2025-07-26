import { GlobalConfig } from 'payload'
import { createGlobalRevalidationHook } from '../collections/hooks/revalidation'

export const Nav: GlobalConfig = {
  slug: 'nav',
  label: 'Navigation',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      maxRows: 8,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
        {
          name: 'newTab',
          type: 'checkbox',
          defaultValue: false,
        }
      ],
    },
  ],
  hooks: {
    afterChange: [
      createGlobalRevalidationHook({
        globalName: 'Nav',
        tags: ['navigation', 'nav'],
        paths: ['/', '/members', '/research', '/events', '/resources'], // Nav affects all pages
      })
    ],
  },
}
