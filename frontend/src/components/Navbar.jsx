import { Link, useNavigate } from 'react-router-dom';
import { LogOut, UserPlus, LogIn } from 'lucide-react';

export default function Navbar({ isAuthenticated, logoutUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between bg-slate-900 px-6 py-4 text-white shadow-md">
      {/* Clicking the logo routes to the home/dashboard */}
      <Link to="/" className="text-xl font-bold tracking-tight hover:text-slate-300 transition-colors">
        ExpenseTracker
      </Link>
      
      <div className="flex gap-4">
        {isAuthenticated ? (
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-700"
          >
            <LogOut size={16} />
            Logout
          </button>
        ) : (
          <>
            <Link 
              to="/login" 
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-800"
            >
              <LogIn size={16} />
              Login
            </Link>
            <Link 
              to="/signup" 
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 shadow-sm"
            >
              <UserPlus size={16} />
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}