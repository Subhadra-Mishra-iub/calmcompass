# Database Connection Guide

This guide covers how to get your database connection string from Supabase and understand the different connection options.

## Getting Your Connection String

### Standard Connection String

1. **Go to your Supabase project dashboard**: https://supabase.com/dashboard

2. **Navigate to Settings**:
   - Click on your project
   - Click **Settings** (left sidebar, gear icon ⚙️)
   - Click **"Database"** (in the Settings menu)

3. **Find the Connection String**:
   - Scroll down to **"Connection string"** section
   - Click on the **"URI"** tab (not "JDBC" or others)

4. **Copy the connection string**:
   - You'll see something like:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
     ```

5. **Replace the password placeholder**:
   - Replace `[YOUR-PASSWORD]` with the password you set when creating the project
   - Your final connection string should look like:
     ```
     postgresql://postgres:your-actual-password@db.xwtyssqtpnktvcuefrqr.supabase.co:5432/postgres
     ```

6. **Use it in your `.env` file**:
   ```env
   DATABASE_URL="postgresql://postgres:your-actual-password@db.xwtyssqtpnktvcuefrqr.supabase.co:5432/postgres"
   ```

## Connection Pooling (Recommended)

Connection pooling is recommended for production use and can be more reliable for migrations.

### Getting the Pooler Connection String

1. **In the same location** (Settings → Database → Connection string):
   - Look for **"Connection pooling"** section (below the regular connection strings)

2. **Choose a mode**:
   - **Session mode**: Recommended for migrations and schema changes (use this for `prisma db push`)
   - **Transaction mode**: Better for serverless/edge functions

3. **Copy the connection string**:
   - It will look like:
     ```
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
     ```

4. **Replace the password**:
   - Replace `[YOUR-PASSWORD]` with your actual password

5. **Key differences from standard connection**:
   - Port: **6543** instead of 5432
   - Domain: `pooler.supabase.com` instead of `db.supabase.co`
   - Has `?pgbouncer=true` at the end
   - Format: `postgres.[PROJECT-REF]` (has a dot before the project ref)

### When to Use Pooler

- ✅ Production deployments (more reliable)
- ✅ Prisma migrations (`prisma db push`)
- ✅ Serverless functions
- ⚠️ Note: Some admin operations may require direct connection

## Using SQL Editor (Alternative Setup Method)

If you need to create tables manually via SQL (not recommended - use Prisma instead):

1. **Open SQL Editor**:
   - In Supabase Dashboard, click **"SQL Editor"** (left sidebar)
   - Click **"New query"** button

2. **Run SQL commands**:
   - Paste your SQL commands
   - Click **"Run"** button (or press `Cmd+Enter` / `Ctrl+Enter`)
   - Wait for success message

3. **Verify tables**:
   - Go to **"Tables"** (left sidebar)
   - Check that tables were created correctly

**Note**: This project uses Prisma for database management, so you should use `prisma db push` instead of manual SQL. See `02-initial-setup.md` for the recommended setup process.

## Troubleshooting Connection Issues

### Error: "Can't reach database server"

1. **Wait for database initialization**:
   - Supabase databases can take 2-3 minutes to fully initialize after creation
   - Wait a few minutes and try again

2. **Check project status**:
   - Go to your Supabase dashboard
   - Check if your project shows "Active" status
   - If it's still "Setting up", wait a few more minutes

3. **Verify connection string**:
   - No spaces in the connection string
   - Password is correct (no special characters need URL encoding)
   - Port is correct (5432 for direct, 6543 for pooler)

4. **Try connection pooler**:
   - Use the pooler connection string instead of direct connection
   - More reliable for some network configurations

### After Connection Works

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

## Security Notes

- ✅ Never commit connection strings to version control
- ✅ Store connection strings in `.env` file (which should be in `.gitignore`)
- ✅ Use environment variables in production (Vercel)
- ✅ Keep your database password secure

