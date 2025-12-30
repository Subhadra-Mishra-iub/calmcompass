# Project Overview: CalmCompass

## What is CalmCompass?

CalmCompass is an emotional well-being tracking application that helps users:
- Track daily emotions through check-ins
- Manage custom emotions and associated actions
- Build healthier habits through action tracking
- Review emotional patterns over time

## Project Architecture

CalmCompass is built as a **Next.js full-stack application**, which means both frontend and backend code live together in a single codebase.

### Frontend (User Interface)

**Location:** `app/*/page.tsx` files and `components/`

**Pages:**
- `app/page.tsx` - Home/Landing page
- `app/login/page.tsx` - Login page
- `app/signup/page.tsx` - Signup page
- `app/dashboard/page.tsx` - Main dashboard with check-in button
- `app/emotions/page.tsx` - Emotions management page
- `app/history/page.tsx` - Check-in history with filters

**Components:**
- `components/Navbar.tsx` - Navigation bar
- `components/CheckInButton.tsx` - Check-in trigger button
- `components/CheckInModal.tsx` - Modal for creating check-ins
- `components/EmotionsManager.tsx` - Emotions and actions CRUD UI
- `components/HistoryView.tsx` - History display with filters

### Backend (API & Logic)

**Location:** `app/api/*/route.ts` files

**API Routes:**
- `app/api/auth/signup/route.ts` - User registration
- `app/api/auth/[...nextauth]/route.ts` - NextAuth handlers
- `app/api/emotions/route.ts` - Emotion CRUD operations
- `app/api/emotions/[id]/route.ts` - Emotion delete
- `app/api/actions/route.ts` - Action CRUD operations
- `app/api/actions/[id]/route.ts` - Action delete
- `app/api/check-ins/route.ts` - Create check-ins
- `app/api/check-ins/history/route.ts` - Get check-in history

### Shared Code

- `lib/db.ts` - Prisma database client
- `lib/auth.ts` - Authentication utilities (password hashing, user operations)
- `auth.ts` - NextAuth configuration
- `prisma/schema.prisma` - Database schema definition
- `prisma/seed.ts` - Database seeding script

## Why This Structure Works

1. **Single Deployment**: Deploy once to Vercel, frontend and backend work together seamlessly
2. **No CORS Issues**: Same domain for frontend and API routes
3. **Type Safety**: TypeScript shared between frontend and backend
4. **Easy Maintenance**: Related code stays together logically
5. **Server-Side Rendering**: Fast page loads with Next.js SSR capabilities
6. **API Routes as Serverless Functions**: Vercel automatically converts API routes to serverless functions

## How Vercel Deploys This

When deployed to Vercel:
- Vercel automatically detects Next.js framework
- Builds everything together (`npm run build`)
- Deploys pages as server-rendered React components
- Deploys API routes as serverless functions
- Handles routing automatically
- Provides HTTPS and CDN automatically

**You don't need to separate frontend/backend - Next.js handles it automatically!**

## Database Schema

The application uses PostgreSQL with the following schema:

- **users** - User accounts with email/password authentication
- **emotions** - User-defined emotions (e.g., "Anxious", "Happy", "Stressed")
- **actions** - Actions associated with emotions (e.g., "Take deep breaths", "Go for a walk")
- **check_ins** - Daily emotional check-ins with emotion and optional notes
- **check_in_actions** - Junction table tracking which actions were completed during check-ins

See `prisma/schema.prisma` for the complete schema definition.




