# CalmCompass

A modern web application for tracking emotional well-being through daily check-ins, emotion management, and actionable insights.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Overview

CalmCompass helps users track their emotional state daily, manage personalized emotions and associated actions, and review patterns over time. Built with modern web technologies and deployed on free-tier infrastructure, it's accessible to anyone.

## Features

- 🔐 **Secure Authentication**: Sign up and login with email/password (passwords are hashed with bcrypt)
- 😊 **Emotion Management**: Create and manage custom emotions (e.g., "Anxious", "Happy", "Stressed")
- ✅ **Action Tracking**: Associate helpful actions with each emotion
- 📝 **Daily Check-ins**: Quick check-ins to record your current emotional state with optional notes
- 📊 **History & Analytics**: View past check-ins with filtering by emotion and date range
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (Credentials provider)
- **Hosting**: Vercel (frontend/backend)
- **Database Hosting**: Supabase (PostgreSQL)
- **Testing**: Vitest (unit tests) + Playwright (E2E tests)
- **CI/CD**: GitHub Actions

## Quick Start

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- PostgreSQL database (Supabase recommended - free tier available)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Subhadra-Mishra-iub/calmcompass.git
   cd calmcompass
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/calmcompass?schema=public"
   AUTH_SECRET="generate-a-random-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```
   
   Generate a secure `AUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

4. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed  # Optional: seed with sample data
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

For detailed setup instructions, see [instructions/02-initial-setup.md](./instructions/02-initial-setup.md).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests with Vitest
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:seed` - Seed the database
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
calmcompass/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (backend)
│   ├── dashboard/         # Dashboard page
│   ├── emotions/          # Emotions management page
│   ├── history/           # Check-in history page
│   ├── login/             # Login page
│   └── signup/            # Signup page
├── components/            # React components
├── lib/                   # Utility functions and database client
├── prisma/                # Prisma schema and migrations
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed script
├── instructions/          # Setup and deployment documentation
└── auth.ts                # NextAuth configuration
```

## Database Schema

- **User**: User accounts with email/password authentication
- **Emotion**: User-defined emotions (e.g., Anxious, Happy, Stressed)
- **Action**: Actions associated with emotions (e.g., "Take deep breaths")
- **CheckIn**: Daily emotional check-ins with emotion and optional notes
- **CheckInAction**: Junction table tracking completed actions per check-in

See `prisma/schema.prisma` for the complete schema definition.

## Deployment

The application is designed to be deployed to Vercel (hosting) and Supabase (database), both offering generous free tiers.

For detailed deployment instructions, see [instructions/04-deployment-guide.md](./instructions/04-deployment-guide.md).

### Quick Deployment Steps

1. Push code to GitHub
2. Create a Supabase project and get connection string
3. Deploy to Vercel with environment variables:
   - `DATABASE_URL` - Supabase connection string
   - `AUTH_SECRET` - Generated secret
   - `NEXTAUTH_URL` - Your Vercel deployment URL
4. Push database schema: `npx prisma db push`
5. Your app is live! 🎉

## Documentation

Comprehensive documentation is available in the `instructions/` directory:

- [01-project-overview.md](./instructions/01-project-overview.md) - Architecture and structure
- [02-initial-setup.md](./instructions/02-initial-setup.md) - Local development setup
- [03-database-connection.md](./instructions/03-database-connection.md) - Database connection guide
- [04-deployment-guide.md](./instructions/04-deployment-guide.md) - Production deployment
- [05-troubleshooting.md](./instructions/05-troubleshooting.md) - Common issues and solutions
- [06-development-notes.md](./instructions/06-development-notes.md) - Design decisions and future plans

## Security

- ✅ Passwords are hashed using bcrypt
- ✅ Database credentials stored as environment variables
- ✅ NextAuth handles session security
- ✅ HTTPS enforced in production (Vercel)
- ⚠️ Never commit `.env` files or secrets to version control

## Contributing

This is a personal project, but suggestions and feedback are welcome! Please feel free to open an issue or discussion.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Author

**Subhadra Mishra**

- GitHub: [@Subhadra-Mishra-iub](https://github.com/Subhadra-Mishra-iub)

---

Built with ❤️ for better emotional well-being tracking.
