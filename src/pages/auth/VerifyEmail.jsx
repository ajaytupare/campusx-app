import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';

const VerifyEmail = () => {
  return (
    <div className="min-h-screen bg-[var(--cx-bg-base)] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[440px] bg-[var(--cx-bg-surface)] rounded-[32px] p-8 md:p-10 shadow-lg border border-[var(--cx-text-muted)]/10 text-center">
        
        <div className="w-16 h-16 bg-blue-50 rounded-[20px] flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-blue-500" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--cx-text-main)] mb-3 tracking-tight">Check your inbox</h2>
        
        <p className="text-[15px] font-medium text-[var(--cx-text-muted)] leading-relaxed mb-8">
          We've sent a verification link to your email address. Please click the link to verify your account and access CampusX.
        </p>

        <Link 
          to="/login"
          className="w-full py-4 rounded-[16px] font-bold text-[15px] bg-[var(--cx-text-main)] text-white transition-all shadow-md flex items-center justify-center gap-2 hover:bg-black hover:-translate-y-0.5"
        >
          Go to Login <ArrowRight className="w-4 h-4" />
        </Link>
        
        <p className="mt-8 text-[13px] font-medium text-[var(--cx-text-muted)]">
          Didn't receive it? Check your spam folder or <a href="#" className="font-bold text-[var(--cx-primary)] hover:underline">resend email</a>.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
