# CalmCompass

> **🌐 Live Website**: [Visit CalmCompass](https://calmcompass.vercel.app/)

A full-stack web application for tracking emotional well-being through daily check-ins, personalized emotion management, and AI-powered insights.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## About

CalmCompass addresses the need for a simple, private, and user-friendly tool for emotional well-being tracking. Many people struggle to understand their emotional patterns, but existing solutions are often too complex, lack privacy, or don't provide actionable guidance.

This application enables users to:
- Track daily emotions through quick, intuitive check-ins
- Build emotional awareness by understanding patterns over time
- Take actionable steps by associating helpful actions with each emotion
- Receive personalized recommendations through an AI-powered chatbot
- Maintain complete privacy with secure, user-controlled data

## Features

- 🔐 **Secure Authentication**: Email/password authentication with bcrypt password hashing
- 😊 **Emotion Management**: Create and manage custom emotions with visual indicators
- ✅ **Action Tracking**: Associate helpful actions with emotions, track creation dates
- 📝 **Daily Check-ins**: Quick check-ins to record emotional state with optional notes
- 📊 **History & Analytics**: View past check-ins with filtering by emotion and date range
- 🤖 **AI Chatbot**: Personalized emotional support chatbot powered by Groq AI
- 📱 **Responsive Design**: Seamless experience across desktop and mobile devices
- 🎨 **Modern UI**: Clean, intuitive interface built with Tailwind CSS

## Tech Stack

### Frontend & Framework
- **Next.js 16** (App Router): Chosen for its full-stack capabilities, server-side rendering, and seamless API route integration. The App Router provides a modern, file-based routing system that simplifies development.
- **React 19**: Latest React version for component-based UI development
- **TypeScript**: Type safety prevents runtime errors, improves IDE support, and makes the codebase more maintainable. TypeScript catches bugs during development that would otherwise fail in production.
- **Tailwind CSS 4**: Utility-first CSS framework for rapid, responsive UI development without writing custom CSS

### Backend & API
- **Next.js API Routes**: Serverless API endpoints integrated with the Next.js framework, eliminating the need for a separate backend server
- **NextAuth.js v5**: Authentication library with credentials provider for secure session management
- **bcryptjs**: Password hashing library for secure credential storage

### Database & ORM
- **PostgreSQL**: Relational database hosted on Supabase, providing ACID compliance and reliable data storage
- **Prisma ORM**: Type-safe database client that generates TypeScript types from the schema, ensuring type safety between database and application code
- **Supabase**: Cloud-hosted PostgreSQL with connection pooling, ideal for serverless deployments

### AI & External Services
- **Groq AI**: Fast inference API for the chatbot feature, providing personalized emotional support based on user check-in history

### DevOps & Deployment
- **Vercel**: Serverless hosting platform optimized for Next.js applications, providing automatic deployments, edge functions, and global CDN
- **GitHub Actions**: CI/CD pipeline for automated testing and deployment
- **Environment Variables**: Secure configuration management for API keys and database credentials

### Development Tools
- **Vitest**: Fast unit testing framework
- **Playwright**: End-to-end testing for browser automation
- **ESLint**: Code quality and consistency

## Technology Decisions

**Why TypeScript over JavaScript?**
TypeScript provides static type checking that catches errors during development rather than at runtime. For a user-facing application handling sensitive emotional data, type safety ensures data integrity and prevents bugs. The added development overhead is minimal compared to the reliability gains, especially when working with database schemas and API responses.

**Why Next.js App Router?**
The App Router provides a modern approach to routing with server components, streaming, and built-in data fetching. It eliminates the need for a separate backend API server, reducing complexity and deployment overhead. The integrated API routes ensure type safety across frontend and backend code.

**Why Prisma over raw SQL?**
Prisma generates TypeScript types from the database schema, creating a type-safe bridge between the database and application code. This prevents runtime errors from schema mismatches and provides excellent IDE autocomplete. Migrations are version-controlled and easier to manage than manual SQL scripts.

**Why Supabase over self-hosted PostgreSQL?**
Supabase provides production-ready PostgreSQL with connection pooling, automatic backups, and a generous free tier. For serverless deployments on Vercel, the connection pooler is essential to prevent connection exhaustion. The cloud-hosted solution eliminates infrastructure management overhead.

## Quick Start

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- PostgreSQL database (Supabase recommended for free tier)

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
   GROQ_API_KEY="your-groq-api-key"  # Optional: for chatbot feature
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
├── app/                    # Next.js App Router
│   ├── api/               # API routes (backend)
│   │   ├── auth/         # Authentication endpoints
│   │   ├── emotions/     # Emotion CRUD operations
│   │   ├── actions/      # Action CRUD operations
│   │   ├── check-ins/    # Check-in operations
│   │   └── chatbot/      # AI chatbot endpoint
│   ├── dashboard/         # Dashboard page
│   ├── emotions/          # Emotions management page
│   ├── history/           # Check-in history page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── layout.tsx         # Root layout with global components
├── components/            # React components
│   ├── Navbar.tsx
│   ├── CheckInModal.tsx
│   ├── EmotionsManager.tsx
│   ├── HistoryView.tsx
│   └── Chatbot.tsx
├── lib/                   # Utility functions
│   ├── db.ts             # Prisma database client
│   └── auth.ts           # Authentication utilities
├── prisma/                # Database schema
│   ├── schema.prisma     # Prisma schema definition
│   └── seed.ts           # Database seeding script
├── instructions/          # Documentation
└── auth.ts               # NextAuth configuration
```

## Database Schema

The application uses a relational database structure:

- **User**: User accounts with email/password authentication
- **Emotion**: User-defined emotions (e.g., Anxious, Happy, Stressed)
- **Action**: Actions associated with emotions (e.g., "Take deep breaths")
- **CheckIn**: Daily emotional check-ins with emotion and optional notes
- **CheckInAction**: Junction table tracking completed actions per check-in

See `prisma/schema.prisma` for the complete schema definition.

## Deployment

The application is deployed on Vercel with Supabase as the database provider. Both services offer generous free tiers suitable for production use.

**🌐 Live Website**: [https://calmcompass.vercel.app/](https://calmcompass.vercel.app/)

For detailed deployment instructions, see [instructions/04-deployment-guide.md](./instructions/04-deployment-guide.md).

### Quick Deployment Steps

1. Push code to GitHub
2. Create a Supabase project and configure the connection pooler
3. Deploy to Vercel with environment variables:
   - `DATABASE_URL` - Supabase connection pooler URL
   - `AUTH_SECRET` - Generated secret
   - `NEXTAUTH_URL` - Your Vercel deployment URL
   - `GROQ_API_KEY` - Optional: for chatbot feature
4. Push database schema: `npx prisma db push`
5. Application is live

## Documentation

Comprehensive documentation is available in the `instructions/` directory:

- [01-project-overview.md](./instructions/01-project-overview.md) - Architecture and structure
- [02-initial-setup.md](./instructions/02-initial-setup.md) - Local development setup
- [03-database-connection.md](./instructions/03-database-connection.md) - Database connection guide
- [04-deployment-guide.md](./instructions/04-deployment-guide.md) - Production deployment
- [05-troubleshooting.md](./instructions/05-troubleshooting.md) - Common issues and solutions
- [06-development-notes.md](./instructions/06-development-notes.md) - Design decisions
- [07-chatbot-implementation.md](./instructions/07-chatbot-implementation.md) - Chatbot feature guide

## Security

- Passwords are hashed using bcrypt with salt rounds
- Database credentials stored as environment variables
- NextAuth handles secure session management
- HTTPS enforced in production (Vercel)
- SQL injection prevention through Prisma parameterized queries
- Never commit `.env` files or secrets to version control

## Future Improvements

This project is currently at MVP stage. Planned enhancements include:

**High Priority:**
- Edit functionality for emotions, actions, and check-ins
- Delete check-ins capability
- Enhanced analytics dashboard

**Medium Priority:**
- Statistics and analytics visualization
- Emotion trends over time charts
- Action completion rate tracking
- Data export functionality (CSV/JSON)

**Low Priority:**
- Emotion colors and icons for visual representation
- Daily check-in reminders
- Dark mode theme toggle
- Advanced search and filtering
- Mobile app version (React Native)

## Contributing

This is a personal project, but suggestions and feedback are welcome. Please feel free to open an issue or discussion.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Author

**Subhadra Mishra**

- GitHub: [@Subhadra-Mishra-iub](https://github.com/Subhadra-Mishra-iub)
- Live Site: [calmcompass.vercel.app](https://calmcompass.vercel.app/)

---

Built with modern web technologies for better emotional well-being tracking.
