import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFirebaseError = (errCode) => {
    switch (errCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'An error occurred during sign in. Please try again.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError(handleFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cx-bg-base)] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[440px] bg-[var(--cx-bg-surface)] rounded-[32px] p-8 md:p-10 shadow-lg border border-[var(--cx-text-muted)]/10">
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="w-12 h-12 bg-[var(--cx-primary)] rounded-[14px] flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20">
              <span className="text-white font-extrabold text-2xl">C</span>
            </div>
          </Link>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--cx-text-main)] mb-2 tracking-tight">Welcome back</h2>
          <p className="text-[14px] font-medium text-[var(--cx-text-muted)]">Sign in to your university network.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-[16px] text-[13px] font-bold border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[12px] font-bold text-[var(--cx-text-main)] uppercase tracking-wider mb-2 pl-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[16px] px-4 py-3.5 text-[15px] focus:ring-2 focus:ring-[var(--cx-primary)] outline-none transition-all placeholder:text-[var(--cx-text-muted)]/50 font-medium text-[var(--cx-text-main)]"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2 pl-1 pr-1">
              <label className="block text-[12px] font-bold text-[var(--cx-text-main)] uppercase tracking-wider">Password</label>
              <a href="#" className="text-[12px] font-bold text-[var(--cx-primary)] hover:underline">Forgot?</a>
            </div>
            <input 
              type="password" 
              required
              className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[16px] px-4 py-3.5 text-[15px] focus:ring-2 focus:ring-[var(--cx-primary)] outline-none transition-all placeholder:text-[var(--cx-text-muted)]/50 font-medium text-[var(--cx-text-main)]"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-[16px] font-bold text-[15px] transition-all shadow-md flex items-center justify-center gap-2 mt-2
              ${loading ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed' : 'bg-[var(--cx-primary)] text-white hover:brightness-110 hover:-translate-y-0.5 shadow-indigo-500/20'}`}
          >
            {loading ? 'Signing in...' : (
              <>Sign In <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>



        <p className="text-center mt-8 text-[14px] font-medium text-[var(--cx-text-muted)]">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[var(--cx-text-main)] hover:text-[var(--cx-primary)] transition-colors">
            Request Access
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
