# Troubleshooting Guide

This guide covers common issues you might encounter during setup and deployment.

## Database Connection Issues

### Error: "Can't reach database server"

**Possible Causes and Solutions:**

1. **Wait for Database to Initialize**
   - Supabase databases can take 2-3 minutes to fully initialize after creation
   - Wait a few minutes and try again

2. **Check Project Status**
   - Go to your Supabase dashboard
   - Check if your project shows "Active" status
   - If it's still "Setting up", wait a few more minutes

3. **Use Connection Pooler (Recommended)**
   - In Supabase Dashboard → Settings → Database → Connection string
   - Look for "Connection pooling" section
   - Use the **Session mode** connection string instead
   - It should look like:
     ```
     postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   - More reliable for some network configurations

4. **Verify Connection String**
   - No spaces in the connection string
   - Password is correct (no special characters need URL encoding)
   - Port is correct (5432 for direct, 6543 for pooler)

### Error: "Connection refused" or "ECONNREFUSED"

- Check if you're using the correct connection string format
- Verify the Supabase project is active and not paused
- Try the connection pooler instead of direct connection

## Vercel Deployment Issues

### Error: "Environment variable not found"

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify all 3 variables are added:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL`
3. Make sure they're saved correctly
4. **Redeploy** after adding variables (environment variables only apply to new deployments)

### Error: "Build failed" or "Prisma Client not generated"

**Solution:**
1. Check Vercel build logs (Deployments → Click deployment → View Build Logs)
2. Verify `package.json` has the `postinstall` script:
   ```json
   "postinstall": "prisma generate"
   ```
3. If the script exists but still fails, check the build logs for specific Prisma errors
4. Try running `prisma generate` locally to verify it works

### Error: "NextAuth configuration error"

**Solution:**
1. Verify `AUTH_SECRET` is set in Vercel environment variables
2. Ensure `NEXTAUTH_URL` matches your Vercel deployment URL exactly (including `https://`)
3. After updating `NEXTAUTH_URL`, redeploy the app
4. Check Vercel function logs for specific error messages

### Error: "Module not found"

**Solution:**
1. Make sure all dependencies are in `package.json`
2. Run `npm install` locally to verify all dependencies install correctly
3. Check Vercel build logs for the specific module that's missing
4. Ensure you haven't accidentally added dependencies to `.gitignore`

## Authentication Issues

### Error: "Invalid email or password" (but credentials are correct)

**Possible Causes:**
1. Password hashing mismatch (shouldn't happen if using the same code)
2. User doesn't exist in database
3. Database connection issue

**Solution:**
- Check Supabase Table Editor to verify user exists
- Try creating a new account
- Check Vercel function logs for authentication errors

### Error: "User with this email already exists" (when trying to sign up)

**This is expected behavior** - the email is already registered. Try logging in instead.

### Signup/Login Not Working Locally

**If you're testing locally:**
- Some network configurations have issues with direct Supabase connections
- This is a known IPv4/IPv6 compatibility issue
- **Solution**: The app will work perfectly when deployed to Vercel
- This is normal and expected for local development with Supabase

## Application Issues

### Error: "No emotions yet" when trying to create a check-in

**Solution:**
- This is expected - you need to create emotions first
- Go to the "Emotions" page
- Click "Add Emotion"
- Create at least one emotion
- Then you can create check-ins

### Check-ins not saving

**Solution:**
1. Check browser console for errors (F12 → Console)
2. Check Vercel function logs for API errors
3. Verify database connection is working
4. Check Supabase Table Editor to see if data is being saved

### Navigation highlighting not working

**Solution:**
- This should be fixed in recent versions
- Clear browser cache and refresh
- Check that you're on the latest deployed version

### Text not visible in input fields

**Solution:**
- This should be fixed in recent versions
- Clear browser cache and refresh
- Check that you're on the latest deployed version

## Getting Help

If you're still having issues:

1. **Check Logs**:
   - Vercel: Deployments → Click deployment → View Function Logs
   - Supabase: Dashboard → Logs section
   - Browser: F12 → Console tab

2. **Verify Setup**:
   - All environment variables are set correctly
   - Database schema is pushed (`npx prisma db push`)
   - All dependencies are installed

3. **Common Checks**:
   - ✅ Database connection string is correct
   - ✅ AUTH_SECRET is set
   - ✅ NEXTAUTH_URL matches your deployment URL
   - ✅ All tables exist in Supabase
   - ✅ Code is pushed to GitHub
   - ✅ Vercel deployment succeeded

4. **Share Error Details**:
   - Copy the exact error message
   - Include which step you're on (local setup, deployment, etc.)
   - Include relevant logs from Vercel or browser console

## After Connection Works

Once `npx prisma db push` succeeds, you'll see:
```
✔ Generated Prisma Client
✔ Pushed to database
```

Then run:
```bash
npm run db:seed  # Add sample data
npm run dev      # Start the app
```




