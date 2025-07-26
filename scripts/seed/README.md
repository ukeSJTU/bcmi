# BCMI Data Seeding System

This directory contains scripts for seeding the Payload CMS database with both development test data and production content from the original BCMI website.

## Overview

The seeding system supports two main scenarios:

1. **Development**: Generate realistic test data using faker.js for UI testing
2. **Production**: Import real content from the original BCMI website data

## Prerequisites

Ensure you have the required environment variables set:

```bash
DATABASE_URI=postgresql://user:password@localhost:5432/bcmi_db
PAYLOAD_SECRET=your-secure-secret-key
```

## Available Scripts

### Quick Commands

```bash
# Auto-detect environment and run appropriate seed
pnpm seed

# Development seeding (generates fake data)
pnpm seed:dev

# Production seeding (imports real data)
pnpm seed:prod

# Reset database and seed with development data
pnpm seed:reset
```

### Manual Script Execution

```bash
# Run specific seed scripts directly
npx tsx scripts/seed/development.ts
npx tsx scripts/seed/production.ts
npx tsx scripts/seed/reset.ts
```

## What Gets Seeded

### Development Mode
- **Positions**: 5 position categories (Faculty, PhD, Masters, Undergraduate, Alumni)
- **Members**: 45 fake members with realistic profiles
  - 8 Faculty members with academic titles and research interests
  - 12 PhD students with faculty mentors
  - 15 Master students with faculty mentors
  - 10 Undergraduate students with faculty mentors
- **Research Areas**: 6 research topics with generated descriptions
- **Research Demos**: 12 demo projects with URLs and descriptions
- **Navigation**: Basic site navigation structure

### Production Mode
- **Positions**: Extracted from original members.json categories
- **Members**: Real BCMI lab members from original content
  - Preserves names, titles, departments, research interests
  - Handles photo uploads from public/media directory
  - Maintains faculty-student mentor relationships
- **Research Areas**: Real research areas from research.json
- **Navigation**: Site navigation based on original structure

## File Structure

```
scripts/seed/
├── index.ts           # Main entry point with environment detection
├── development.ts     # Faker.js test data generation
├── production.ts      # Original content import
├── reset.ts          # Database cleanup utility
└── shared/
    ├── utils.ts      # Common seeding utilities
    └── types.ts      # TypeScript interfaces
```

## Development Workflow

### Initial Setup
```bash
# 1. Start with clean database
pnpm seed:reset

# 2. Develop and test UI components
pnpm dev

# 3. Reset and reseed as needed during development
pnpm seed:reset
```

### Pre-Production
```bash
# Import real content for final testing
pnpm seed:prod
```

## Production Deployment

### Option 1: Seed During Build
```bash
# In your deployment script
npm run build
NODE_ENV=production npm run seed:prod
npm start
```

### Option 2: Seed After Deployment
```bash
# After deploying to server
ssh your-server
cd /path/to/bcmi
NODE_ENV=production npm run seed:prod
```

### Option 3: Docker Integration
```dockerfile
# In your Dockerfile
RUN npm run build
RUN NODE_ENV=production npm run seed:prod
```

## Data Sources

### Original Content
The production seeder uses files from `data/original-content/`:
- `members.json` - Lab member information
- `research.json` - Research areas and topics
- `homepage.json` - Navigation and site structure
- `events.json` - Event information (future enhancement)
- `resources.json` - Resource links (future enhancement)

### Media Files
Photos and images should be placed in `public/media/` directory. The seeder will:
- Upload files to Payload's media collection
- Generate thumbnails and optimize images
- Link media to appropriate content records

## Advanced Usage

### Custom Seed Configuration
Edit the `SEED_CONFIG` objects in each script to adjust:
- Number of generated records
- Data generation parameters
- File paths and media handling

### Selective Seeding
You can run individual seeding functions:

```typescript
import { seedMembers, seedPositions } from './scripts/seed/development'
// Run specific functions as needed
```

### Data Validation
The seeding scripts include:
- Environment variable validation
- Database connection verification
- Error handling and rollback
- Progress reporting and summaries

## Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
# Check your DATABASE_URI format
echo $DATABASE_URI
# Should be: postgresql://user:pass@host:port/database
```

**Permission Errors**
```bash
# Ensure database user has proper permissions
# Payload needs CREATE, READ, UPDATE, DELETE permissions
```

**Media Upload Failures**
```bash
# Check if media directory exists and has proper files
ls -la public/media/
# Ensure Sharp is installed for image processing
```

**Memory Issues with Large Datasets**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run seed:prod
```

### Debugging

Enable verbose logging by setting:
```bash
DEBUG=payload:* npm run seed:dev
```

### Clean Reset
If you need to completely start over:
```bash
# 1. Reset database
pnpm seed:reset

# 2. Clear uploaded media (optional)
rm -rf public/media/uploads/

# 3. Reseed
pnpm seed:dev
```

## Security Notes

- Never run production seeds with `clearExisting: true`
- Validate all environment variables before seeding
- Use strong `PAYLOAD_SECRET` values in production
- Consider running seeds in maintenance mode to avoid conflicts
- Backup your database before running production seeds

## Contributing

When adding new collections or modifying existing ones:

1. Update the TypeScript interfaces in `shared/types.ts`
2. Add seeding logic to both development and production scripts
3. Update this README with any new configuration options
4. Test both development and production seeding modes
