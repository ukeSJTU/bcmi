import { CollectionConfig } from 'payload'
import { createDeleteRevalidationHook, createRevalidationHook } from './hooks/revalidation'

export const Members: CollectionConfig = {
  slug: 'members',
  labels: {
    singular: 'Member',
    plural: 'Members',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'mentor', 'isActive'],
    listSearchableFields: ['name', 'email'],
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
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Photo',
      admin: {
        description: 'Professional headshot or profile photo',
      },
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
    },

    // Organizational Structure
    {
      name: 'position',
      type: 'relationship',
      relationTo: 'positions',
      required: true,
      label: 'Position',
      admin: {
        description: 'Which position category this member belongs to',
      },
    },
    {
      name: 'mentor',
      type: 'relationship',
      relationTo: 'members',
      label: 'Mentor',
      admin: {
        description: 'Faculty member who mentors this person (leave empty for faculty)',
      },
      filterOptions: {
        'position.slug': {
          equals: 'faculty-members',
        },
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        description: 'Order within position/mentor group (lower numbers first)',
      },
    },

    // Detailed Information (mainly for faculty)
    {
      name: 'title',
      type: 'text',
      label: 'Academic Title',
      admin: {
        description: 'e.g., "Professor", "Associate Professor", "Lecturer"',
      },
    },
    {
      name: 'department',
      type: 'text',
      label: 'Department',
      admin: {
        description: 'Department or affiliation',
      },
    },
    {
      name: 'researchInterests',
      type: 'textarea',
      label: 'Research Interests',
      admin: {
        description: 'Brief description of research areas and interests',
      },
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'Biography',
      admin: {
        description: 'Detailed biographical information',
      },
    },

    // Contact Information
    {
      name: 'officeLocation',
      type: 'text',
      label: 'Office Location',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'personalWebsite',
      type: 'text',
      label: 'Personal Website',
      admin: {
        description: 'URL to personal or academic homepage',
      },
    },

    // Academic Background
    {
      name: 'education',
      type: 'richText',
      label: 'Education',
      admin: {
        description: 'Educational background and degrees',
      },
    },

    // Meta Information
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Currently Active',
      admin: {
        description: 'Whether this member is currently with the lab (uncheck for alumni)',
      },
    },
    {
      name: 'joinDate',
      type: 'date',
      label: 'Join Date',
      admin: {
        description: 'When this member joined the lab',
      },
    },
  ],
  hooks: {
    afterChange: [
      createRevalidationHook({
        collectionName: 'Members',
        tags: ['members', 'positions'], // Members page depends on both members and positions data
        paths: ['/members'], // Also revalidate the members page directly
        dynamicPaths: (doc) => [`/members/${doc.id}`], // Revalidate the individual member page
      })
    ],
    afterDelete: [
      createDeleteRevalidationHook({
        collectionName: 'Members',
        tags: ['members'],
        paths: ['/members'],
      })
    ],
  },
}