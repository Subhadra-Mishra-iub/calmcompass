# How to Get Database Connection String from Supabase

## Steps:

1. **Go to your Supabase project dashboard**: https://supabase.com/dashboard

2. **Click on your project**: `carecompass-test`

3. **Go to Settings** (left sidebar, gear icon ⚙️)

4. **Click "Database"** (in the Settings menu)

5. **Scroll down to "Connection string"** section

6. **Click on the "URI" tab** (not "JDBC" or others)

7. **You'll see something like**:
   ```
   postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   
   OR it might be:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

8. **Important**: Replace `[YOUR-PASSWORD]` with the password you set when creating the project

9. **Copy the entire connection string** (with your password replaced)

10. **The connection string should look like**:
    ```
    postgresql://postgres:your-actual-password@db.xwtyssqtpnktvcuefrqr.supabase.co:5432/postgres
    ```

## Alternative: Connection Pooling

Supabase also offers connection pooling. Look for:
- **Connection pooling** section
- Use the **"Session" mode** or **"Transaction" mode** connection string
- It will have `pooler.supabase.com` in it instead of `db.supabase.co`

Both work! The pooler is recommended for production.

