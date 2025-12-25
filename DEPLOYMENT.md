# Deployment Guide: CalmCompass

This guide will help you deploy CalmCompass to production using Vercel (frontend/backend) and Supabase (database) - both on their free tiers.

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Supabase account (sign up at [supabase.com](https://supabase.com))

## Step 1: Set Up Supabase Database (Free Tier)

1. **Create a Supabase project**:
   - Go to [supabase.com](https://supabase.com) and sign in
   - Click "New Project"
   - Fill in:
     - **Name**: `calmcompass` (or your preferred name)
     - **Database Password**: Generate a strong password and save it securely
     - **Region**: Choose the closest region to your users
   - Click "Create new project"
   - Wait 2-3 minutes for the project to be created

2. **Get your database connection string**:
   - In your Supabase project, go to **Settings** → **Database**
   - Scroll down to "Connection string"
   - Select "URI" tab
   - Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
   - Replace `[YOUR-PASSWORD]` with the password you set when creating the project
   - Save this - you'll need it for Step 3

## Step 2: Push Your Code to GitHub

1. **Initialize git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a GitHub repository**:
   - Go to [github.com](https://github.com) and create a new repository
   - Name it `calmcompass` (or your preferred name)
   - Do NOT initialize with README, .gitignore, or license (we already have these)

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/calmcompass.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

## Step 3: Deploy to Vercel

1. **Import your repository**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New..." → "Project"
   - Find and import your `calmcompass` repository
   - Click "Import"

2. **Configure environment variables**:
   Before clicking "Deploy", click "Environment Variables" and add:

   - **DATABASE_URL**:
     - Value: The connection string from Step 1 (Supabase)
     - Example: `postgresql://postgres:yourpassword@db.xxxxx.supabase.co:5432/postgres`

   - **AUTH_SECRET**:
     - Generate a secure secret: Run `openssl rand -base64 32` in your terminal
     - Copy the output and paste it as the value
     - This is used to encrypt NextAuth sessions

   - **NEXTAUTH_URL**:
     - Value: `https://your-app-name.vercel.app` (replace with your actual Vercel URL)
     - You'll get this URL after the first deployment, so you can update it later
     - For now, use: `http://localhost:3000` and update after first deploy

   Click "Save" after adding each variable.

3. **Configure build settings** (optional):
   - Framework Preset: Next.js (should auto-detect)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Once deployed, you'll get a URL like: `https://calmcompass-xxxxx.vercel.app`

5. **Update NEXTAUTH_URL**:
   - After deployment, go to **Settings** → **Environment Variables**
   - Update `NEXTAUTH_URL` to your actual Vercel URL (e.g., `https://calmcompass-xxxxx.vercel.app`)
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment → **Redeploy** (this applies the new env var)

## Step 4: Set Up Database Schema

1. **Get your connection string** (if you don't have it):
   - From Supabase Dashboard → Settings → Database → Connection string (URI)

2. **Set up database locally** (temporarily):
   - Create a `.env.local` file in your project root:
     ```env
     DATABASE_URL="your-supabase-connection-string"
     ```

3. **Push schema and seed**:
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Push schema to Supabase
   npx prisma db push

   # Seed the database (optional - creates demo user and emotions)
   npm run db:seed
   ```

   This will create all the tables in your Supabase database.

## Step 5: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-app-name.vercel.app`

2. **Create an account**:
   - Click "Get Started" or "Sign Up"
   - Fill in name, email, and password
   - You should be redirected to the dashboard

3. **Test the check-in flow**:
   - Click "How are we feeling today?"
   - Select an emotion
   - Mark some actions as completed
   - Add notes
   - Save the check-in

4. **Verify data**:
   - Go to Supabase Dashboard → **Table Editor**
   - You should see tables: `users`, `emotions`, `actions`, `check_ins`, `check_in_actions`
   - Check that your data is being saved correctly

## Step 6: Share Your App

Your app is now live! Share the Vercel URL with others:
- **Your app URL**: `https://your-app-name.vercel.app`

## Troubleshooting

### Database Connection Issues

- **Error**: "Can't reach database server"
  - Check your `DATABASE_URL` in Vercel environment variables
  - Verify the password is correct (no special characters need URL encoding)
  - Ensure Supabase project is active (not paused)

### Authentication Issues

- **Error**: "NextAuth configuration error"
  - Verify `AUTH_SECRET` is set in Vercel environment variables
  - Ensure `NEXTAUTH_URL` matches your Vercel deployment URL exactly
  - After updating env vars, redeploy the app

### Build Errors

- **Error**: "Prisma Client not generated"
  - Add a build script in `package.json` (already done)
  - Vercel should auto-run `prisma generate` during build
  - If not, add to `package.json` scripts:
    ```json
    "postinstall": "prisma generate"
    ```

### Environment Variables Not Working

- After adding/updating env vars in Vercel:
  - Go to Deployments → Latest deployment → Redeploy
  - Environment variables only apply to new deployments

## Free Tier Limits

### Vercel (Free Tier)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions (good for Next.js API routes)
- ✅ Automatic HTTPS
- ⚠️ Functions timeout after 10 seconds (should be fine for our use case)

### Supabase (Free Tier)
- ✅ 500MB database storage
- ✅ 2GB bandwidth/month
- ✅ Unlimited API requests
- ⚠️ Project pauses after 1 week of inactivity (can be resumed with one click)

## Next Steps

1. **Custom Domain** (optional):
   - In Vercel, go to Settings → Domains
   - Add your custom domain
   - Follow DNS setup instructions

2. **Monitor Usage**:
   - Vercel Dashboard shows bandwidth and function usage
   - Supabase Dashboard shows database size and API calls

3. **Scale if Needed**:
   - If you hit limits, consider Vercel Pro ($20/month) or Supabase Pro ($25/month)
   - Or optimize your usage (e.g., database cleanup, caching)

## Security Notes

- ✅ Passwords are hashed using bcrypt
- ✅ Database credentials are stored as environment variables (never in code)
- ✅ NextAuth handles session security
- ⚠️ Remember to keep your `AUTH_SECRET` secure and never commit it
- ⚠️ Use HTTPS in production (Vercel provides this automatically)

## Support

If you encounter issues:
1. Check Vercel deployment logs (Deployments → Click deployment → View Function Logs)
2. Check Supabase logs (Logs section in dashboard)
3. Verify all environment variables are set correctly
4. Ensure database schema is pushed (`npx prisma db push`)

---

Congratulations! Your CalmCompass app is now live and ready to help people track their emotional well-being! 🎉

