# Jitendra Wedding Expense Calculator (Next.js)

A full-stack web application built with Next.js to manage and track wedding expenses with budget monitoring, partial payment support, and comprehensive financial tracking.

## Features

- **Budget Management**: Set and update your total wedding budget
- **Dashboard Statistics**: View real-time stats including:
  - Total Budget
  - Total Estimate
  - Total Paid
  - Total Pending
  - Utilized Budget
  - Remaining Budget
  - Exceeding alerts

- **Expense Tracking**:
  - Add expenses with event name, vendor, and estimated amount
  - Edit existing expenses
  - Delete expenses (with payment cascade)
  - View payment progress for each expense

- **Partial Payment Support**:
  - Add multiple payments per expense
  - Track remaining amount to pay
  - View payment history for each expense
  - Get alerts when payments exceed estimates

- **Visual Feedback**:
  - Progress bars for budget utilization
  - Color-coded amounts (estimate, paid, remaining)
  - Alerts when budget or estimates are exceeded
  - Responsive design with gradient UI

## Tech Stack

- **Next.js 14** - React framework with built-in API routes
- **React 18** - Frontend UI
- **MongoDB Atlas** - Cloud database (NoSQL)
- **Mongoose** - MongoDB ODM
- **CSS3** - Custom styling

## Why Next.js + MongoDB?

This application uses a modern serverless stack:
- ✅ Single Next.js application - no need to run two servers
- ✅ Built-in API routes - no separate Express server needed
- ✅ MongoDB Atlas - Cloud database that works with serverless deployments
- ✅ Deploy to Netlify, Vercel, or any serverless platform
- ✅ Better performance with server-side rendering
- ✅ One port (3000) instead of two

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)

### Step 1: Set Up Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your MongoDB password:
```env
MONGODB_URI=mongodb+srv://atindra:YOUR_PASSWORD@cluster0.vmkw431.mongodb.net/wedding-expense?retryWrites=true&w=majority
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Migrate Existing Data (Optional)

If you have existing SQLite data, run the migration:
```bash
npm run migrate
```

See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for detailed migration instructions.

### Step 4: Start the Application

**Option 1: Using Start Script (Recommended)**

**For macOS/Linux:**
```bash
./start.sh
```

**For Windows:**
```bash
start.bat
```

**Option 2: Manual Start**

```bash
npm run dev
```

Then open **http://localhost:3000** in your browser.

## Project Structure

```
expensecalculate/
├── components/           # React components
│   ├── BudgetForm.js
│   ├── Dashboard.js
│   ├── ExpenseForm.js
│   ├── ExpenseList.js
│   └── PaymentForm.js
├── lib/                 # Database and utilities
│   └── db.js           # SQLite database setup
├── pages/              # Next.js pages and API routes
│   ├── api/           # API endpoints
│   │   ├── budget.js
│   │   ├── dashboard.js
│   │   ├── expenses/
│   │   │   ├── index.js
│   │   │   └── [id].js
│   │   └── payments/
│   │       ├── index.js
│   │       └── [id].js
│   ├── _app.js        # App wrapper
│   └── index.js       # Main page
├── styles/
│   └── globals.css    # Global styles
├── package.json
├── next.config.js
└── wedding_expenses.db  # SQLite database (auto-created)
```

## Database Schema (MongoDB)

### Collections

**budgets**
- `_id`: MongoDB ObjectId
- `total_budget`: Number - Total wedding budget amount
- `created_at`: Date
- `updated_at`: Date

**expenses**
- `_id`: MongoDB ObjectId
- `event_name`: String - Name of the event/category
- `vendor_name`: String - Name of the vendor
- `estimated_amount`: Number - Estimated cost
- `notes`: String - Additional notes
- `created_at`: Date
- `updated_at`: Date

**payments**
- `_id`: MongoDB ObjectId
- `expense_id`: ObjectId - Reference to expense
- `amount`: Number - Payment amount
- `payment_date`: Date - Date of payment
- `notes`: String - Payment notes
- `created_at`: Date

## API Endpoints

All API endpoints are available at `/api/*`:

### Dashboard
- `GET /api/dashboard` - Get all statistics

### Budget
- `GET /api/budget` - Get current budget
- `PUT /api/budget` - Update budget

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/[id]` - Get single expense with payments
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/[id]` - Update expense
- `DELETE /api/expenses/[id]` - Delete expense

### Payments
- `POST /api/payments` - Add new payment
- `DELETE /api/payments/[id]` - Delete payment

## Usage Guide

1. **Set Your Budget**: Click "Update Budget" to set your total wedding budget

2. **Add Expenses**: Click "+ Add New Expense" to add a new expense item with:
   - Event/Category name (e.g., Catering, Venue, Photography)
   - Vendor name
   - Estimated amount
   - Optional notes

3. **Make Payments**: For each expense, click "Add Payment" to record:
   - Payment amount
   - Payment date
   - Optional notes

4. **Monitor Progress**: The dashboard shows:
   - How much budget you've used
   - Total pending payments
   - Alerts if you're exceeding budget or estimates

5. **Edit/Delete**: Use the Edit and Delete buttons on each expense to manage your data

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run linting
```

## Deployment

### Environment Variables

Before deploying, make sure to add your `MONGODB_URI` as an environment variable in your deployment platform.

### Deployment Platforms

You can deploy this Next.js app to:

**Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```
Add `MONGODB_URI` in Vercel dashboard → Settings → Environment Variables

**Netlify**
1. Push code to GitHub
2. Connect repository in Netlify
3. Add `MONGODB_URI` in Site Settings → Environment Variables
4. Deploy!

**Other Platforms**
- Railway
- Render
- DigitalOcean App Platform
- Any platform supporting Next.js

All platforms work great with MongoDB Atlas since it's a cloud database!

## Troubleshooting

**Port 3000 already in use?**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

**MongoDB Connection Error?**
- Check your `.env` file exists and has the correct `MONGODB_URI`
- Verify your MongoDB password is correct
- URL encode special characters in password (@, #, :, etc.)
- Check MongoDB Atlas → Network Access → Allow your IP address

**Database issues?**
- Verify MongoDB Atlas cluster is running
- Check connection string format
- See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for detailed troubleshooting

**Dependencies not installing?**
- Make sure Node.js and npm are installed: `node --version` and `npm --version`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

## Currency Format

The application uses Indian Rupee (INR) currency format. To change to a different currency, update the `formatCurrency` function in the components.

## License

MIT License - feel free to use this for your wedding planning!
