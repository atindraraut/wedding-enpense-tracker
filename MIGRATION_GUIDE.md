# MongoDB Migration Guide

This guide will help you migrate your existing SQLite data to MongoDB.

## Prerequisites

1. MongoDB Atlas account with a cluster created
2. Your MongoDB connection string
3. Existing SQLite database with data

## Step-by-Step Migration

### Step 1: Create .env File

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

### Step 2: Add Your MongoDB Password

Edit the `.env` file and replace `<db_password>` with your actual MongoDB password:

```env
MONGODB_URI=mongodb+srv://atindra:YOUR_PASSWORD_HERE@cluster0.vmkw431.mongodb.net/wedding-expense?retryWrites=true&w=majority
```

**Example:**
If your password is `mySecurePass123`, it would look like:
```env
MONGODB_URI=mongodb+srv://atindra:mySecurePass123@cluster0.vmkw431.mongodb.net/wedding-expense?retryWrites=true&w=majority
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install mongoose, dotenv, and keep sqlite3 for the migration.

### Step 4: Run the Migration Script

```bash
npm run migrate
```

The script will:
1. Connect to your SQLite database
2. Connect to MongoDB
3. Clear existing MongoDB data (optional)
4. Transfer all budget data
5. Transfer all expenses
6. Transfer all payments (maintaining relationships)
7. Show you a summary

### Step 5: Verify Migration

The migration script will output something like:

```
🚀 Starting migration from SQLite to MongoDB...

✅ Connected to MongoDB

🗑️  Cleared existing MongoDB data

📊 Migrating budget data...
✅ Migrated 1 budget record(s)

💰 Migrating expenses...
✅ Migrated 5 expense(s)

💳 Migrating payments...
✅ Migrated 12 payment(s)

================================================
✅ Migration completed successfully!
================================================
📊 Budget records: 1
💰 Expenses: 5
💳 Payments: 12
================================================
```

### Step 6: Start Your Application

```bash
npm run dev
```

Or use the startup script:
```bash
./start.sh
```

Your app will now use MongoDB! Visit http://localhost:3000

## Troubleshooting

### Error: "MONGODB_URI not found"
- Make sure you created the `.env` file
- Make sure the file is in the root directory
- Check that the file contains `MONGODB_URI=...`

### Error: "Authentication failed"
- Double-check your MongoDB password
- Make sure there are no special characters that need URL encoding
- If your password has special characters, URL encode them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `:` becomes `%3A`
  - etc.

### Error: "Database not found"
- This is normal! MongoDB will create the database automatically
- The database name is `wedding-expense` (from the connection string)

### Migration runs but no data appears
- Check MongoDB Atlas dashboard to see if data was inserted
- Make sure your SQLite database file exists and has data
- Run `ls -la` and look for `wedding_expenses.db`

## After Migration

Once migration is successful:

1. ✅ Your data is now in MongoDB
2. ✅ You can deploy to Netlify, Vercel, or any serverless platform
3. ✅ The SQLite database file is no longer needed (but keep it as backup)
4. ✅ All API routes now use MongoDB

## Optional: Keep SQLite as Backup

You can keep the `wedding_expenses.db` file as a backup. Just don't delete it until you verify everything works in MongoDB.

## Deployment

After successful migration, you can deploy to:
- **Vercel**: `vercel`
- **Netlify**: Push to GitHub and connect
- **Any platform that supports Next.js**

Make sure to add `MONGODB_URI` as an environment variable in your deployment platform!
