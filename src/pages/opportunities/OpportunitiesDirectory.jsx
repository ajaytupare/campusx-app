import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, MapPin, Building2, Plus, DollarSign, Clock } from 'lucide-react';

const MOCK_OPPORTUNITIES = [
  { id: 'opp_1', title: 'Software Engineering Intern', company: 'TechNova', location: 'San Francisco, CA (Remote Option)', type: 'Internship', pay: '$45/hr', description: 'Join our core infrastructure team for the summer.' },
  { id: 'opp_2', title: 'Research Assistant - NLP lab', company: 'Computer Science Dept', location: 'Campus Building A, Room 402', type: 'Research', pay: 'For Credit / $18/hr', description: 'Looking for undergrads interested in Large Language Models.' },
  { id: 'opp_3', title: 'Campus Ambassador', company: 'EnergyDrink Co.', location: 'On Campus', type: 'Part-time', pay: '$20/hr + Merch', description: 'Promote our brand at campus events and greek life parties.' },
];

const OpportunitiesDirectory = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOppTitle, setNewOppTitle] = useState('');
  const [newOppCompany, setNewOppCompany] = useState('');
  const [newOppType, setNewOppType] = useState('Internship');
  const [newOppLocation, setNewOppLocation] = useState('');
  const [newOppPay, setNewOppPay] = useState('');
  const [newOppDesc, setNewOppDesc] = useState('');

  useEffect(() => {
    let stored = JSON.parse(localStorage.getItem('cx_mock_opportunities') || '[]');
    if (stored.length === 0) {
      stored = MOCK_OPPORTUNITIES;
      localStorage.setItem('cx_mock_opportunities', JSON.stringify(stored));
    }
    setOpportunities(stored);
  }, []);

  const handlePostOpportunity = (e) => {
    e.preventDefault();
    if (!newOppTitle.trim() || !newOppCompany.trim()) return;

    const newOpp = {
      id: 'opp_' + Date.now(),
      title: newOppTitle.trim(),
      company: newOppCompany.trim(),
      type: newOppType,
      location: newOppLocation.trim(),
      pay: newOppPay.trim(),
      description: newOppDesc.trim(),
    };

    const updated = [newOpp, ...opportunities];
    setOpportunities(updated);
    localStorage.setItem('cx_mock_opportunities', JSON.stringify(updated));

    setIsModalOpen(false);
    setNewOppTitle('');
    setNewOppCompany('');
    setNewOppType('Internship');
    setNewOppLocation('');
    setNewOppPay('');
    setNewOppDesc('');
  };

  const filteredOpportunities = opportunities.filter(o => 
    o.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full max-w-5xl mx-auto gap-6 pb-12">
      
      {/* Header & Search */}
      <div className="bg-[var(--cx-bg-surface)] rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] text-center">
        <div className="w-16 h-16 bg-[var(--cx-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[var(--cx-primary)]">
          <Briefcase className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-semibold text-[var(--cx-text-main)] tracking-tight mb-2">Opportunities</h1>
        <p className="text-[var(--cx-text-muted)] font-medium mb-8 max-w-xl mx-auto">
          Find internships, research positions, and part-time jobs tailored for students.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cx-text-muted)] w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles, companies..." 
              className="w-full bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/20 rounded-xl py-3.5 pl-12 pr-4 text-[15px] outline-none text-[var(--cx-text-main)] font-bold placeholder:text-[var(--cx-text-muted)]/60"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-[15px] bg-[var(--cx-primary)] text-white hover:bg-indigo-700 transition-all shrink-0"
            style={{ backgroundColor: 'var(--cx-primary)', color: 'white' }}
          >
            <Plus className="w-5 h-5" /> Post Role
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOpportunities.map(opp => (
          <Link 
            key={opp.id} 
            to={`/opportunities/${opp.id}`}
            className="bg-[var(--cx-bg-surface)] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] hover:shadow-md hover:border-[var(--cx-primary)]/30 transition-all group flex flex-col sm:flex-row gap-6 items-start"
          >
            <div className="w-16 h-16 rounded-xl bg-[var(--cx-bg-base)] border border-black/[0.04] flex items-center justify-center text-2xl font-bold text-[var(--cx-primary)] shrink-0 group-hover:bg-[var(--cx-primary)] group-hover:text-white transition-colors">
              {opp.company.charAt(0)}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                <h3 className="text-[18px] font-semibold text-[var(--cx-text-main)] leading-tight group-hover:text-[var(--cx-primary)] transition-colors">
                  {opp.title}
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--cx-primary)]/10 text-[var(--cx-primary)] text-[12px] font-bold uppercase tracking-wide whitespace-nowrap w-fit">
                  {opp.type}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-[15px] font-bold text-[var(--cx-text-main)] mb-3">
                <Building2 className="w-4 h-4 text-[var(--cx-text-muted)]" />
                {opp.company}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[13px] font-semibold text-[var(--cx-text-muted)]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {opp.location || 'Remote'}
                </div>
                {opp.pay && (
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    {opp.pay}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12 text-[var(--cx-text-muted)] font-medium bg-[var(--cx-bg-surface)] rounded-2xl border border-black/[0.04]">
            No opportunities found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[var(--cx-bg-surface)] w-full max-w-xl rounded-[32px] p-8 shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200 my-8">
            <h2 className="text-2xl font-semibold text-[var(--cx-text-main)] tracking-tight mb-2">Post an Opportunity</h2>
            <p className="text-[14px] text-[var(--cx-text-muted)] font-medium mb-6">Share a role with the campus community.</p>
            
            <form onSubmit={handlePostOpportunity} className="flex flex-col gap-4">
              <div>
                <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Job Title</label>
                <input 
                  type="text" 
                  required
                  value={newOppTitle}
                  onChange={e => setNewOppTitle(e.target.value)}
                  placeholder="e.g. Marketing Intern"
                  className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-xl px-4 py-3 text-[15px] outline-none transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
                />
              </div>

              <div className="flex gap-4 flex-col sm:flex-row">
                <div className="flex-1">
                  <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Company / Org</label>
                  <input 
                    type="text" 
                    required
                    value={newOppCompany}
                    onChange={e => setNewOppCompany(e.target.value)}
                    placeholder="e.g. TechCorp"
                    className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-xl px-4 py-3 text-[15px] outline-none transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Type</label>
                  <select
                    value={newOppType}
                    onChange={e => setNewOppType(e.target.value)}
                    className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-xl px-4 py-3 text-[15px] outline-none transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium appearance-none"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Research">Research</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 flex-col sm:flex-row">
                <div className="flex-1">
                  <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Location</label>
                  <input 
                    type="text" 
                    value={newOppLocation}
                    onChange={e => setNewOppLocation(e.target.value)}
                    placeholder="e.g. Remote, Campus Library"
                    className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-xl px-4 py-3 text-[15px] outline-none transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Pay (Optional)</label>
                  <input 
                    type="text" 
                    value={newOppPay}
                    onChange={e => setNewOppPay(e.target.value)}
                    placeholder="e.g. $20/hr, Unpaid"
                    className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-xl px-4 py-3 text-[15px] outline-none transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Description</label>
                <textarea 
                  required
                  value={newOppDesc}
                  onChange={e => setNewOppDesc(e.target.value)}
                  placeholder="Describe the role and requirements..."
                  className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-xl px-4 py-3 text-[15px] outline-none resize-none min-h-[100px] transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
                />
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-[14px] bg-[var(--cx-bg-base)] text-[var(--cx-text-main)] hover:bg-black/[0.06] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newOppTitle.trim() || !newOppCompany.trim()}
                  className="flex-1 py-3.5 rounded-xl font-bold text-[14px] bg-[var(--cx-primary)] text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default OpportunitiesDirectory;


