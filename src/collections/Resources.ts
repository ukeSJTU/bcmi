import { CollectionConfig } from 'payload'
import { createDeleteRevalidationHook, createRevalidationHook } from './hooks/revalidation'

export const Resources: CollectionConfig = {
  slug: 'resources',
  labels: {
    singular: 'Resource',
    plural: 'Resources',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'resourceType', 'category', 'isPublished'],
    listSearchableFields: ['title', 'description', 'summary'],
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
      label: 'Resource Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'URL-friendly identifier for this resource (auto-generated from title if not provided)',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Detailed Description',
      admin: {
        description: 'Full description of the resource',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Short Summary',
      admin: {
        description: 'Brief summary for resource cards (optional, will use truncated description if not provided)',
      },
    },

    // Resource Classification
    {
      name: 'resourceType',
      type: 'select',
      required: true,
      label: 'Resource Type',
      options: [
        { label: 'Dataset', value: 'dataset' },
        { label: 'Software/Tool', value: 'software' },
        { label: 'Course', value: 'course' },
        { label: 'Tutorial', value: 'tutorial' },
        { label: 'Documentation', value: 'documentation' },
        { label: 'Publication', value: 'publication' },
        { label: 'Code Repository', value: 'code' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'dataset',
    },
    {
      name: 'category',
      type: 'text',
      label: 'Category',
      admin: {
        description: 'Category for organizing resources (e.g., "Machine Learning", "EEG Data", "Computer Vision")',
      },
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
        description: 'Tags for search and filtering',
      },
    },

    // File/Download Information (for datasets, software, etc.)
    {
      name: 'downloadInfo',
      type: 'group',
      label: 'Download Information',
      admin: {
        description: 'Information for downloadable resources',
      },
      fields: [
        {
          name: 'hasDownload',
          type: 'checkbox',
          label: 'Has Download',
          defaultValue: false,
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          label: 'File Upload',
          admin: {
            condition: (data) => data.downloadInfo?.hasDownload,
            description: 'Upload the actual file for download',
          },
        },
        {
          name: 'downloadUrl',
          type: 'text',
          label: 'External Download URL',
          admin: {
            condition: (data) => data.downloadInfo?.hasDownload,
            description: 'URL to external download (use this if file is hosted elsewhere)',
          },
        },
        {
          name: 'fileSize',
          type: 'text',
          label: 'File Size',
          admin: {
            condition: (data) => data.downloadInfo?.hasDownload,
            description: 'Human-readable file size (e.g., "1.2MB", "10.8GB")',
          },
        },
        {
          name: 'format',
          type: 'text',
          label: 'File Format',
          admin: {
            condition: (data) => data.downloadInfo?.hasDownload,
            description: 'File format/extension (e.g., "ZIP", "RAR", "CSV", "JSON")',
          },
        },
        {
          name: 'requirements',
          type: 'textarea',
          label: 'System Requirements',
          admin: {
            condition: (data) => data.downloadInfo?.hasDownload,
            description: 'Any system requirements or dependencies',
          },
        },
      ],
    },

    // Course/Tutorial Information
    {
      name: 'courseInfo',
      type: 'group',
      label: 'Course Information',
      admin: {
        description: 'Information for courses and tutorials',
      },
      fields: [
        {
          name: 'isCourse',
          type: 'checkbox',
          label: 'Is Course/Tutorial',
          defaultValue: false,
        },
        {
          name: 'instructor',
          type: 'text',
          label: 'Instructor/Author',
          admin: {
            condition: (data) => data.courseInfo?.isCourse,
          },
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Duration',
          admin: {
            condition: (data) => data.courseInfo?.isCourse,
            description: 'Course duration (e.g., "8 weeks", "20 hours")',
          },
        },
        {
          name: 'difficulty',
          type: 'select',
          label: 'Difficulty Level',
          options: [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
          ],
          admin: {
            condition: (data) => data.courseInfo?.isCourse,
          },
        },
        {
          name: 'prerequisites',
          type: 'textarea',
          label: 'Prerequisites',
          admin: {
            condition: (data) => data.courseInfo?.isCourse,
            description: 'Required knowledge or skills',
          },
        },
        {
          name: 'syllabus',
          type: 'richText',
          label: 'Syllabus/Content',
          admin: {
            condition: (data) => data.courseInfo?.isCourse,
            description: 'Detailed course content or syllabus',
          },
        },
      ],
    },

    // Publication Information
    {
      name: 'publicationInfo',
      type: 'group',
      label: 'Publication Information',
      admin: {
        description: 'Information for research publications and papers',
      },
      fields: [
        {
          name: 'isPublication',
          type: 'checkbox',
          label: 'Is Publication',
          defaultValue: false,
        },
        {
          name: 'authors',
          type: 'text',
          label: 'Authors',
          admin: {
            condition: (data) => data.publicationInfo?.isPublication,
          },
        },
        {
          name: 'journal',
          type: 'text',
          label: 'Journal/Conference',
          admin: {
            condition: (data) => data.publicationInfo?.isPublication,
          },
        },
        {
          name: 'year',
          type: 'number',
          label: 'Publication Year',
          admin: {
            condition: (data) => data.publicationInfo?.isPublication,
          },
        },
        {
          name: 'doi',
          type: 'text',
          label: 'DOI',
          admin: {
            condition: (data) => data.publicationInfo?.isPublication,
            description: 'Digital Object Identifier',
          },
        },
        {
          name: 'abstract',
          type: 'richText',
          label: 'Abstract',
          admin: {
            condition: (data) => data.publicationInfo?.isPublication,
          },
        },
      ],
    },

    // External Links
    {
      name: 'links',
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
            { label: 'Website', value: 'website' },
            { label: 'GitHub Repository', value: 'github' },
            { label: 'Documentation', value: 'docs' },
            { label: 'Demo', value: 'demo' },
            { label: 'Download', value: 'download' },
            { label: 'Paper/Publication', value: 'publication' },
            { label: 'Video', value: 'video' },
            { label: 'Other', value: 'other' },
          ],
          defaultValue: 'website',
        },
      ],
    },

    // Media
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
      admin: {
        description: 'Main image for the resource (used in listings and detail view)',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Image Gallery',
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

    // Meta Information
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        description: 'Order for sorting resources (lower numbers first)',
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: true,
      label: 'Published',
      admin: {
        description: 'Whether this resource is visible on the website',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Resource',
      admin: {
        description: 'Featured resources are highlighted on the homepage and resources page',
      },
    },
    {
      name: 'accessLevel',
      type: 'select',
      label: 'Access Level',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Members Only', value: 'members' },
        { label: 'Restricted', value: 'restricted' },
      ],
      defaultValue: 'public',
      admin: {
        description: 'Who can access this resource',
      },
    },

    // Usage Statistics
    {
      name: 'downloadCount',
      type: 'number',
      defaultValue: 0,
      label: 'Download Count',
      admin: {
        description: 'Number of times this resource has been downloaded (auto-updated)',
        readOnly: true,
      },
    },
    {
      name: 'viewCount',
      type: 'number',
      defaultValue: 0,
      label: 'View Count',
      admin: {
        description: 'Number of times this resource has been viewed (auto-updated)',
        readOnly: true,
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
        collectionName: 'Resources',
        tags: ['resources'],
        paths: ['/resources'],
      })
    ],
    afterDelete: [
      createDeleteRevalidationHook({
        collectionName: 'Resources',
        tags: ['resources'],
        paths: ['/resources'],
      })
    ],
  },
}