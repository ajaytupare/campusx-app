import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const Landing = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/home', { replace: true });
    } catch (err) {
      setError('Failed to sign in. Please check your email and password.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-gray-900">
      
      {/* Left Side - The Beautiful Graphic/Image (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
        {/* Background Image of a Campus */}
        <div 
          className="absolute inset-0 opacity-60 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')" }}
        ></div>
        
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-lg px-12 mt-auto pb-24 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-600/30 border border-purple-500/30 text-purple-100 text-sm font-bold mb-6 backdrop-blur-sm shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ghost"><path d="M9 10h.01"/><path d="M14 10h.01"/><path d="M10 16c.5.3 1.5.3 2 0"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>
            Featuring Ghost Mode
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            The heart of your campus.<br/>Completely Unfiltered.
          </h2>
          <p className="text-lg text-gray-300 font-medium leading-relaxed">
            Connect with students and discover events. Toggle <strong className="text-purple-300">Ghost Mode</strong> to post, chat, and review completely anonymously.
          </p>
        </div>
      </div>

      {/* Right Side - The Clean Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-16 lg:px-24 relative">
        
        <div className="w-full max-w-sm">
          {/* Brand Logo */}
          <div className="mb-10 flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight">CampusX</h1>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ghost text-purple-600"><path d="M9 10h.01"/><path d="M14 10h.01"/><path d="M10 16c.5.3 1.5.3 2 0"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>
          </div>

          {/* Headings */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
            <p className="text-gray-500 font-medium text-sm">Please enter your details to sign in.</p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                University Email
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm font-bold text-black hover:underline">
                Forgot password?
              </a>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-xl py-3.5 font-bold text-sm hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm font-medium text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-black font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
};

export default Landing;
