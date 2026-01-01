import { useState } from 'react';

export default function PaymentForm({ expense, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      expense_id: expense.id,
      amount: parseFloat(formData.amount),
      payment_date: formData.payment_date,
      notes: formData.notes
    });
  };

  const remainingAmount = expense.remaining_amount || 0;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Payment</h2>
          <button className="close-btn" onClick={onCancel}>&times;</button>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', background: '#f3f4f6', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '10px' }}>{expense.event_name}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: '#666' }}>Estimated:</span>
              <strong style={{ marginLeft: '5px' }}>₹{expense.estimated_amount?.toLocaleString('en-IN')}</strong>
            </div>
            <div>
              <span style={{ color: '#666' }}>Already Paid:</span>
              <strong style={{ marginLeft: '5px', color: '#10b981' }}>
                ₹{expense.total_paid?.toLocaleString('en-IN')}
              </strong>
            </div>
            <div>
              <span style={{ color: '#666' }}>Remaining:</span>
              <strong style={{ marginLeft: '5px', color: '#f59e0b' }}>
                ₹{remainingAmount.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Payment Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
              min="0.01"
              step="0.01"
            />
            {formData.amount && parseFloat(formData.amount) > remainingAmount && (
              <small style={{ color: '#f59e0b' }}>
                Note: This payment exceeds the remaining amount by ₹{(parseFloat(formData.amount) - remainingAmount).toLocaleString('en-IN')}
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Payment Date *</label>
            <input
              type="date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              placeholder="Payment reference, method, etc."
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="btn btn-success">
              Add Payment
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
