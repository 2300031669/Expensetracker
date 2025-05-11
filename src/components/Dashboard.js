import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(0);
  const [balance, setBalance] = useState(0);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [budgets, setBudgets] = useState({
    food: 0,
    transport: 0,
    utilities: 0,
    entertainment: 0,
    other: 0
  });
  const [showSetBudget, setShowSetBudget] = useState(false);
  const navigate = useNavigate();

  const categoryIcons = {
    food: '🍔',
    transport: '🚗',
    utilities: '🏠',
    entertainment: '🎮',
    other: '📦'
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedBudgets = localStorage.getItem('budgets');
    const savedBalance = localStorage.getItem('balance');
    const savedIncome = localStorage.getItem('income');

    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
    if (savedBalance) setBalance(parseFloat(savedBalance));
    if (savedIncome) setIncome(parseFloat(savedIncome));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('budgets', JSON.stringify(budgets));
    localStorage.setItem('balance', balance.toString());
    localStorage.setItem('income', income.toString());
  }, [expenses, budgets, balance, income]);

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now(),
      date: new Date().toLocaleDateString()
    };
    setExpenses([...expenses, newExpense]);
    setBalance(balance - expense.amount);
  };

  const addIncome = (amount) => {
    const incomeAmount = parseFloat(amount);
    setIncome(income + incomeAmount);
    setBalance(balance + incomeAmount);
  };

  const deleteExpense = (expenseId) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (expense) {
      setExpenses(expenses.filter(e => e.id !== expenseId));
      setBalance(balance + expense.amount);
    }
  };

  const updateBudget = (category, amount) => {
    setBudgets(prev => ({
      ...prev,
      [category]: parseFloat(amount)
    }));
  };

  const handleLogout = () => {
    navigate('/signin');
  };

  const getCategoryTotal = (category) => {
    return expenses
      .filter(expense => expense.category === category)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getBudgetStatus = (category) => {
    const spent = getCategoryTotal(category);
    const budget = budgets[category];
    const percentage = (spent / budget) * 100;
    return {
      spent,
      budget,
      percentage: budget > 0 ? percentage : 0
    };
  };

  const getMonthlySummary = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    });

    const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + budget, 0);

    return {
      totalSpent,
      totalBudget,
      remaining: totalBudget - totalSpent
    };
  };

  const monthlySummary = getMonthlySummary();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Expense Tracker</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>
      <main className="App-main">
        <div className="summary-container">
          <div className="balance-container">
            <h2>Current Balance</h2>
            <p className="balance">${balance.toFixed(2)}</p>
          </div>
          <div className="income-container">
            <h2>Total Income</h2>
            <p className="income">${income.toFixed(2)}</p>
          </div>
          <div className="monthly-summary">
            <h2>Monthly Summary</h2>
            <p>Spent: ${monthlySummary.totalSpent.toFixed(2)}</p>
            <p>Budget: ${monthlySummary.totalBudget.toFixed(2)}</p>
            <p>Remaining: ${monthlySummary.remaining.toFixed(2)}</p>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="add-income-btn"
            onClick={() => setShowAddIncome(!showAddIncome)}
          >
            {showAddIncome ? 'Cancel' : 'Add Income'}
          </button>
          <button 
            className="set-budget-btn"
            onClick={() => setShowSetBudget(!showSetBudget)}
          >
            {showSetBudget ? 'Cancel' : 'Set Budgets'}
          </button>
          <button 
            className="add-expense-btn"
            onClick={() => setShowAddExpense(!showAddExpense)}
          >
            {showAddExpense ? 'Cancel' : 'Add Expense'}
          </button>
        </div>

        {showAddIncome && (
          <form className="income-form" onSubmit={(e) => {
            e.preventDefault();
            const amount = e.target.amount.value;
            addIncome(amount);
            e.target.reset();
            setShowAddIncome(false);
          }}>
            <input
              type="number"
              name="amount"
              placeholder="Enter income amount"
              required
              min="0"
              step="0.01"
            />
            <button type="submit">Add Income</button>
          </form>
        )}

        {showSetBudget && (
          <div className="budget-form">
            <h3>Set Monthly Budgets</h3>
            {Object.keys(budgets).map(category => (
              <div key={category} className="budget-input-group">
                <label>
                  <span className="category-icon">{categoryIcons[category]}</span>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </label>
                <input
                  type="number"
                  value={budgets[category]}
                  onChange={(e) => updateBudget(category, e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="Enter budget"
                />
              </div>
            ))}
          </div>
        )}
        
        {showAddExpense && (
          <form className="expense-input-form" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            addExpense({
              description: formData.get('description'),
              amount: parseFloat(formData.get('amount')),
              category: formData.get('category')
            });
            e.target.reset();
            setShowAddExpense(false);
          }}>
            <input
              type="text"
              name="description"
              placeholder="Description"
              className="expense-input"
              required
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              className="expense-input"
              required
              min="0"
              step="0.01"
            />
            <select name="category" className="expense-input" required>
              <option value="">Select Category</option>
              {Object.keys(budgets).map(category => (
                <option key={category} value={category}>
                  {categoryIcons[category]} {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <button type="submit" className="submit-btn">
              Add Expense
            </button>
          </form>
        )}

        <div className="budget-overview">
          <h3>Budget Overview</h3>
          {Object.keys(budgets).map(category => {
            const status = getBudgetStatus(category);
            return (
              <div key={category} className="budget-item">
                <div className="budget-header">
                  <span className="category-icon">{categoryIcons[category]}</span>
                  <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  <span>${status.spent.toFixed(2)} / ${status.budget.toFixed(2)}</span>
                </div>
                <div className="budget-bar">
                  <div 
                    className="budget-progress" 
                    style={{ 
                      width: `${Math.min(status.percentage, 100)}%`,
                      backgroundColor: status.percentage > 100 ? '#e74c3c' : '#2ecc71'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="expenses-list">
          <h2>Recent Expenses</h2>
          {expenses.length === 0 ? (
            <p>No expenses added yet</p>
          ) : (
            <ul>
              {expenses.map((expense) => (
                <li key={expense.id} className="expense-item">
                  <span className="expense-date">{expense.date}</span>
                  <span className="expense-description">{expense.description}</span>
                  <span className="expense-amount">${expense.amount.toFixed(2)}</span>
                  <span className="expense-category">
                    {categoryIcons[expense.category]} {expense.category}
                  </span>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteExpense(expense.id)}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard; 