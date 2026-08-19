import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, MapPin, Ghost, ShieldCheck } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[var(--cx-bg-base)] flex flex-col font-sans overflow-hidden">
      
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-4 md:px-12 py-6 max-w-7xl mx-auto relative z-20 gap-4 flex-wrap">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-[var(--cx-primary)] rounded-[10px] flex items-center justify-center shrink-0">
            <span className="text-white font-extrabold text-lg">C</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[var(--cx-text-main)] leading-none">CampusX</h1>
        </div>
        <div className="flex items-center gap-3 md:gap-6 shrink-0">
          <Link to="/login" className="text-[var(--cx-text-main)] font-semibold hover:text-[var(--cx-primary)] transition-colors text-[14px] md:text-[15px]">
            Log in
          </Link>
          <Link to="/register" className="px-4 md:px-5 py-2 md:py-2.5 bg-[var(--cx-text-main)] text-[var(--cx-bg-surface)] font-bold rounded-[16px] hover:bg-black transition-colors text-[14px] md:text-[15px]">
            Join CampusX
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10 pt-12 pb-24">
        
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 md:left-20 animate-pulse opacity-20 hidden md:block">
          <MessageCircle className="w-24 h-24 text-[var(--cx-primary)]" />
        </div>
        <div className="absolute bottom-40 right-10 md:right-20 animate-pulse opacity-20 hidden md:block" style={{ animationDelay: '1s' }}>
          <Ghost className="w-32 h-32 text-[var(--cx-ghost-start)]" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--cx-bg-surface)] border border-[var(--cx-text-muted)]/20 shadow-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[12px] font-bold text-[var(--cx-text-main)] uppercase tracking-widest">Only for verified students</span>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-extrabold text-[var(--cx-text-main)] max-w-4xl tracking-tight leading-[1.1] mb-6">
          Your Campus.<br />
          <span className="text-[var(--cx-primary)]">Your Voice.</span><br />
          Your Circle.
        </h2>
        
        <p className="text-lg md:text-xl text-[var(--cx-text-muted)] font-medium max-w-2xl mb-12 leading-relaxed">
          A student community where you can discover your campus, speak freely, build real connections, and find your people.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md mx-auto">
          <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-[var(--cx-primary)] text-white font-bold rounded-[16px] text-lg hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 hover:-translate-y-1">
            Join CampusX <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Floating Feature Cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left">
          
          <div className="bg-[var(--cx-bg-surface)] p-8 rounded-[24px] shadow-sm border border-[var(--cx-text-muted)]/10">
            <div className="w-12 h-12 bg-blue-50 rounded-[14px] flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-[18px] font-bold text-[var(--cx-text-main)] mb-2">Hyper-Local Discovery</h3>
            <p className="text-[14px] text-[var(--cx-text-muted)] font-medium leading-relaxed">
              Find the best events, trending discussions, and hidden study spots on your exact campus.
            </p>
          </div>

          <div className="bg-[var(--cx-text-main)] p-8 rounded-[24px] shadow-lg transform md:-translate-y-4">
            <div className="w-12 h-12 bg-zinc-800 rounded-[14px] flex items-center justify-center mb-6">
              <Ghost className="w-6 h-6 text-[var(--cx-ghost-start)]" />
            </div>
            <h3 className="text-[18px] font-bold text-white mb-2">Ghost Mode</h3>
            <p className="text-[14px] text-zinc-400 font-medium leading-relaxed">
              Post anonymously and securely. Share your real thoughts, confessions, and honest reviews.
            </p>
          </div>

          <div className="bg-[var(--cx-bg-surface)] p-8 rounded-[24px] shadow-sm border border-[var(--cx-text-muted)]/10">
            <div className="w-12 h-12 bg-green-50 rounded-[14px] flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-[18px] font-bold text-[var(--cx-text-main)] mb-2">Verified Real Identity</h3>
            <p className="text-[14px] text-[var(--cx-text-muted)] font-medium leading-relaxed">
              No bots. Every user is verified with their official university .edu email address.
            </p>
          </div>

        </div>
      </main>
      
    </div>
  );
};

export default Landing;
