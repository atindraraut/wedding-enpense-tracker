import { useState } from 'react';

export default function BudgetForm({ currentBudget, onUpdate }) {
  const [budget, setBudget] = useState(currentBudget);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdate(parseFloat(budget));
    setIsEditing(false);
  };

  return (
    <div className="card">
      {!isEditing ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h2 style={{ margin: 0 }}>Wedding Budget:</h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              ₹{parseFloat(currentBudget).toLocaleString('en-IN')}
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Update Budget
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Total Budget Amount</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-success">
              Save
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setBudget(currentBudget);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
