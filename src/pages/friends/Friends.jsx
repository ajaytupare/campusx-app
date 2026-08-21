import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGhost } from '../../context/GhostContext';
import { Search, Users, UserPlus, UserCheck, GraduationCap, Ghost } from 'lucide-react';

const MOCK_USERS = [
  { id: 'u1', name: 'Sarah Connor', college: 'Stanford University', major: 'Computer Science', year: 'Junior' },
  { id: 'u2', name: 'John Doe', college: 'MIT', major: 'Physics', year: 'Senior' },
  { id: 'u3', name: 'Emily Chen', college: 'University of Michigan', major: 'Business', year: 'Sophomore' },
  { id: 'u4', name: 'Marcus Johnson', college: 'Stanford University', major: 'Mechanical Engineering', year: 'Freshman' },
  { id: 'u5', name: 'Jessica Davis', college: 'NYU', major: 'Art History', year: 'Junior' },
  { id: 'u6', name: 'David Kim', college: 'UC Berkeley', major: 'Economics', year: 'Senior' },
];

const Friends = () => {
  const { currentUser } = useAuth();
  const { isGhostMode } = useGhost();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [connections, setConnections] = useState({});

  useEffect(() => {
    let storedUsers = JSON.parse(localStorage.getItem('cx_mock_users_directory') || '[]');
    if (storedUsers.length === 0) {
      storedUsers = MOCK_USERS;
      localStorage.setItem('cx_mock_users_directory', JSON.stringify(storedUsers));
    }
    setUsers(storedUsers);

    const storedConns = JSON.parse(localStorage.getItem('cx_mock_connections') || '{}');
    setConnections(storedConns);
  }, []);

  const handleConnect = (userId) => {
    const newConns = { ...connections, [userId]: 'pending' };
    setConnections(newConns);
    localStorage.setItem('cx_mock_connections', JSON.stringify(newConns));
  };

  const filteredUsers = users.filter(u => 
    u.id !== currentUser?.uid && // Don't show self (though mock users might not match current uid anyway)
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
     u.major.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // GHOST RESTRICTION UI
  if (isGhostMode) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-100px)] max-w-2xl mx-auto text-center px-4">
        <div className="w-24 h-24 bg-[var(--cx-ghost-start)]/10 rounded-[32px] flex items-center justify-center mb-6">
          <Ghost className="w-12 h-12 text-[var(--cx-ghost-start)]" />
        </div>
        <h1 className="text-3xl font-semibold text-[var(--cx-text-main)] tracking-tight mb-4">
          Ghost Mode is Active
        </h1>
        <p className="text-[var(--cx-text-muted)] text-[16px] font-medium leading-relaxed max-w-md">
          Real-identity connections are disabled while you are a ghost. You cannot search the directory or send friend requests anonymously.
          <br/><br/>
          Toggle Ghost Mode off in the sidebar to interact with other students.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full max-w-5xl mx-auto gap-6 pb-12">
      
      {/* Header & Search */}
      <div className="bg-[var(--cx-bg-surface)] rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] text-center">
        <div className="w-16 h-16 bg-[var(--cx-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[var(--cx-primary)]">
          <Users className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-semibold text-[var(--cx-text-main)] tracking-tight mb-2">Student Network</h1>
        <p className="text-[var(--cx-text-muted)] font-medium mb-8 max-w-xl mx-auto">
          Find classmates, discover project teammates, and expand your campus circle.
        </p>
        
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cx-text-muted)] w-5 h-5" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by name, college, or major..." 
            className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-xl py-4 pl-12 pr-4 text-[15px] focus:bg-[var(--cx-bg-surface)] focus:border-[var(--cx-primary)]/30 outline-none transition-all text-[var(--cx-text-main)] font-bold placeholder:text-[var(--cx-text-muted)]/60 shadow-inner"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-[var(--cx-bg-surface)] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] flex flex-col h-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-[var(--cx-bg-base)] border border-black/[0.04] flex items-center justify-center text-xl font-bold text-[var(--cx-primary)] shrink-0">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-[var(--cx-text-main)] leading-tight mb-1">
                  {user.name}
                </h3>
                <div className="text-[13px] font-bold text-[var(--cx-primary)]">
                  {user.major}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-2 text-[var(--cx-text-muted)] text-[13px] font-semibold">
                <GraduationCap className="w-4 h-4" />
                {user.college}
              </div>
              <div className="flex items-center gap-2 text-[var(--cx-text-muted)] text-[13px] font-semibold">
                <span className="w-4 h-4 flex items-center justify-center text-[10px] bg-[var(--cx-text-muted)]/20 rounded font-bold text-[var(--cx-text-main)]">Y</span>
                {user.year}
              </div>
            </div>
            
            <div className="mt-auto">
              {connections[user.id] === 'pending' ? (
                <button disabled className="w-full py-2.5 rounded-[14px] font-bold flex items-center justify-center gap-2 text-[14px] bg-[var(--cx-bg-base)] text-[var(--cx-text-muted)] border border-black/[0.04] cursor-not-allowed">
                  <UserCheck className="w-4 h-4" /> Requested
                </button>
              ) : (
                <button 
                  onClick={() => handleConnect(user.id)}
                  className="w-full py-2.5 rounded-[14px] font-bold flex items-center justify-center gap-2 text-[14px] bg-[var(--cx-primary)] text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95"
                >
                  <UserPlus className="w-4 h-4" /> Connect
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="col-span-full text-center py-12 text-[var(--cx-text-muted)] font-medium bg-[var(--cx-bg-surface)] rounded-2xl border border-black/[0.04]">
            No students found matching "{searchQuery}"
          </div>
        )}
      </div>

    </div>
  );
};

export default Friends;


