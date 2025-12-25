# Quick Start Guide - CalmCompass

## 📋 Step-by-Step Instructions

### PART 1: Test Locally First

#### Step 1: Set Up Environment Variables

1. Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```

2. Add these lines to `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/calmcompass?schema=public"
   AUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. Generate a secure AUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and replace `your-secret-key-here` in `.env`

4. For DATABASE_URL, you have two options:

   **Option A: Use Supabase (Recommended - Free)**
   - Go to [supabase.com](https://supabase.com) and sign up
   - Click "New Project"
   - Name: `calmcompass-test`
   - Set a database password (save it!)
   - Wait 2 minutes for setup
   - Go to Settings → Database → Connection string → URI
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your actual password
   - Paste into `.env` as DATABASE_URL

   **Option B: Use Local PostgreSQL**
   - Install PostgreSQL on your machine
   - Create a database: `createdb calmcompass`
   - Use: `DATABASE_URL="postgresql://yourusername@localhost:5432/calmcompass?schema=public"`

#### Step 2: Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data (creates demo user)
npm run db:seed
```

#### Step 3: Run the App

```bash
npm run dev
```

Open your browser and go to: **http://localhost:3000**

#### Step 4: Test the App

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

---

### PART 2: Deploy to Production (Get Live Website Link)

#### Step 1: Push Code to GitHub

1. **Check git status**:
   ```bash
   git status
   ```

2. **Add all files**:
   ```bash
   git add .
   ```

3. **Commit**:
   ```bash
   git commit -m "Initial commit - CalmCompass MVP"
   ```

4. **Create GitHub repository**:
   - Go to [github.com](https://github.com)
   - Click the "+" icon → "New repository"
   - Name: `calmcompass`
   - Description: "Emotional well-being tracking app"
   - Choose Public or Private
   - DO NOT check "Initialize with README" (we already have files)
   - Click "Create repository"

5. **Link and push**:
   ```bash
   # Replace YOUR_USERNAME with your GitHub username
   git remote add origin https://github.com/YOUR_USERNAME/calmcompass.git
   git branch -M main
   git push -u origin main
   ```

   If prompted, enter your GitHub username and password (or use a personal access token).

#### Step 2: Set Up Supabase Database (Free)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: `calmcompass-production`
   - **Database Password**: Create a strong password and SAVE IT
   - **Region**: Choose closest to you
4. Click "Create new project"
5. Wait 2-3 minutes

6. **Get connection string**:
   - Go to **Settings** → **Database**
   - Scroll to "Connection string"
   - Click "URI" tab
   - Copy the string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
   - Replace `[YOUR-PASSWORD]` with your actual password
   - **SAVE THIS** - you'll need it soon

7. **Push database schema**:
   ```bash
   # Update your local .env with the Supabase connection string
   # Then run:
   npx prisma db push
   npm run db:seed  # Optional: seed with demo data
   ```

#### Step 3: Deploy to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub

2. Click "Add New..." → "Project"

3. Import your `calmcompass` repository:
   - Find it in the list
   - Click "Import"

4. **Configure Environment Variables** (IMPORTANT!):
   
   Before clicking "Deploy", click "Environment Variables" and add these:

   **Variable 1: DATABASE_URL**
   - Name: `DATABASE_URL`
   - Value: Your Supabase connection string from Step 2
   - Click "Save"

   **Variable 2: AUTH_SECRET**
   - Name: `AUTH_SECRET`
   - Value: Run `openssl rand -base64 32` in terminal and copy the output
   - Click "Save"

   **Variable 3: NEXTAUTH_URL**
   - Name: `NEXTAUTH_URL`
   - Value: `http://localhost:3000` (we'll update this after deployment)
   - Click "Save"

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll see a success message with your URL: `https://calmcompass-xxxxx.vercel.app`

6. **Update NEXTAUTH_URL**:
   - After deployment, go to **Settings** → **Environment Variables**
   - Find `NEXTAUTH_URL` and click edit
   - Change value to your actual Vercel URL: `https://calmcompass-xxxxx.vercel.app`
   - Click "Save"
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Click "Redeploy" to apply the new environment variable

#### Step 4: Test Your Live Site

1. Visit your Vercel URL: `https://calmcompass-xxxxx.vercel.app`
2. Sign up for a new account
3. Test all features
4. **Share this URL with others!** 🎉

---

## 🎯 Quick Reference

### Local Development
```bash
npm run dev          # Start dev server
npm run db:push      # Update database schema
npm run db:seed      # Add sample data
npm run db:studio    # Open database GUI
```

### Testing
```bash
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
```

### Deployment Commands
```bash
git add .
git commit -m "Your message"
git push             # Push to GitHub (triggers Vercel deployment)
```

---

## 🔧 Troubleshooting

### "Can't connect to database"
- Check DATABASE_URL in Vercel environment variables
- Ensure Supabase project is active (not paused)
- Verify password in connection string is correct

### "NextAuth error"
- Check AUTH_SECRET is set in Vercel
- Verify NEXTAUTH_URL matches your Vercel URL exactly
- Redeploy after changing environment variables

### "Build failed"
- Check Vercel build logs (Deployments → Click deployment → View logs)
- Ensure all dependencies are in package.json
- Verify Prisma schema is valid: `npx prisma validate`

---

## 📝 Current Structure (Already Optimized!)

Your code is already organized perfectly for deployment:

```
calmcompass/
├── app/
│   ├── api/              ← BACKEND (API routes)
│   │   ├── auth/         ← Authentication endpoints
│   │   ├── emotions/     ← Emotion CRUD
│   │   ├── actions/      ← Action CRUD
│   │   └── check-ins/    ← Check-in endpoints
│   │
│   ├── dashboard/        ← FRONTEND (Pages)
│   ├── emotions/
│   ├── history/
│   ├── login/
│   └── signup/
│
├── components/           ← FRONTEND (React components)
├── lib/                  ← Shared utilities
├── prisma/               ← Database schema
└── auth.ts               ← Auth configuration
```

**No need to rearrange!** Next.js handles frontend/backend automatically. Vercel deploys everything together seamlessly.

---

## ✅ Checklist

- [ ] Created `.env` file with DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL
- [ ] Ran `npx prisma generate` and `npx prisma db push`
- [ ] Ran `npm run dev` and tested locally
- [ ] Pushed code to GitHub
- [ ] Created Supabase project and got connection string
- [ ] Deployed to Vercel with environment variables
- [ ] Updated NEXTAUTH_URL after first deployment
- [ ] Tested live site and shared URL

---

🎉 **Congratulations!** Your CalmCompass app is now live and ready to help people track their emotional well-being!

