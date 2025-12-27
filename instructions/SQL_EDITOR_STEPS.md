# SQL Editor Steps - Create Tables

## Step 1: Open SQL Editor
1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/xwtyssqtpnktvcuefrqr
2. In the **left sidebar**, click **"SQL Editor"** 
   (It's under "DATABASE MANAGEMENT" section, near "Schema Visualizer" and "Tables")
3. Click **"New query"** button (top right or in the editor)

## Step 2: Copy and Paste SQL
Copy ALL the SQL code below and paste it into the SQL Editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- Create emotions table
CREATE TABLE IF NOT EXISTS "emotions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "emotions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "emotions_user_id_name_key" ON "emotions"("user_id", "name");

-- Create actions table
CREATE TABLE IF NOT EXISTS "actions" (
    "id" TEXT NOT NULL,
    "emotion_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- Create check_ins table
CREATE TABLE IF NOT EXISTS "check_ins" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "emotion_id" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "check_ins_pkey" PRIMARY KEY ("id")
);

-- Create check_in_actions junction table
CREATE TABLE IF NOT EXISTS "check_in_actions" (
    "id" TEXT NOT NULL,
    "check_in_id" TEXT NOT NULL,
    "action_id" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "check_in_actions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "check_in_actions_check_in_id_action_id_key" ON "check_in_actions"("check_in_id", "action_id");

-- Add foreign key constraints
ALTER TABLE "emotions" ADD CONSTRAINT "emotions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "actions" ADD CONSTRAINT "actions_emotion_id_fkey" FOREIGN KEY ("emotion_id") REFERENCES "emotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_emotion_id_fkey" FOREIGN KEY ("emotion_id") REFERENCES "emotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_in_actions" ADD CONSTRAINT "check_in_actions_check_in_id_fkey" FOREIGN KEY ("check_in_id") REFERENCES "check_ins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_in_actions" ADD CONSTRAINT "check_in_actions_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "actions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

## Step 3: Run the SQL
1. Click the **"Run"** button (or press `Cmd+Enter` / `Ctrl+Enter`)
2. Wait for the success message
3. You should see: "Success. No rows returned"

## Step 4: Verify Tables Were Created
1. In the left sidebar, click **"Tables"** (under DATABASE MANAGEMENT)
2. You should see 5 tables:
   - `users`
   - `emotions`
   - `actions`
   - `check_ins`
   - `check_in_actions`

## ✅ Done!
Once you see all 5 tables, let me know and we'll:
1. Seed the database with sample data
2. Start the development server
3. Test your app!

