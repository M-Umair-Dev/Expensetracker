import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await axios.post('https://expensetracker-backend-yfkd.onrender.com/api/users/login', {
        email,
        password
      });
      
      onLogin(response.data); 
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Enter your details to sign in.</p>
        </div>
        
        {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2" placeholder="m@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2" />
          </div>
          <button type="submit" className="inline-flex h-10 w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/signup" className="font-medium text-slate-900 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}