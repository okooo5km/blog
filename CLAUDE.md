# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog website built with Next.js 14 App Router, TypeScript, and Tailwind CSS. The site uses Sanity CMS for content management, PostgreSQL (via Neon) for data storage, and Clerk for authentication.

## Essential Commands

### Development
```bash
pnpm dev          # Start development server on port 3000
pnpm dev:turbo    # Start with Turbo mode for faster builds
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Database Management
```bash
pnpm db:generate  # Generate Drizzle migrations
pnpm db:push      # Push database changes to Neon PostgreSQL
```

### Email Development
```bash
pnpm dev:email    # Start React Email dev server on port 3333
```

## Architecture Overview

### App Structure
- **App Router**: All pages are in `/app` using Next.js 14 App Router
- **Layout Groups**: 
  - `(main)` - Public-facing pages with shared layout
  - `(auth)` - Authentication pages (sign-in/sign-up)
  - `admin` - Admin dashboard for content management
  - `studio` - Sanity CMS Studio route

### Key Technologies & Patterns

1. **Content Management**: Sanity CMS v3
   - Schemas in `/sanity/schemas/`
   - GROQ queries for fetching content
   - Portable Text for rich content rendering

2. **Database**: PostgreSQL via Neon + Drizzle ORM
   - Schema: `/db/schema.ts`
   - Queries: `/db/queries/`
   - Tables: subscribers, newsletters, comments, guestbook

3. **Authentication**: Clerk
   - Middleware protection for admin routes
   - User management for comments/guestbook

4. **Styling**: Tailwind CSS + Radix UI
   - Custom components in `/components/ui/`
   - Dark mode support via next-themes
   - Typography plugin for prose content

5. **Email**: React Email + Resend
   - Templates in `/emails/`
   - Notification system for new comments/subscribers

6. **State Management**: 
   - Valtio for global state
   - React Query for server state

### API Routes Pattern
- Located in `/app/api/`
- Rate limiting with Upstash Redis
- CORS handling for external access

### Environment Variables
All required environment variables are documented in `.env.example`:
- Clerk authentication (CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
- Database connection (DATABASE_URL)
- Sanity CMS (project ID, dataset)
- Email service (Resend API key, notification emails)
- Redis for rate limiting (Upstash credentials)

### Deployment
- Configured for Vercel deployment
- Turbo build support enabled
- Automatic redirects for social media links configured in `next.config.mjs`

## Key Features
- Blog with MDX support and code highlighting
- Project showcase with live demos
- Newsletter system with subscription management
- Guestbook with authentication
- Admin dashboard for content moderation
- Dark mode support
- WeChat integration for Chinese users
- RSS feed generation