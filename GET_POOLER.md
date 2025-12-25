# Get Connection Pooler String - Step by Step

## Location:
**Settings → Database → Connection string section → Connection pooling**

## Steps:

1. **Go to Settings** (you're already there - left sidebar, gear icon)

2. **Make sure you're on "Database" settings** (should be selected)

3. **Scroll down** until you see "Connection string" section

4. **Look for "Connection pooling"** section (it's below the regular connection strings)

5. **You'll see tabs or options:**
   - **Session mode** ← Use this one!
   - **Transaction mode** (not this one)

6. **Click on "Session mode"**

7. **Copy the connection string** - it will look like:
   ```
   postgresql://postgres.xwtyssqtpnktvcuefrqr:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

8. **Replace `[YOUR-PASSWORD]`** with your actual password: `GcdCSm8x8FmyrmLh`

9. **Share the full connection string** with me (with password already replaced)

## Key differences:
- Port: **6543** (instead of 5432)
- Domain: **pooler.supabase.com** (instead of db.supabase.co)
- Has `?pgbouncer=true` at the end
- Format: `postgres.xwtyssqtpnktvcuefrqr` (has a dot before the project ref)

This is more reliable for Prisma migrations and production use!

