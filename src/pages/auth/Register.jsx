import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Frontend Validation
    if (name.trim().length < 2) {
      return setError('Please enter your full name.');
    }
    
    if (password.length < 8) {
      return setError('Password must be at least 8 characters long.');
    }
    
    if (!/(?=.*[0-9])/.test(password)) {
      return setError('Password must contain at least one number.');
    }

    setLoading(true);

    try {
      await signup(email, password, name, 'Student');
      // They will be redirected to home, where they'll see the verification banner
      navigate('/home', { replace: true });
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please log in.');
      } else {
        setError(err.message || 'Failed to create an account.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-gray-900">
      
      {/* Left Side - Community/Student Graphic */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
        {/* Different background image for Sign Up (students collaborating) */}
        <div 
          className="absolute inset-0 opacity-50 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')" }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-lg px-12 mt-auto pb-24 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-600/30 border border-purple-500/30 text-purple-100 text-sm font-bold mb-6 backdrop-blur-sm shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ghost"><path d="M9 10h.01"/><path d="M14 10h.01"/><path d="M10 16c.5.3 1.5.3 2 0"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>
            Featuring Ghost Mode
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            Join your campus community today.
          </h2>
          <p className="text-lg text-gray-300 font-medium leading-relaxed">
            Find your people and discover exclusive events. Toggle <strong className="text-purple-300">Ghost Mode</strong> to speak your mind, review professors, and post completely anonymously.
          </p>
        </div>
      </div>

      {/* Right Side - The Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-16 lg:px-24 relative overflow-y-auto py-12">
        
        <div className="w-full max-w-sm">
          {/* Brand Logo */}
          <div className="mb-10 flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight">CampusX</h1>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ghost text-purple-600"><path d="M9 10h.01"/><path d="M14 10h.01"/><path d="M10 16c.5.3 1.5.3 2 0"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>
          </div>

          {/* Headings */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Create an account</h2>
            <p className="text-gray-500 font-medium text-sm">Enter your details to get started.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Chen"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium"
                required
              />
            </div>

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
                placeholder="Create a strong password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium"
                required
                minLength={6}
              />
              <p className="text-xs font-medium text-gray-400 mt-2">Must be at least 6 characters.</p>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-xl py-3.5 font-bold text-sm hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Log In Link */}
          <p className="text-center text-sm font-medium text-gray-500 mt-8">
            Already have an account?{' '}
            <Link to="/" className="text-black font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
};

export default Register;
