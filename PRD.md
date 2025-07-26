# Product Requirements Document (PRD)
# BCMI Website Rebuild

## Project Overview

Rebuild the BCMI (Brain-like Computing & Machine Intelligence) laboratory website at https://bcmi.sjtu.edu.cn/ with modern frameworks and an easy-to-use admin panel using Next.js 15 and Payload CMS.

## Pages to Build

### 1. Homepage (About) - `/`
- Hero carousel with laboratory introduction
- Welcome message and laboratory description
- Contact information section
- Navigation to other sections

### 2. Research - `/research`
- Research areas with detailed descriptions
- Project demonstrations with images
- Categorized research topics sidebar navigation
- Interactive demos and case studies

### 3. Members - `/members`
- Faculty member profiles with photos
- Categorized member listings (Faculty, PhD students, Graduate students, etc.)
- Research interests for each member
- Contact information and affiliations

### 4. Events - `/events`
- Upcoming conferences and deadlines
- Past events with descriptions
- Event calendar functionality
- External links to conference websites

### 5. Resources - `/resources`
- Downloadable datasets with descriptions and file sizes
- Tutorials and course materials
- Design resources and documentation
- External links and references

## Payload CMS Collections

### 1. Members Collection
```typescript
{
  slug: 'members',
  fields: [
    'name' (text, required),
    'title' (text, required), // Professor, PhD Student, etc.
    'department' (text),
    'photo' (upload, image),
    'researchInterests' (richText),
    'category' (select: Faculty/Postdoc/Graduate/Undergraduate/Alumni),
    'email' (email),
    'website' (url),
    'order' (number) // for sorting
  ]
}
```

### 2. Research Areas Collection
```typescript
{
  slug: 'researchAreas',
  fields: [
    'title' (text, required),
    'slug' (text, required),
    'description' (richText),
    'bulletPoints' (array of text),
    'demos' (array: {
      title: text,
      description: richText,
      images: array of uploads,
      links: array of urls
    }),
    'order' (number),
    'featured' (checkbox)
  ]
}
```

### 3. Events Collection
```typescript
{
  slug: 'events',
  fields: [
    'title' (text, required),
    'description' (richText),
    'startDate' (date),
    'endDate' (date),
    'deadline' (date),
    'website' (url),
    'category' (select: Conference/Workshop/Course/Seminar),
    'status' (select: Upcoming/Past),
    'featured' (checkbox),
    'location' (text),
    'organizer' (text)
  ]
}
```

### 4. Resources Collection
```typescript
{
  slug: 'resources',
  fields: [
    'name' (text, required),
    'description' (richText),
    'category' (select: DataSets/Tutorials/DesignResources/Links),
    'type' (select: Download/External Link/Course),
    'file' (upload), // for downloadable resources
    'externalUrl' (url), // for external links
    'fileSize' (text), // e.g., "1.2MB"
    'tags' (array of text),
    'featured' (checkbox),
    'order' (number)
  ]
}
```

### 5. Hero Slides Collection
```typescript
{
  slug: 'heroSlides',
  fields: [
    'title' (text),
    'subtitle' (text),
    'description' (richText),
    'backgroundImage' (upload, image),
    'ctaText' (text),
    'ctaLink' (url),
    'order' (number),
    'active' (checkbox)
  ]
}
```

## Payload Globals

### 1. Site Settings Global
```typescript
{
  slug: 'siteSettings',
  fields: [
    'siteName' (text, default: 'BCMI'),
    'siteSubtitle' (text, default: 'Brain-like Computing & Machine Intelligence'),
    'logo' (upload, image),
    'favicon' (upload, image),
    'aboutText' (richText), // for homepage description
    'contactInfo' (group: {
      phone: text,
      email: email,
      address: richText,
      mapUrl: url
    }),
    'socialMedia' (group: {
      twitter: url,
      linkedin: url,
      github: url,
      youtube: url
    }),
    'seoDefaults' (group: {
      metaTitle: text,
      metaDescription: text,
      metaImage: upload
    })
  ]
}
```

### 2. Navigation Global
```typescript
{
  slug: 'navigation',
  fields: [
    'mainNavigation' (array: {
      label: text,
      href: text,
      type: select (Internal/External),
      newTab: checkbox
    }),
    'footerNavigation' (array: {
      label: text,
      href: text,
      type: select (Internal/External)
    })
  ]
}
```

## Key Features

### Content Management
- Rich text editing with Lexical editor
- Image upload and management
- File upload for downloadable resources
- SEO optimization fields
- Draft/Published workflow

### User Experience
- Responsive design with Tailwind CSS
- Modern UI components with shadcn/ui
- Fast loading with Next.js 15 and Turbopack
- Accessible design patterns
- Search functionality

### Admin Experience
- Intuitive Payload CMS admin interface
- Bulk operations for content management
- Media library management
- User role management
- Content preview functionality

## Technical Requirements

- **Framework**: Next.js 15 with App Router
- **CMS**: Payload CMS v3.49 with PostgreSQL
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Package Manager**: pnpm
- **Deployment**: Compatible with Vercel/Netlify
- **Languages**: TypeScript throughout
- **No internationalization needed** (English only)

## Content Migration Strategy

1. Extract current content from existing website (completed - stored in `/data/original-content/`)
2. Create Payload collections and globals
3. Import existing content through Payload admin or migration scripts
4. Implement frontend pages with dynamic content from CMS
5. Test all functionality and content display
6. Deploy and migrate domain

## Success Criteria

- All existing content successfully migrated
- Modern, responsive design matching current functionality
- Easy content management through Payload admin
- Fast loading times and good SEO
- Accessible design meeting WCAG guidelines
- Clean, maintainable codebase for future development