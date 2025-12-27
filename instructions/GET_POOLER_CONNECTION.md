# Get Connection Pooler String

## Steps:

1. In Supabase Dashboard, go to: **Settings** → **Database**

2. Scroll down to **"Connection string"** section

3. Look for **"Connection pooling"** section (below the regular connection strings)

4. You'll see two options:
   - **Session mode** (use this for migrations)
   - **Transaction mode** (for serverless)

5. Click on **"Session mode"** tab

6. Copy the connection string - it should look like:
   ```
   postgresql://postgres.xwtyssqtpnktvcuefrqr:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

7. **Important**: Replace `[YOUR-PASSWORD]` with your actual password: `GcdCSm8x8FmyrmLh`

8. Share the full connection string with me (with password replaced)

The pooler connection string uses:
- Port **6543** instead of 5432
- Domain `pooler.supabase.com` instead of `db.supabase.co`
- Has `?pgbouncer=true` at the end

This is more reliable for Prisma migrations!

