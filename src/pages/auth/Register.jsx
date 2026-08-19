import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    department: '',
    year: '1',
    semester: '1'
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleFirebaseError = (errCode) => {
    switch (errCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please log in.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Must be at least 6 characters.';
      default:
        return 'An error occurred during registration. Please try again.';
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Removed .edu validation to allow simple emails
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    
    try {
      await register(formData.email, formData.password, {
        name: formData.name,
        college: formData.college,
        department: formData.department,
        year: formData.year,
        semester: formData.semester,
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        cover: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80',
        bio: 'Just joined CampusX!',
        location: 'Campus',
        friendsCount: 0
      });
      // Redirect to home explicitly to prevent routing race conditions
      window.location.href = '/home';
    } catch (err) {
      console.error("Registration Error:", err);
      // Show exact message for debugging
      setError(err.code ? handleFirebaseError(err.code) : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cx-bg-base)] flex flex-col items-center justify-center p-6 font-sans overflow-y-auto py-12">
      <div className="w-full max-w-[500px] bg-[var(--cx-bg-surface)] rounded-[32px] p-8 md:p-10 shadow-lg border border-[var(--cx-text-muted)]/10">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[var(--cx-primary)] rounded-[14px] flex items-center justify-center mx-auto mb-6 shadow-md shadow-indigo-500/20">
            <span className="text-white font-extrabold text-2xl">C</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--cx-text-main)] mb-2 tracking-tight">Join CampusX</h2>
          <p className="text-[14px] font-medium text-[var(--cx-text-muted)]">Connect with your campus community.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-[16px] text-[13px] font-bold border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-[12px] font-bold text-[var(--cx-text-main)] uppercase tracking-wider mb-2 pl-1">Full Name</label>
            <input 
              type="text" 
              name="name"
              required
              className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[16px] px-4 py-3.5 text-[15px] focus:ring-2 focus:ring-[var(--cx-primary)] outline-none transition-all placeholder:text-[var(--cx-text-muted)]/50 font-medium text-[var(--cx-text-main)]"
              placeholder="Alex Chen"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[var(--cx-text-main)] uppercase tracking-wider mb-2 pl-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[16px] px-4 py-3.5 text-[15px] focus:ring-2 focus:ring-[var(--cx-primary)] outline-none transition-all placeholder:text-[var(--cx-text-muted)]/50 font-medium text-[var(--cx-text-main)]"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[var(--cx-text-main)] uppercase tracking-wider mb-2 pl-1">Password</label>
            <input 
              type="password" 
              name="password"
              required
              className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[16px] px-4 py-3.5 text-[15px] focus:ring-2 focus:ring-[var(--cx-primary)] outline-none transition-all placeholder:text-[var(--cx-text-muted)]/50 font-medium text-[var(--cx-text-main)]"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[var(--cx-text-main)] uppercase tracking-wider mb-2 pl-1">College / University Name</label>
            <input 
              type="text" 
              name="college"
              required
              className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[16px] px-4 py-3.5 text-[15px] focus:ring-2 focus:ring-[var(--cx-primary)] outline-none transition-all placeholder:text-[var(--cx-text-muted)]/50 font-medium text-[var(--cx-text-main)]"
              placeholder="e.g. Stanford University"
              value={formData.college}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[var(--cx-text-main)] uppercase tracking-wider mb-2 pl-1">Department</label>
            <input 
              type="text" 
              name="department"
              required
              className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[16px] px-4 py-3.5 text-[15px] focus:ring-2 focus:ring-[var(--cx-primary)] outline-none transition-all placeholder:text-[var(--cx-text-muted)]/50 font-medium text-[var(--cx-text-main)]"
              placeholder="e.g. Computer Science"
              value={formData.department}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[var(--cx-text-main)] uppercase tracking-wider mb-2 pl-1">Year</label>
              <select 
                name="year"
                className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[16px] px-4 py-3.5 text-[15px] focus:ring-2 focus:ring-[var(--cx-primary)] outline-none transition-all font-medium text-[var(--cx-text-main)] appearance-none"
                value={formData.year}
                onChange={handleChange}
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5+">5th+ Year / Grad</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[var(--cx-text-main)] uppercase tracking-wider mb-2 pl-1">Semester</label>
              <select 
                name="semester"
                className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[16px] px-4 py-3.5 text-[15px] focus:ring-2 focus:ring-[var(--cx-primary)] outline-none transition-all font-medium text-[var(--cx-text-main)] appearance-none"
                value={formData.semester}
                onChange={handleChange}
              >
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
              </select>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-[16px] font-bold text-[15px] transition-all shadow-md flex items-center justify-center gap-2 mt-6
              ${loading ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed' : 'bg-[var(--cx-primary)] text-white hover:brightness-110 hover:-translate-y-0.5 shadow-indigo-500/20'}`}
          >
            {loading ? 'Creating account...' : (
              <>Create Account <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="mt-6 text-center bg-green-50 p-4 rounded-[16px] flex items-start gap-3 border border-green-100 text-left">
          <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <p className="text-[12px] font-semibold text-green-800 leading-relaxed">
            Your real identity is required to prevent spam, but your personal data is protected. Ghost mode allows for anonymous posting later.
          </p>
        </div>

        <p className="text-center mt-8 text-[14px] font-medium text-[var(--cx-text-muted)]">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[var(--cx-text-main)] hover:text-[var(--cx-primary)] transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
