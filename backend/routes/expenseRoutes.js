import express from 'express';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js'; // Import the bouncer

const router = express.Router();

// We put the "protect" middleware before the controllers
router.route('/')
  .get(protect, getExpenses)
  .post(protect, createExpense);

// Routes that require an ID (like /api/expenses/12345)
router.route('/:id')
  .put(protect, updateExpense)
  .delete(protect, deleteExpense);

export default router;