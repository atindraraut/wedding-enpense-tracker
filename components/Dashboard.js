export default function Dashboard({ stats }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const budgetUsagePercent = stats.totalBudget > 0
    ? (stats.utilizedBudget / stats.totalBudget) * 100
    : 0;

  return (
    <div>
      {stats.isOverBudget && (
        <div className="alert alert-danger">
          Warning: You have exceeded your budget by {formatCurrency(stats.exceedingBudget)}!
        </div>
      )}

      {stats.isOverEstimate && !stats.isOverBudget && (
        <div className="alert alert-warning">
          Notice: You have exceeded your total estimate by {formatCurrency(stats.exceedingEstimate)}
        </div>
      )}

      <div className="dashboard-grid">
        <div className="stat-card primary">
          <h3>Total Budget</h3>
          <div className="amount">{formatCurrency(stats.totalBudget)}</div>
        </div>

        <div className="stat-card">
          <h3>Total Estimate</h3>
          <div className="amount">{formatCurrency(stats.totalEstimate)}</div>
        </div>

        <div className="stat-card positive">
          <h3>Total Paid</h3>
          <div className="amount">{formatCurrency(stats.totalPaid)}</div>
        </div>

        <div className="stat-card warning">
          <h3>Total Pending</h3>
          <div className="amount">{formatCurrency(stats.totalPending)}</div>
        </div>

        <div className="stat-card">
          <h3>Utilized Budget</h3>
          <div className="amount">{formatCurrency(stats.utilizedBudget)}</div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${budgetUsagePercent > 100 ? 'over-budget' : ''}`}
              style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
            ></div>
          </div>
          <div className="budget-percentage">
            {budgetUsagePercent.toFixed(1)}% of budget
          </div>
        </div>

        <div className="stat-card">
          <h3>Remaining Budget</h3>
          <div className={`amount ${stats.remainingBudget < 0 ? 'negative' : 'positive'}`}>
            {formatCurrency(stats.remainingBudget)}
          </div>
        </div>
      </div>
    </div>
  );
}
