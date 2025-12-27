# Deployment Guide: CalmCompass

This comprehensive guide will help you deploy CalmCompass to production using Vercel (frontend/backend hosting) and Supabase (database) - both on their free tiers.

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Supabase account (sign up at [supabase.com](https://supabase.com))
- Code pushed to GitHub (see Step 2)

## Step 1: Set Up Supabase Database (Production)

1. **Create a Supabase project** (if you haven't already):
   - Go to [supabase.com](https://supabase.com) and sign in
   - Click "New Project"
   - Fill in:
     - **Name**: `calmcompass-production` (or your preferred name)
     - **Database Password**: Generate a strong password and save it securely
     - **Region**: Choose the closest region to your users
   - Click "Create new project"
   - Wait 2-3 minutes for the project to be created

2. **Get your database connection string**:
   - In your Supabase project, go to **Settings** → **Database**
   - Scroll down to "Connection string"
   - Select "URI" tab
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with the password you set when creating the project
   - **Save this connection string** - you'll need it for Step 3

3. **Set up database schema** (from your local machine):
   - Create a temporary `.env.local` file in your project root:
     ```env
     DATABASE_URL="your-supabase-connection-string-here"
     ```
   - Run:
     ```bash
     npx prisma db push
     npm run db:seed  # Optional: seed with demo data
     ```
   - This will create all the tables in your Supabase database
   - You can delete `.env.local` after this step (or keep it for reference)

## Step 2: Push Your Code to GitHub

1. **Check git status**:
   ```bash
   git status
   ```

2. **Add and commit all files** (if needed):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   ```

3. **Create a GitHub repository** (if you haven't already):
   - Go to [github.com](https://github.com) and create a new repository
   - Name it `calmcompass` (or your preferred name)
   - Do NOT initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

4. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/calmcompass.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

5. **Verify**: Refresh your GitHub repository page - you should see all your files!

## Step 3: Deploy to Vercel

### 3.1: Import Your Repository

1. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub (recommended for easier setup)

2. **Import your repository**:
   - Click "Add New..." → "Project"
   - Find and select your `calmcompass` repository
   - Click "Import"

### 3.2: Configure Environment Variables (CRITICAL!)

**Before clicking "Deploy", you MUST add environment variables:**

1. **Click on "Environment Variables"** (the collapsible section)

2. **Add Variable 1: DATABASE_URL**
   - Click "Add" or the "+" button
   - **Key/Name:** `DATABASE_URL`
   - **Value:** Your Supabase connection string from Step 1
   - **Environment:** Select all (Production, Preview, Development) or just Production
   - Click "Save"

3. **Add Variable 2: AUTH_SECRET**
   - Click "Add" again
   - **Key/Name:** `AUTH_SECRET`
   - **Value:** Generate a secure secret by running `openssl rand -base64 32` in your terminal
   - Copy the output and paste it as the value
   - **Environment:** Select all
   - Click "Save"

4. **Add Variable 3: NEXTAUTH_URL**
   - Click "Add" again
   - **Key/Name:** `NEXTAUTH_URL`
   - **Value:** `http://localhost:3000` (we'll update this after first deploy)
   - **Environment:** Select all
   - Click "Save"

### 3.3: Verify Build Settings

- **Framework Preset:** Should be "Next.js" (auto-detected)
- **Root Directory:** Should be `./` (correct)
- **Build Command:** Should be `npm run build` (default)
- **Output Directory:** Should be `.next` (default)
- **Install Command:** Should be `npm install` (default)

### 3.4: Deploy

1. **Click the "Deploy" button**
2. **Wait 2-3 minutes** for the build to complete
3. **You'll see a success page** with your deployment URL: `https://calmcompass-xxxxx.vercel.app`

### 3.5: Update NEXTAUTH_URL (After First Deploy)

1. After deployment succeeds, go to your project dashboard
2. Click **"Settings"** (top navigation)
3. Click **"Environment Variables"** (left sidebar)
4. Find `NEXTAUTH_URL` and click edit
5. Change value to your actual Vercel URL: `https://calmcompass-xxxxx.vercel.app`
6. Click "Save"
7. Go to **"Deployments"** tab
8. Click the three dots (⋯) on the latest deployment
9. Click **"Redeploy"** to apply the new environment variable

## Step 4: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-app-name.vercel.app`

2. **Create an account**:
   - Click "Get Started" or "Sign Up"
   - Fill in name, email, and password
   - You should be redirected to the dashboard

3. **Test the check-in flow**:
   - Click "How are we feeling today?"
   - Select an emotion (or create one first)
   - Mark some actions as completed
   - Add notes
   - Save the check-in

4. **Verify data in Supabase**:
   - Go to Supabase Dashboard → **Table Editor**
   - You should see tables: `users`, `emotions`, `actions`, `check_ins`, `check_in_actions`
   - Check that your data is being saved correctly

## Step 5: Share Your App

Your app is now live! Share the Vercel URL with others:
- **Your app URL**: `https://your-app-name.vercel.app`

## Troubleshooting Deployment Issues

### Database Connection Issues

**Error**: "Can't reach database server"
- Check your `DATABASE_URL` in Vercel environment variables
- Verify the password is correct (no special characters need URL encoding)
- Ensure Supabase project is active (not paused)

### Authentication Issues

**Error**: "NextAuth configuration error"
- Verify `AUTH_SECRET` is set in Vercel environment variables
- Ensure `NEXTAUTH_URL` matches your Vercel deployment URL exactly
- After updating env vars, redeploy the app

### Build Errors

**Error**: "Prisma Client not generated"
- The `postinstall` script in `package.json` should handle this automatically
- If it fails, check Vercel build logs for specific errors
- Verify `prisma generate` runs successfully locally

**Error**: "Module not found"
- Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error**: "Environment variable not found"
- Make sure all 3 environment variables are added in Vercel
- Make sure they're saved correctly
- Redeploy after adding variables (environment variables only apply to new deployments)

### Environment Variables Not Working

After adding/updating env vars in Vercel:
- Go to Deployments → Latest deployment → Redeploy
- Environment variables only apply to new deployments

For more troubleshooting help, see `05-troubleshooting.md`.

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

## Security Notes

- ✅ Passwords are hashed using bcrypt
- ✅ Database credentials are stored as environment variables (never in code)
- ✅ NextAuth handles session security
- ⚠️ Remember to keep your `AUTH_SECRET` secure and never commit it
- ⚠️ Use HTTPS in production (Vercel provides this automatically)

## Next Steps After Deployment

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

## Support

If you encounter issues:
1. Check Vercel deployment logs (Deployments → Click deployment → View Function Logs)
2. Check Supabase logs (Logs section in dashboard)
3. Verify all environment variables are set correctly
4. Ensure database schema is pushed (`npx prisma db push`)
5. See `05-troubleshooting.md` for more detailed troubleshooting

---

Congratulations! Your CalmCompass app is now live and ready to help people track their emotional well-being! 🎉

