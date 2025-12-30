# Initial Setup Guide

This guide will help you set up CalmCompass for local development.

## Prerequisites

- Node.js 20 or higher
- npm or yarn
- A PostgreSQL database (local or Supabase - recommended)

## Step 1: Clone and Install

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Subhadra-Mishra-iub/calmcompass.git
   cd calmcompass
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Step 2: Set Up Environment Variables

1. **Create a `.env` file in the root directory:**
   ```bash
   touch .env
   ```

2. **Add these variables to `.env`:**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/calmcompass?schema=public"
   AUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Generate a secure AUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and replace `your-secret-key-here` in `.env`

## Step 3: Set Up Database

You have two options for the database:

### Option A: Supabase (Recommended - Free & Easy)

**Why Supabase?**

- ✅ **Free tier** - No credit card needed
- ✅ **Cloud-hosted** - Access from anywhere
- ✅ **No installation** - Works immediately
- ✅ **Production-ready** - Same setup as production
- ✅ **Multiple users supported** - Designed for production use
- ✅ **Easy to upgrade** - Scale when needed

**Steps:**

1. **Sign up**: Go to [supabase.com](https://supabase.com) and create an account

2. **Create project**:
   - Click "New Project"
   - Name: `calmcompass-test`
   - Set a database password (save it securely!)
   - Choose region closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for setup

3. **Get connection string**:
   - Go to **Settings** → **Database**
   - Scroll to "Connection string"
   - Click **"URI"** tab
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your actual password
   - Paste into `.env` as `DATABASE_URL`

4. **Run setup commands:**
   ```bash
   npx prisma db push
   npm run db:seed
   ```

### Option B: Local PostgreSQL

1. **Install PostgreSQL** (if not installed):
   - macOS: `brew install postgresql@15`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - Linux: `sudo apt-get install postgresql postgresql-contrib`

2. **Start PostgreSQL**:
   ```bash
   # macOS
   brew services start postgresql@15
   
   # Linux
   sudo systemctl start postgresql
   ```

3. **Create database**:
   ```bash
   createdb calmcompass
   ```

4. **Update `.env` file**:
   ```env
   DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/calmcompass?schema=public"
   ```
   Replace `YOUR_USERNAME` with your system username

5. **Run setup commands:**
   ```bash
   npx prisma db push
   npm run db:seed
   ```

**Recommendation**: Use Supabase (Option A) - it's free, no installation needed, and works the same way as production!

## Step 4: Set Up Database Schema

After setting your `DATABASE_URL`, run these commands:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data (creates demo user)
npm run db:seed
```

## Step 5: Run the Development Server

```bash
npm run dev
```

Open your browser and go to: **http://localhost:3000**

## Step 6: Test the Application

1. **Sign Up**:
   - Click "Get Started"
   - Enter name, email, password (min 6 characters)
   - You'll be logged in automatically

2. **Or Use Demo Account** (after seeding):
   - Email: `demo@calmcompass.com`
   - Password: `password123`

3. **Try Features**:
   - Click "How are we feeling today?" to create a check-in
   - Go to "Emotions" to manage emotions and actions
   - Go to "History" to see past check-ins

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

## Next Steps

Once local setup is complete:
- See `03-database-connection.md` for detailed database connection guides
- See `04-deployment-guide.md` to deploy to production
- See `05-troubleshooting.md` if you encounter issues




