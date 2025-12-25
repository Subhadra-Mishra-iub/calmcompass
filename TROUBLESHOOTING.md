# Troubleshooting Database Connection

## If you get "Can't reach database server" error:

### Option 1: Wait for Database to Initialize
Supabase databases can take 2-3 minutes to fully initialize after creation. Wait a few minutes and try again.

### Option 2: Use Connection Pooler (Recommended)

In Supabase Dashboard → Settings → Database → Connection string, look for:

**"Connection pooling"** section with options:
- **Session mode**: For migrations and schema changes (use this for `prisma db push`)
- **Transaction mode**: For serverless/edge functions

Try using the **Session mode** connection string instead. It should look like:
```
postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Option 3: Check Project Status

1. Go to your Supabase dashboard
2. Check if your project shows "Active" status
3. If it's still "Setting up", wait a few more minutes

### Option 4: Verify Connection String

Make sure:
- No spaces in the connection string
- Password is correct (no special characters need URL encoding)
- Port is correct (5432 for direct, 6543 for pooler)

## After Connection Works:

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

