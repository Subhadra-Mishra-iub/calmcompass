# Vercel Deployment Setup - Step by Step

## Current Screen: Vercel Import Page

You're on the right page! Here's what to do:

### STEP 1: Add Environment Variables (IMPORTANT!)

**Before clicking "Deploy", you MUST add environment variables:**

1. **Click on "Environment Variables"** (the collapsible section)
   - It will expand to show input fields

2. **Add Variable 1: DATABASE_URL**
   - Click "Add" or the "+" button
   - **Key/Name:** `DATABASE_URL`
   - **Value:** `postgresql://postgres:GcdCSm8x8FmyrmLh@db.xwtyssqtpnktvcuefrqr.supabase.co:5432/postgres`
   - **Environment:** Select all (Production, Preview, Development) or just Production
   - Click "Save" or "Add"

3. **Add Variable 2: AUTH_SECRET**
   - Click "Add" again
   - **Key/Name:** `AUTH_SECRET`
   - **Value:** `PYtxt0l3zmtlfj03LU/SeZgAr+PvhJqIGg/i4A61elo=`
   - **Environment:** Select all (Production, Preview, Development) or just Production
   - Click "Save" or "Add"

4. **Add Variable 3: NEXTAUTH_URL**
   - Click "Add" again
   - **Key/Name:** `NEXTAUTH_URL`
   - **Value:** `http://localhost:3000` (we'll update this after first deploy)
   - **Environment:** Select all
   - Click "Save" or "Add"

### STEP 2: Verify Settings

- **Framework Preset:** Should be "Other" or auto-detected (that's fine)
- **Root Directory:** Should be `./` (that's correct)
- **Build and Output Settings:** Leave default (or expand to verify)
  - Build Command: Should be `npm run build` (or auto-detected)
  - Output Directory: Should be `.next` (or auto-detected)

### STEP 3: Deploy!

1. **Click the "Deploy" button** (big button at the bottom)
2. **Wait 2-3 minutes** for the build to complete
3. **You'll see a success page** with your deployment URL: `https://calmcompass-xxxxx.vercel.app`

### STEP 4: Update NEXTAUTH_URL (After First Deploy)

1. After deployment succeeds, go to your project dashboard
2. Click **"Settings"** (top navigation)
3. Click **"Environment Variables"** (left sidebar)
4. Find `NEXTAUTH_URL` and click edit
5. Change value to your actual Vercel URL: `https://calmcompass-xxxxx.vercel.app`
6. Click "Save"
7. Go to **"Deployments"** tab
8. Click the three dots (⋯) on the latest deployment
9. Click **"Redeploy"** to apply the new environment variable

### STEP 5: Test Your Live Site! 🎉

1. Visit your Vercel URL: `https://calmcompass-xxxxx.vercel.app`
2. Click "Get Started" to sign up
3. Fill in the form and create an account
4. It should work now! ✅

---

## Quick Reference - Environment Variables:

```
DATABASE_URL = postgresql://postgres:GcdCSm8x8FmyrmLh@db.xwtyssqtpnktvcuefrqr.supabase.co:5432/postgres
AUTH_SECRET = PYtxt0l3zmtlfj03LU/SeZgAr+PvhJqIGg/i4A61elo=
NEXTAUTH_URL = http://localhost:3000 (update after deploy)
```

---

**Important:** Don't click "Deploy" until you've added all 3 environment variables! 🚨

