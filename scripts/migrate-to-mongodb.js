const sqlite3 = require('sqlite3').verbose();
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// SQLite setup
const dbPath = path.join(__dirname, '../wedding_expenses.db');
const sqliteDb = new sqlite3.Database(dbPath);

// MongoDB Models (define inline for migration script)
const budgetSchema = new mongoose.Schema({
  total_budget: Number,
  created_at: Date,
  updated_at: Date
});

const expenseSchema = new mongoose.Schema({
  event_name: String,
  vendor_name: String,
  estimated_amount: Number,
  notes: String,
  created_at: Date,
  updated_at: Date
});

const paymentSchema = new mongoose.Schema({
  expense_id: mongoose.Schema.Types.ObjectId,
  amount: Number,
  payment_date: Date,
  notes: String,
  created_at: Date
});

const Budget = mongoose.model('Budget', budgetSchema);
const Expense = mongoose.model('Expense', expenseSchema);
const Payment = mongoose.model('Payment', paymentSchema);

// Helper to promisify SQLite queries
const sqliteAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    sqliteDb.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

async function migrate() {
  try {
    console.log('🚀 Starting migration from SQLite to MongoDB...\n');

    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in .env file!');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data in MongoDB (optional - comment out if you want to keep existing MongoDB data)
    await Budget.deleteMany({});
    await Expense.deleteMany({});
    await Payment.deleteMany({});
    console.log('🗑️  Cleared existing MongoDB data\n');

    // Migrate Budget
    console.log('📊 Migrating budget data...');
    const budgets = await sqliteAll('SELECT * FROM budget');
    if (budgets.length > 0) {
      const budgetData = budgets.map(b => ({
        total_budget: b.total_budget,
        created_at: new Date(b.created_at),
        updated_at: new Date(b.updated_at)
      }));
      await Budget.insertMany(budgetData);
      console.log(`✅ Migrated ${budgetData.length} budget record(s)\n`);
    }

    // Migrate Expenses
    console.log('💰 Migrating expenses...');
    const expenses = await sqliteAll('SELECT * FROM expenses');
    const expenseIdMap = {}; // Map SQLite IDs to MongoDB IDs

    if (expenses.length > 0) {
      for (const exp of expenses) {
        const mongoExpense = await Expense.create({
          event_name: exp.event_name,
          vendor_name: exp.vendor_name || '',
          estimated_amount: exp.estimated_amount,
          notes: exp.notes || '',
          created_at: new Date(exp.created_at),
          updated_at: new Date(exp.updated_at)
        });
        expenseIdMap[exp.id] = mongoExpense._id;
      }
      console.log(`✅ Migrated ${expenses.length} expense(s)\n`);
    }

    // Migrate Payments
    console.log('💳 Migrating payments...');
    const payments = await sqliteAll('SELECT * FROM payments');

    if (payments.length > 0) {
      const paymentData = payments.map(p => ({
        expense_id: expenseIdMap[p.expense_id],
        amount: p.amount,
        payment_date: new Date(p.payment_date),
        notes: p.notes || '',
        created_at: new Date(p.created_at)
      }));
      await Payment.insertMany(paymentData);
      console.log(`✅ Migrated ${paymentData.length} payment(s)\n`);
    }

    // Summary
    console.log('================================================');
    console.log('✅ Migration completed successfully!');
    console.log('================================================');
    console.log(`📊 Budget records: ${budgets.length}`);
    console.log(`💰 Expenses: ${expenses.length}`);
    console.log(`💳 Payments: ${payments.length}`);
    console.log('================================================\n');

    // Close connections
    sqliteDb.close();
    await mongoose.connection.close();
    console.log('🔒 Connections closed\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    sqliteDb.close();
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run migration
migrate();
