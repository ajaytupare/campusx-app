import { useState, useEffect } from 'react';
import { User, Shield, Bell, Palette, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState({
    emailNotifs: true,
    pushNotifs: false,
    ghostMentions: true,
    privateProfile: false,
    allowMessagesFrom: 'everyone',
    darkMode: false,
    colorAccent: 'indigo'
  });

  useEffect(() => {
    const storedSettings = localStorage.getItem('cx_settings');
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      setSettings(parsed);
      
      if (parsed.darkMode) {
        document.documentElement.classList.add('dark-theme');
      }
    }
  }, []);

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem('cx_settings', JSON.stringify(newSettings));
    
    // Quick UI mock for dark mode
    if (key === 'darkMode') {
      if (newSettings.darkMode) {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
    }
  };

  const handleSelect = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('cx_settings', JSON.stringify(newSettings));
  };

  const tabs = [
    { id: 'account', label: 'My Account', icon: User },
    { id: 'privacy', label: 'Privacy & Safety', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="flex flex-col lg:flex-row w-full h-full max-w-5xl mx-auto gap-8 pb-12">
      
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold text-[var(--cx-text-main)] mb-6 tracking-tight">Settings</h1>
        
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-[16px] font-bold text-[14px] transition-all w-full text-left
              ${activeTab === tab.id 
                ? 'bg-[var(--cx-bg-surface)] text-[var(--cx-primary)] shadow-sm border border-[var(--cx-text-muted)]/10' 
                : 'text-[var(--cx-text-muted)] hover:bg-[var(--cx-bg-surface)] hover:text-[var(--cx-text-main)] border border-transparent'}`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}

        <div className="mt-8 border-t border-[var(--cx-text-muted)]/10 pt-4">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3.5 rounded-[16px] font-bold text-[14px] text-red-500 hover:bg-red-500/10 transition-colors w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 bg-[var(--cx-bg-surface)] rounded-[32px] p-8 shadow-sm border border-[var(--cx-text-muted)]/10">
        
        {activeTab === 'account' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-extrabold text-[var(--cx-text-main)] mb-6">My Account</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[var(--cx-bg-base)] rounded-[20px] border border-[var(--cx-text-muted)]/5 cursor-pointer hover:border-[var(--cx-text-muted)]/20 transition-colors">
                <div>
                  <h4 className="font-bold text-[15px] text-[var(--cx-text-main)]">Email Address</h4>
                  <p className="text-[13px] font-medium text-[var(--cx-text-muted)]">{currentUser?.email || 'user@campus.edu'}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--cx-text-muted)]" />
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--cx-bg-base)] rounded-[20px] border border-[var(--cx-text-muted)]/5 cursor-pointer hover:border-[var(--cx-text-muted)]/20 transition-colors">
                <div>
                  <h4 className="font-bold text-[15px] text-[var(--cx-text-main)]">Change Password</h4>
                  <p className="text-[13px] font-medium text-[var(--cx-text-muted)]">Update your login credentials</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--cx-text-muted)]" />
              </div>

              <div className="pt-6 border-t border-[var(--cx-text-muted)]/10">
                <button className="text-red-500 font-bold text-[14px] hover:underline">Delete Account</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-extrabold text-[var(--cx-text-main)] mb-6">Privacy & Safety</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[var(--cx-bg-base)] rounded-[20px] border border-[var(--cx-text-muted)]/5">
                <div>
                  <h4 className="font-bold text-[15px] text-[var(--cx-text-main)]">Private Profile</h4>
                  <p className="text-[13px] font-medium text-[var(--cx-text-muted)] max-w-sm mt-1">Only your friends will be able to see your full profile, posts, and details.</p>
                </div>
                <button 
                  onClick={() => handleToggle('privateProfile')}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${settings.privateProfile ? 'bg-[var(--cx-primary)]' : 'bg-zinc-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${settings.privateProfile ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="p-4 bg-[var(--cx-bg-base)] rounded-[20px] border border-[var(--cx-text-muted)]/5">
                <h4 className="font-bold text-[15px] text-[var(--cx-text-main)] mb-1">Direct Messages</h4>
                <p className="text-[13px] font-medium text-[var(--cx-text-muted)] mb-4">Who is allowed to send you direct messages?</p>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleSelect('allowMessagesFrom', 'everyone')}
                    className={`flex-1 py-2.5 rounded-[12px] font-bold text-[13px] transition-colors border ${settings.allowMessagesFrom === 'everyone' ? 'bg-[var(--cx-bg-surface)] border-[var(--cx-primary)] text-[var(--cx-primary)]' : 'border-transparent hover:bg-zinc-200 text-[var(--cx-text-main)]'}`}
                  >
                    Everyone
                  </button>
                  <button 
                    onClick={() => handleSelect('allowMessagesFrom', 'friends')}
                    className={`flex-1 py-2.5 rounded-[12px] font-bold text-[13px] transition-colors border ${settings.allowMessagesFrom === 'friends' ? 'bg-[var(--cx-bg-surface)] border-[var(--cx-primary)] text-[var(--cx-primary)]' : 'border-transparent hover:bg-zinc-200 text-[var(--cx-text-main)]'}`}
                  >
                    Friends Only
                  </button>
                  <button 
                    onClick={() => handleSelect('allowMessagesFrom', 'nobody')}
                    className={`flex-1 py-2.5 rounded-[12px] font-bold text-[13px] transition-colors border ${settings.allowMessagesFrom === 'nobody' ? 'bg-[var(--cx-bg-surface)] border-[var(--cx-primary)] text-[var(--cx-primary)]' : 'border-transparent hover:bg-zinc-200 text-[var(--cx-text-main)]'}`}
                  >
                    Nobody
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-extrabold text-[var(--cx-text-main)] mb-6">Notifications</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[var(--cx-bg-base)] rounded-[20px] border border-[var(--cx-text-muted)]/5">
                <div>
                  <h4 className="font-bold text-[15px] text-[var(--cx-text-main)]">Email Notifications</h4>
                  <p className="text-[13px] font-medium text-[var(--cx-text-muted)] mt-1">Receive daily digests and major announcements.</p>
                </div>
                <button 
                  onClick={() => handleToggle('emailNotifs')}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${settings.emailNotifs ? 'bg-[var(--cx-primary)]' : 'bg-zinc-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${settings.emailNotifs ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--cx-bg-base)] rounded-[20px] border border-[var(--cx-text-muted)]/5">
                <div>
                  <h4 className="font-bold text-[15px] text-[var(--cx-text-main)]">Push Notifications</h4>
                  <p className="text-[13px] font-medium text-[var(--cx-text-muted)] mt-1">Get instantly alerted for direct messages and event reminders.</p>
                </div>
                <button 
                  onClick={() => handleToggle('pushNotifs')}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${settings.pushNotifs ? 'bg-[var(--cx-primary)]' : 'bg-zinc-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${settings.pushNotifs ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--cx-ghost-start)]/10 rounded-[20px] border border-[var(--cx-ghost-start)]/20">
                <div>
                  <h4 className="font-bold text-[15px] text-[var(--cx-text-main)]">Ghost Mode Mentions</h4>
                  <p className="text-[13px] font-medium text-[var(--cx-text-muted)] mt-1 max-w-sm">Allow push notifications if someone replies to your anonymous Ghost post.</p>
                </div>
                <button 
                  onClick={() => handleToggle('ghostMentions')}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${settings.ghostMentions ? 'bg-[var(--cx-ghost-start)]' : 'bg-[var(--cx-ghost-start)]/30'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${settings.ghostMentions ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-extrabold text-[var(--cx-text-main)] mb-6">Appearance</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[var(--cx-bg-base)] rounded-[20px] border border-[var(--cx-text-muted)]/5">
                <div>
                  <h4 className="font-bold text-[15px] text-[var(--cx-text-main)]">Dark Mode</h4>
                  <p className="text-[13px] font-medium text-[var(--cx-text-muted)] mt-1">Easier on the eyes in low light.</p>
                </div>
                <button 
                  onClick={() => handleToggle('darkMode')}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${settings.darkMode ? 'bg-zinc-800' : 'bg-zinc-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default Settings;
