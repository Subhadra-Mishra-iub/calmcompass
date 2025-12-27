# Database Setup Options

## ✅ .env File Created!

Your `.env` file has been created with:
- ✅ `AUTH_SECRET` - Generated and set
- ✅ `NEXTAUTH_URL` - Set to `http://localhost:3000`
- ⚠️ `DATABASE_URL` - **You need to set this up**

## Choose One Option:

### Option 1: Supabase (Recommended - Easiest & Free)

1. **Sign up**: Go to [supabase.com](https://supabase.com) and create an account
2. **Create project**:
   - Click "New Project"
   - Name: `calmcompass-test`
   - Set a password (save it!)
   - Choose region closest to you
   - Click "Create new project"
   - Wait 2-3 minutes

3. **Get connection string**:
   - Go to **Settings** → **Database**
   - Scroll to "Connection string"
   - Click **"URI"** tab
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your actual password

4. **Update .env file**:
   ```bash
   # Edit .env and replace DATABASE_URL with your Supabase connection string
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
   ```

5. **Run setup commands**:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

### Option 2: Local PostgreSQL

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

4. **Update .env file** (if needed):
   ```bash
   DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/calmcompass?schema=public"
   ```
   Replace `YOUR_USERNAME` with your system username (usually your Mac username)

5. **Run setup commands**:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

## After Database Setup:

Once you've updated `DATABASE_URL` in `.env`, run:

```bash
# Push schema to database
npx prisma db push

# Seed with sample data (optional - creates demo user)
npm run db:seed

# Start the development server
npm run dev
```

Then visit: **http://localhost:3000**

### Demo Account (after seeding):
- Email: `demo@calmcompass.com`
- Password: `password123`

---

**Recommendation**: Use Supabase (Option 1) - it's free, no installation needed, and works the same way as production!

