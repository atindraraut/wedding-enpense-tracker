import { useState, useEffect } from 'react';

export default function ExpenseForm({ expense, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    event_name: '',
    vendor_name: '',
    estimated_amount: '',
    notes: ''
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        event_name: expense.event_name,
        vendor_name: expense.vendor_name || '',
        estimated_amount: expense.estimated_amount,
        notes: expense.notes || ''
      });
    }
  }, [expense]);

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
      ...formData,
      estimated_amount: parseFloat(formData.estimated_amount)
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{expense ? 'Edit Expense' : 'Add New Expense'}</h2>
          <button className="close-btn" onClick={onCancel}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event/Category Name *</label>
            <input
              type="text"
              name="event_name"
              value={formData.event_name}
              onChange={handleChange}
              placeholder="e.g., Catering, Photography, Venue"
              required
            />
          </div>

          <div className="form-group">
            <label>Vendor Name</label>
            <input
              type="text"
              name="vendor_name"
              value={formData.vendor_name}
              onChange={handleChange}
              placeholder="e.g., ABC Caterers"
            />
          </div>

          <div className="form-group">
            <label>Estimated Amount *</label>
            <input
              type="number"
              name="estimated_amount"
              value={formData.estimated_amount}
              onChange={handleChange}
              placeholder="0.00"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Additional notes..."
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="btn btn-success">
              {expense ? 'Update' : 'Add'} Expense
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
