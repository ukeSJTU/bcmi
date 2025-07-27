import { CollectionConfig } from 'payload'
import { createDeleteRevalidationHook, createRevalidationHook } from './hooks/revalidation'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Event',
    plural: 'Events',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventType', 'startDate', 'status', 'isPublished'],
    listSearchableFields: ['title', 'description'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // Basic Information
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Event Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'URL-friendly identifier for this event (auto-generated from title if not provided)',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Event Description',
      admin: {
        description: 'Detailed description of the event',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Short Summary',
      admin: {
        description: 'Brief summary for event listing cards (optional, will use truncated description if not provided)',
      },
    },

    // Event Classification
    {
      name: 'eventType',
      type: 'select',
      required: true,
      label: 'Event Type',
      options: [
        { label: 'Conference', value: 'conference' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Seminar', value: 'seminar' },
        { label: 'Symposium', value: 'symposium' },
        { label: 'Lecture', value: 'lecture' },
        { label: 'Competition', value: 'competition' },
        { label: 'Meeting', value: 'meeting' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'seminar',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Event Status',
      options: [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'upcoming',
    },

    // Date and Time
    {
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Start Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'End Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Leave empty for single-day events',
      },
    },
    {
      name: 'timezone',
      type: 'text',
      label: 'Timezone',
      defaultValue: 'Asia/Shanghai',
      admin: {
        description: 'Timezone for the event (e.g., "Asia/Shanghai", "UTC")',
      },
    },

    // Location
    {
      name: 'location',
      type: 'group',
      label: 'Location Details',
      fields: [
        {
          name: 'venue',
          type: 'text',
          label: 'Venue Name',
          admin: {
            description: 'Name of the venue, building, or platform',
          },
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Address',
          admin: {
            description: 'Physical address or online meeting details',
          },
        },
        {
          name: 'room',
          type: 'text',
          label: 'Room/Hall',
          admin: {
            description: 'Specific room, hall, or meeting ID',
          },
        },
        {
          name: 'isOnline',
          type: 'checkbox',
          label: 'Online Event',
          defaultValue: false,
        },
      ],
    },

    // Event Details
    {
      name: 'organizer',
      type: 'text',
      label: 'Organizer',
      admin: {
        description: 'Organization or person organizing the event',
      },
    },
    {
      name: 'speakers',
      type: 'array',
      label: 'Speakers/Presenters',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Speaker Name',
        },
        {
          name: 'affiliation',
          type: 'text',
          label: 'Affiliation',
        },
        {
          name: 'bio',
          type: 'textarea',
          label: 'Speaker Bio',
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Speaker Photo',
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Tags for categorizing and filtering events',
      },
    },

    // Media
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
      admin: {
        description: 'Main image for the event (used in listings and detail page)',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Photo Gallery',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
        },
      ],
    },

    // Links and Resources
    {
      name: 'externalLinks',
      type: 'array',
      label: 'External Links',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Link Title',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
        {
          name: 'type',
          type: 'select',
          label: 'Link Type',
          options: [
            { label: 'Registration', value: 'registration' },
            { label: 'Website', value: 'website' },
            { label: 'Program', value: 'program' },
            { label: 'Materials', value: 'materials' },
            { label: 'Recording', value: 'recording' },
            { label: 'Other', value: 'other' },
          ],
          defaultValue: 'other',
        },
      ],
    },

    // Meta Information
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        description: 'Order for sorting events (lower numbers first)',
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: true,
      label: 'Published',
      admin: {
        description: 'Whether this event is visible on the website',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Event',
      admin: {
        description: 'Featured events are highlighted on the homepage and events page',
      },
    },

    // Additional Details for completed events
    {
      name: 'attendeeCount',
      type: 'number',
      label: 'Number of Attendees',
      admin: {
        description: 'For completed events - how many people attended',
      },
    },
    {
      name: 'outcomes',
      type: 'richText',
      label: 'Event Outcomes',
      admin: {
        description: 'For completed events - summary of outcomes, achievements, or key takeaways',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.title && !data?.slug) {
          // Auto-generate slug from title if not provided
          data.slug = data.title.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')
        }
      },
    ],
    afterChange: [
      createRevalidationHook({
        collectionName: 'Events',
        tags: ['events'],
        paths: ['/events'],
      })
    ],
    afterDelete: [
      createDeleteRevalidationHook({
        collectionName: 'Events',
        tags: ['events'],
        paths: ['/events'],
      })
    ],
  },
}