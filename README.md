# CalmCompass

Your daily emotional well-being companion. Track your emotions, manage your actions, and build healthier habits.

## Features

- **Authentication**: Secure signup/login with password hashing
- **Emotion Management**: Create and manage custom emotions
- **Action Tracking**: Associate actions with emotions to help manage your feelings
- **Daily Check-ins**: Quick daily check-ins with emotion selection and action tracking
- **History**: View past check-ins with filtering by emotion and date range

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (Credentials provider)
- **Testing**: Vitest (unit tests) + Playwright (E2E tests)
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 20 or higher
- PostgreSQL database (local or Supabase)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Subhadra-Mishra-iub/calmcompass.git
cd calmcompass
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/calmcompass?schema=public"
AUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

To generate a secure `AUTH_SECRET`, run:
```bash
openssl rand -base64 32
```

4. Set up the database:
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma db push

# Seed the database with sample data
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Demo Account

After seeding, you can log in with:
- Email: `demo@calmcompass.com`
- Password: `password123`

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
│   ├── api/               # API routes
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
├── test/                  # Unit test setup
├── e2e/                   # E2E tests
└── auth.ts                # NextAuth configuration
```

## Database Schema

- **User**: User accounts with email/password authentication
- **Emotion**: User-defined emotions (e.g., Anxious, Happy, Stressed)
- **Action**: Actions associated with emotions (e.g., "Take deep breaths")
- **CheckIn**: Daily emotional check-ins
- **CheckInAction**: Junction table tracking which actions were completed during check-ins

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel and Supabase (free tier).

## License

MIT
