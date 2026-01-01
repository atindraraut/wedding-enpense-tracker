import { useState, useEffect } from 'react';
import Head from 'next/head';
import Dashboard from '../components/Dashboard';
import BudgetForm from '../components/BudgetForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import PaymentForm from '../components/PaymentForm';

export default function Home() {
  const [stats, setStats] = useState({
    totalBudget: 0,
    totalEstimate: 0,
    totalPaid: 0,
    totalPending: 0,
    utilizedBudget: 0,
    remainingBudget: 0,
    exceedingEstimate: 0,
    exceedingBudget: 0,
    isOverBudget: false,
    isOverEstimate: false
  });
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchDashboardStats(),
        fetchBudget(),
        fetchExpenses()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchBudget = async () => {
    try {
      const response = await fetch('/api/budget');
      const data = await response.json();
      setBudget(data.total_budget);
    } catch (error) {
      console.error('Error fetching budget:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      const data = await response.json();

      // Fetch payment details for each expense
      const expensesWithPayments = await Promise.all(
        data.map(async (expense) => {
          try {
            const paymentsResponse = await fetch(`/api/expenses/${expense.id}`);
            const expenseData = await paymentsResponse.json();
            return { ...expense, payments: expenseData.payments || [] };
          } catch (error) {
            console.error(`Error fetching payments for expense ${expense.id}:`, error);
            return { ...expense, payments: [] };
          }
        })
      );
      setExpenses(expensesWithPayments);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleUpdateBudget = async (newBudget) => {
    try {
      const response = await fetch('/api/budget', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total_budget: newBudget })
      });

      if (response.ok) {
        setBudget(newBudget);
        await fetchDashboardStats();
      } else {
        alert('Failed to update budget');
      }
    } catch (error) {
      console.error('Error updating budget:', error);
      alert('Failed to update budget');
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
      });

      if (response.ok) {
        setShowExpenseForm(false);
        await fetchAllData();
      } else {
        alert('Failed to add expense');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense');
    }
  };

  const handleUpdateExpense = async (expenseData) => {
    try {
      const response = await fetch(`/api/expenses/${editingExpense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
      });

      if (response.ok) {
        setShowExpenseForm(false);
        setEditingExpense(null);
        await fetchAllData();
      } else {
        alert('Failed to update expense');
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Failed to update expense');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchAllData();
      } else {
        alert('Failed to delete expense');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
    }
  };

  const handleAddPayment = async (paymentData) => {
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        setShowPaymentForm(false);
        setSelectedExpense(null);
        await fetchAllData();
      } else {
        alert('Failed to add payment');
      }
    } catch (error) {
      console.error('Error adding payment:', error);
      alert('Failed to add payment');
    }
  };

  const openEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const openAddPayment = (expense) => {
    setSelectedExpense(expense);
    setShowPaymentForm(true);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Wedding Expense Calculator</title>
        <meta name="description" content="Track your wedding expenses and budget" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container">
        <div className="header">
          <h1>Wedding Expense Calculator</h1>
          <p>Track your wedding expenses and stay within budget</p>
        </div>

        <BudgetForm currentBudget={budget} onUpdate={handleUpdateBudget} />

        <Dashboard stats={stats} />

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Expenses</h2>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingExpense(null);
                setShowExpenseForm(true);
              }}
            >
              + Add New Expense
            </button>
          </div>

          <ExpenseList
            expenses={expenses}
            onEdit={openEditExpense}
            onDelete={handleDeleteExpense}
            onAddPayment={openAddPayment}
          />
        </div>

        {showExpenseForm && (
          <ExpenseForm
            expense={editingExpense}
            onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
            onCancel={() => {
              setShowExpenseForm(false);
              setEditingExpense(null);
            }}
          />
        )}

        {showPaymentForm && selectedExpense && (
          <PaymentForm
            expense={selectedExpense}
            onSubmit={handleAddPayment}
            onCancel={() => {
              setShowPaymentForm(false);
              setSelectedExpense(null);
            }}
          />
        )}
      </div>
    </>
  );
}
