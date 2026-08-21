import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGhost } from '../../context/GhostContext';
import { ArrowLeft, Briefcase, MapPin, Building2, CheckCircle2, AlertTriangle, DollarSign } from 'lucide-react';

const OpportunityProfile = () => {
  const { oppId } = useParams();
  const { currentUser } = useAuth();
  const { isGhostMode } = useGhost();
  
  const [opp, setOpp] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    // Fetch opportunity metadata
    const allOpps = JSON.parse(localStorage.getItem('cx_mock_opportunities') || '[]');
    const foundOpp = allOpps.find(o => o.id === oppId);
    setOpp(foundOpp);

    // Check application status
    if (currentUser) {
      const allApps = JSON.parse(localStorage.getItem('cx_mock_opportunity_apps') || '{}');
      const oppApps = allApps[oppId] || [];
      const applied = oppApps.some(userId => userId === currentUser.uid);
      setHasApplied(applied);
    }
  }, [oppId, currentUser]);

  const handleApply = () => {
    if (isGhostMode || hasApplied) return;

    const allApps = JSON.parse(localStorage.getItem('cx_mock_opportunity_apps') || '{}');
    const oppApps = allApps[oppId] || [];
    
    oppApps.push(currentUser.uid);
    allApps[oppId] = oppApps;
    
    localStorage.setItem('cx_mock_opportunity_apps', JSON.stringify(allApps));
    setHasApplied(true);
  };

  if (!opp) {
    return <div className="p-8 text-center text-[var(--cx-text-muted)]">Loading opportunity...</div>;
  }

  return (
    <div className="flex flex-col w-full h-full max-w-4xl mx-auto gap-6 pb-12">
      
      <Link to="/opportunities" className="inline-flex items-center gap-2 text-[var(--cx-text-muted)] hover:text-[var(--cx-text-main)] transition-colors font-bold text-[14px] w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Opportunities
      </Link>

      <div className="bg-[var(--cx-bg-surface)] rounded-[32px] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]">
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-[var(--cx-bg-base)] border border-black/[0.04] flex items-center justify-center text-2xl font-bold text-[var(--cx-primary)] shrink-0">
                {opp.company.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-[var(--cx-text-main)] tracking-tight leading-tight">
                  {opp.title}
                </h1>
                <div className="flex items-center gap-2 mt-1 text-[16px] font-bold text-[var(--cx-text-muted)]">
                  <Building2 className="w-4 h-4" />
                  {opp.company}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-xl bg-[var(--cx-bg-base)] border border-black/[0.04] text-[var(--cx-text-main)] font-bold text-[13px]">
                <Briefcase className="w-4 h-4 mr-2 text-[var(--cx-text-muted)]" />
                {opp.type}
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-xl bg-[var(--cx-bg-base)] border border-black/[0.04] text-[var(--cx-text-main)] font-bold text-[13px]">
                <MapPin className="w-4 h-4 mr-2 text-[var(--cx-text-muted)]" />
                {opp.location || 'Remote'}
              </span>
              {opp.pay && (
                <span className="inline-flex items-center px-4 py-2 rounded-xl bg-[var(--cx-bg-base)] border border-black/[0.04] text-[var(--cx-text-main)] font-bold text-[13px]">
                  <DollarSign className="w-4 h-4 mr-2 text-[var(--cx-text-muted)]" />
                  {opp.pay}
                </span>
              )}
            </div>

            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <h3 className="font-semibold text-[18px] text-[var(--cx-text-main)] mb-3">About the Role</h3>
              <p className="text-[var(--cx-text-muted)] text-[15px] font-medium leading-relaxed whitespace-pre-wrap">
                {opp.description}
              </p>
            </div>
          </div>

          <div className="lg:w-80 shrink-0">
            <div className="bg-[var(--cx-bg-base)] rounded-2xl p-6 border border-black/[0.04] sticky top-6">
              
              <h3 className="font-semibold text-[16px] text-[var(--cx-text-main)] mb-4">Ready to apply?</h3>
              <p className="text-[13px] text-[var(--cx-text-muted)] font-medium mb-6">
                Your CampusX profile and resume will be sent directly to the employer.
              </p>

              {/* APPLY ACTION - WITH GHOST RESTRICTION */}
              {isGhostMode ? (
                <div className="bg-[var(--cx-ghost-start)]/5 border border-[var(--cx-ghost-start)]/20 rounded-xl p-4 text-center">
                  <AlertTriangle className="w-6 h-6 text-[var(--cx-ghost-start)] mx-auto mb-2" />
                  <p className="text-[13px] font-bold text-[var(--cx-ghost-start)] leading-tight mb-2">
                    Application Disabled
                  </p>
                  <p className="text-[12px] text-[var(--cx-text-muted)] font-medium">
                    Employers require a verified student identity. You cannot apply for opportunities while Ghost Mode is active.
                  </p>
                </div>
              ) : hasApplied ? (
                <div className="bg-green-50 border border-green-200 dark:bg-green-900/10 dark:border-green-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                  <span className="font-bold text-[15px] text-green-700 dark:text-green-400">Application Submitted</span>
                  <span className="text-[12px] font-medium text-green-600/70 dark:text-green-400/70 mt-1">We'll notify you if they respond.</span>
                </div>
              ) : (
                <button 
                  onClick={handleApply}
                  className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-[15px] bg-[var(--cx-primary)] text-white hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all"
                >
                  Apply Now
                </button>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OpportunityProfile;


