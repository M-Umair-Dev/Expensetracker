import { Trash2, Edit } from 'lucide-react';

// Notice we added the "onEdit" prop!
export default function ExpenseItem({ expense, onDelete, onEdit }) {
  return (
    <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div>
        <h3 className="font-semibold text-slate-800">{expense.title}</h3>
        <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
          {expense.category}
        </span>
      </div>
      
      <div className="flex items-center gap-6">
        <span className="text-lg font-bold text-slate-900">
          Rs {expense.amount.toFixed(2)}
        </span>
        <div className="flex gap-3">
          {/* We wired up the Edit button here */}
          <button 
            onClick={() => onEdit(expense)} 
            className="text-slate-400 transition-colors hover:text-blue-500"
          >
            <Edit size={18} />
          </button>
          
          <button 
            onClick={() => onDelete(expense._id)} 
            className="text-slate-400 transition-colors hover:text-red-500"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}