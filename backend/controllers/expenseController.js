import Expense from '../models/Expense.js';

// @desc    Get all expenses FOR THE LOGGED IN USER
// @route   GET /api/expenses
export const getExpenses = async (req, res) => {
  try {
    // Only find expenses where the user field matches the logged-in user's ID
    const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create an expense
// @route   POST /api/expenses
export const createExpense = async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    
    const newExpense = new Expense({
      user: req.user.id, // Attach the user to the expense
      title,
      amount,
      category,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Make sure the logged-in user matches the expense user
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to update this expense' });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Make sure the logged-in user matches the expense user
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this expense' });
    }

    await expense.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};