import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, UsersRound, Plus, Hash, Globe, Lock } from 'lucide-react';

const MOCK_COMMUNITIES = [
  { id: 'com_1', name: 'CS Study Group 2026', description: 'Surviving data structures and algorithms together.', members: 342, isPrivate: false },
  { id: 'com_2', name: 'Campus Startup Founders', description: 'Building the next unicorn from our dorm rooms. Network and pitch ideas.', members: 128, isPrivate: false },
  { id: 'com_3', name: 'Late Night Gamers', description: 'Valorant, LoL, and Smash bros tournaments every weekend.', members: 890, isPrivate: false },
  { id: 'com_4', name: 'Thrifting & Fashion', description: 'Buy, sell, and trade vintage clothes on campus.', members: 550, isPrivate: false },
];

const CommunitiesDirectory = () => {
  const [communities, setCommunities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCommName, setNewCommName] = useState('');
  const [newCommDesc, setNewCommDesc] = useState('');
  const [newCommPrivate, setNewCommPrivate] = useState(false);

  useEffect(() => {
    let stored = JSON.parse(localStorage.getItem('cx_mock_communities') || '[]');
    if (stored.length === 0) {
      stored = MOCK_COMMUNITIES;
      localStorage.setItem('cx_mock_communities', JSON.stringify(stored));
    }
    setCommunities(stored);
  }, []);

  const handleCreateCommunity = (e) => {
    e.preventDefault();
    if (!newCommName.trim()) return;

    const newComm = {
      id: 'com_' + Date.now(),
      name: newCommName.trim(),
      description: newCommDesc.trim(),
      members: 1, // Just the creator
      isPrivate: newCommPrivate
    };

    const updated = [newComm, ...communities];
    setCommunities(updated);
    localStorage.setItem('cx_mock_communities', JSON.stringify(updated));

    setIsModalOpen(false);
    setNewCommName('');
    setNewCommDesc('');
    setNewCommPrivate(false);
  };

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full max-w-5xl mx-auto gap-6 pb-12">
      
      {/* Header & Search */}
      <div className="bg-[var(--cx-bg-surface)] rounded-[24px] p-8 shadow-sm border border-[var(--cx-text-muted)]/10 text-center">
        <div className="w-16 h-16 bg-[var(--cx-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[var(--cx-primary)]">
          <UsersRound className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--cx-text-main)] tracking-tight mb-2">Communities</h1>
        <p className="text-[var(--cx-text-muted)] font-medium mb-8 max-w-xl mx-auto">
          Join groups, find your niche, and connect with students who share your interests.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cx-text-muted)] w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search communities..." 
              className="w-full bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/20 rounded-[16px] py-3.5 pl-12 pr-4 text-[15px] outline-none text-[var(--cx-text-main)] font-bold placeholder:text-[var(--cx-text-muted)]/60"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-[16px] font-bold flex items-center justify-center gap-2 text-[15px] bg-[var(--cx-primary)] text-white hover:bg-indigo-700 transition-all shrink-0"
            style={{ backgroundColor: 'var(--cx-primary)', color: 'white' }}
          >
            <Plus className="w-5 h-5" /> Create Community
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCommunities.map(comm => (
          <Link 
            key={comm.id} 
            to={`/communities/${comm.id}`}
            className="bg-[var(--cx-bg-surface)] rounded-[24px] p-6 shadow-sm border border-[var(--cx-text-muted)]/10 hover:shadow-md hover:border-[var(--cx-primary)]/30 transition-all group flex flex-col h-full relative overflow-hidden"
          >
            {/* Banner strip */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--cx-primary)] to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-start justify-between mb-3 mt-1">
              <div className="w-12 h-12 rounded-[14px] bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/10 flex items-center justify-center text-xl font-black text-[var(--cx-primary)]">
                <Hash className="w-6 h-6 text-[var(--cx-primary)]/50" />
              </div>
              <div className="flex items-center gap-1.5 bg-[var(--cx-bg-base)] px-2.5 py-1 rounded-lg border border-[var(--cx-text-muted)]/10">
                {comm.isPrivate ? <Lock className="w-3.5 h-3.5 text-zinc-500" /> : <Globe className="w-3.5 h-3.5 text-zinc-500" />}
                <span className="text-[11px] font-black text-zinc-500 tracking-wider uppercase">
                  {comm.isPrivate ? 'Private' : 'Public'}
                </span>
              </div>
            </div>
            
            <h3 className="text-[18px] font-extrabold text-[var(--cx-text-main)] leading-tight mb-2 group-hover:text-[var(--cx-primary)] transition-colors">
              {comm.name}
            </h3>
            
            <p className="text-[14px] text-[var(--cx-text-muted)] font-medium leading-relaxed mb-6 line-clamp-2">
              {comm.description}
            </p>
            
            <div className="mt-auto pt-4 border-t border-[var(--cx-text-muted)]/10 flex items-center justify-between text-[13px] font-bold text-[var(--cx-text-muted)]">
              <div className="flex items-center gap-1.5">
                <UsersRound className="w-4 h-4" />
                {comm.members.toLocaleString()} Members
              </div>
            </div>
          </Link>
        ))}
        {filteredCommunities.length === 0 && (
          <div className="col-span-full text-center py-12 text-[var(--cx-text-muted)] font-medium bg-[var(--cx-bg-surface)] rounded-[24px] border border-[var(--cx-text-muted)]/10">
            No communities found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[var(--cx-bg-surface)] w-full max-w-md rounded-[32px] p-8 shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-extrabold text-[var(--cx-text-main)] tracking-tight mb-2">Create Community</h2>
            <p className="text-[14px] text-[var(--cx-text-muted)] font-medium mb-6">Build a new space for your campus.</p>
            
            <form onSubmit={handleCreateCommunity} className="flex flex-col gap-4">
              <div>
                <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Community Name</label>
                <input 
                  type="text" 
                  required
                  value={newCommName}
                  onChange={e => setNewCommName(e.target.value)}
                  placeholder="e.g. Photography Club"
                  className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[16px] px-4 py-3 text-[15px] outline-none transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
                />
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Description</label>
                <textarea 
                  required
                  value={newCommDesc}
                  onChange={e => setNewCommDesc(e.target.value)}
                  placeholder="What is this community about?"
                  className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[16px] px-4 py-3 text-[15px] outline-none resize-none min-h-[80px] transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-[var(--cx-bg-base)] rounded-[16px] border border-[var(--cx-text-muted)]/10">
                <input 
                  type="checkbox" 
                  id="privacy"
                  checked={newCommPrivate}
                  onChange={e => setNewCommPrivate(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[var(--cx-primary)] focus:ring-[var(--cx-primary)]"
                />
                <label htmlFor="privacy" className="flex flex-col cursor-pointer">
                  <span className="text-[14px] font-bold text-[var(--cx-text-main)]">Private Community</span>
                  <span className="text-[12px] text-[var(--cx-text-muted)] font-medium">Only approved members can view posts.</span>
                </label>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 rounded-[16px] font-bold text-[14px] bg-[var(--cx-bg-base)] text-[var(--cx-text-main)] hover:bg-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newCommName.trim()}
                  className="flex-1 py-3.5 rounded-[16px] font-bold text-[14px] bg-[var(--cx-primary)] text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CommunitiesDirectory;
