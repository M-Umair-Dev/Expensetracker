import { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseItem from '../components/ExpenseItem';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  
  // New: Tracks which expense we are currently editing (null means we are adding a new one)
  const [editId, setEditId] = useState(null);

  const user = JSON.parse(localStorage.getItem('userInfo'));

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  useEffect(() => {
    if (user) fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('https://expensetracker-backend-yfkd.onrender.com/api/expenses', config);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  // This function handles BOTH Add and Update now!
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const expenseData = { title, amount: Number(amount), category };
      
      if (editId) {
        // UPDATE EXISTING EXPENSE
        const response = await axios.put(`https://expensetracker-backend-yfkd.onrender.com/api/expenses/${editId}`, expenseData, config);
        // Replace the old expense in our list with the newly updated one
        setExpenses(expenses.map(exp => exp._id === editId ? response.data : exp));
      } else {
        // ADD NEW EXPENSE
        const response = await axios.post('https://expensetracker-backend-yfkd.onrender.com/api/expenses', expenseData, config);
        setExpenses([response.data, ...expenses]);
      }
      
      // Clear the form after saving
      clearForm();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  // Triggers when the user clicks the blue Edit icon
  const handleEditClick = (expense) => {
    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
    setEditId(expense._id); // Locks the form into "Edit Mode"
  };

  // Clears the form and cancels Edit Mode
  const clearForm = () => {
    setTitle('');
    setAmount('');
    setCategory('Food');
    setEditId(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://expensetracker-backend-yfkd.onrender.com/api/expenses/${id}`, config);
      setExpenses(expenses.filter((expense) => expense._id !== id));
      
      // If they delete the item they are currently editing, clear the form!
      if (editId === id) clearForm();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };
// Calculate data for the chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ff7300'];

const getChartData = () => {
  const totals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  return Object.keys(totals).map((key) => ({
    name: key,
    value: totals[key],
  }));
};

const chartData = getChartData();
  return (
    <div className="mx-auto max-w-3xl p-6 pt-10">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.name}!</h1>
        <p className="text-slate-500">Here is your personal expense overview.</p>
      </div>

      {/* Dynamic Form (Changes based on whether editId exists) */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            {editId ? 'Update Expense' : 'Add New Expense'}
          </h2>
          {/* Show a Cancel button only if we are in Edit Mode */}
          {editId && (
            <button onClick={clearForm} className="text-sm font-medium text-slate-500 hover:text-slate-800">
              Cancel Edit
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium text-slate-700">Description</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none" placeholder="e.g., Coffee" />
          </div>
          <div className="w-32 space-y-1">
            <label className="text-xs font-medium text-slate-700">Amount (Rs)</label>
            <input type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none" placeholder="0.00" />
          </div>
          <div className="w-40 space-y-1">
            <label className="text-xs font-medium text-slate-700">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none bg-white">
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className={`rounded-md px-6 py-2 text-sm font-medium text-white transition ${
              editId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {editId ? 'Save' : 'Add'}
          </button>
        </form>
      </div>

      <div>
        {expenses.length > 0 && (
  <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="mb-4 text-lg font-bold text-slate-900">Expense Breakdown</h2>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
)}
        <h2 className="mb-4 text-lg font-bold text-slate-900">Recent Expenses</h2>
        {expenses.length === 0 ? (
          <p className="text-slate-500 rounded-lg border border-dashed border-slate-300 p-8 text-center">No expenses found. Add your first one above!</p>
        ) : (
          expenses.map((expense) => (
            <ExpenseItem 
              key={expense._id} 
              expense={expense} 
              onDelete={handleDelete} 
              onEdit={handleEditClick} 
            />
          ))
        )}
      </div>
    </div>
  );
}