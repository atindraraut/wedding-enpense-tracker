import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  event_name: {
    type: String,
    required: true
  },
  vendor_name: {
    type: String,
    default: ''
  },
  estimated_amount: {
    type: Number,
    required: true,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update the updated_at timestamp before saving
ExpenseSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
