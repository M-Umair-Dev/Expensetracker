import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', 
    },
    title: {
      type: String,
      required: [true, 'Please provide a title for the expense'],
      trim: true, 
      maxLength: [50, 'Title cannot be more than 50 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0.01, 'Amount must be greater than zero'] 
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'],
      default: 'Other'
    },
    date: {
      type: Date,
      default: Date.now 
    }
  },
  { 
    timestamps: true 
  }
);

const Expense = mongoose.model('Expense', expenseSchema);

// This is the line that was missing!
export default Expense;