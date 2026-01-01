import { useState } from 'react';

export default function ExpenseList({ expenses, onEdit, onDelete, onAddPayment }) {
  const [expandedExpense, setExpandedExpense] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const toggleExpand = (expenseId) => {
    setExpandedExpense(expandedExpense === expenseId ? null : expenseId);
  };

  if (expenses.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          No expenses added yet. Click "Add New Expense" to get started!
        </p>
      </div>
    );
  }

  return (
    <div>
      {expenses.map((expense) => {
        const paymentProgress = expense.estimated_amount > 0
          ? (expense.total_paid / expense.estimated_amount) * 100
          : 0;

        return (
          <div key={expense.id} className="expense-item">
            <div className="expense-header">
              <div>
                <div className="expense-title">{expense.event_name}</div>
                {expense.vendor_name && (
                  <div className="expense-vendor">Vendor: {expense.vendor_name}</div>
                )}
              </div>
            </div>

            <div className="expense-amounts">
              <div className="amount-item">
                <div className="amount-label">Estimated</div>
                <div className="amount-value estimate">
                  {formatCurrency(expense.estimated_amount)}
                </div>
              </div>
              <div className="amount-item">
                <div className="amount-label">Paid</div>
                <div className="amount-value paid">
                  {formatCurrency(expense.total_paid)}
                </div>
              </div>
              <div className="amount-item">
                <div className="amount-label">Remaining</div>
                <div className="amount-value remaining">
                  {formatCurrency(expense.remaining_amount)}
                </div>
              </div>
            </div>

            <div className="progress-bar">
              <div
                className={`progress-fill ${paymentProgress > 100 ? 'over-budget' : ''}`}
                style={{ width: `${Math.min(paymentProgress, 100)}%` }}
              ></div>
            </div>
            <div style={{ fontSize: '0.85rem', marginTop: '5px', color: '#666' }}>
              {paymentProgress.toFixed(1)}% paid
              {paymentProgress > 100 && (
                <span style={{ color: '#ef4444', marginLeft: '10px' }}>
                  (Exceeded by {formatCurrency(expense.total_paid - expense.estimated_amount)})
                </span>
              )}
            </div>

            {expense.notes && (
              <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                {expense.notes}
              </div>
            )}

            <div className="expense-actions">
              <button
                className="btn btn-primary"
                onClick={() => onAddPayment(expense)}
              >
                Add Payment
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => onEdit(expense)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${expense.event_name}"? This will also delete all associated payments.`)) {
                    onDelete(expense.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
