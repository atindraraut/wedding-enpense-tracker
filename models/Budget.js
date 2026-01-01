import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  total_budget: {
    type: Number,
    required: true,
    default: 0
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
BudgetSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);
