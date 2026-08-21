import { useState, useEffect } from 'react';
import { User, Shield, Bell, Palette, LogOut, ChevronRight, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

const Settings = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    emailNotifs: true,
    pushNotifs: false,
    ghostMentions: true,
    privateProfile: false,
    allowMessagesFrom: 'everyone',
    darkMode: false,
    colorAccent: 'indigo'
  });

  // Profile Edit State
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editCollege, setEditCollege] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editSemester, setEditSemester] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editAvatar, setEditAvatar] = useState(null);
  const [editCover, setEditCover] = useState(null);

  useEffect(() => {
    // Load Settings
    const storedSettings = localStorage.getItem('cx_settings');
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      setSettings(parsed);
      if (parsed.darkMode) {
        document.documentElement.classList.add('dark-theme');
      }
    }
  }, []);

  useEffect(() => {
    // Load Profile Data
    if (userProfile) {
      setEditName(userProfile.name || '');
      setEditBio(userProfile.bio || '');
      setEditCollege(userProfile.college || '');
      setEditDepartment(userProfile.department || userProfile.major || '');
      setEditYear(userProfile.year || '');
      setEditSemester(userProfile.semester || '');
      setEditLocation(userProfile.location || '');
      setEditAvatar(userProfile.avatar || null);
      setEditCover(userProfile.cover || null);
    }
  }, [userProfile]);

  const handleFileUpload = (e, setFileState) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_DIMENSION = 800;
          if (width > height && width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          } else if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          setFileState(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser?.uid) return;
    setIsSaving(true);
    
    const sanitize = (val) => val === undefined ? null : val;
    let updatedProfile = {
      ...userProfile,
      name: sanitize(editName),
      avatar: sanitize(editAvatar),
      cover: sanitize(editCover),
      department: sanitize(editDepartment),
      major: sanitize(editDepartment), // keep backwards compatible
      college: sanitize(editCollege),
      semester: sanitize(editSemester),
      year: sanitize(editYear),
      bio: sanitize(editBio),
      location: sanitize(editLocation)
    };
    
    Object.keys(updatedProfile).forEach(key => {
      if (updatedProfile[key] === undefined) {
        updatedProfile[key] = null;
      }
    });

    try {
      localStorage.setItem('cx_current_user_profile', JSON.stringify(updatedProfile));
      window.dispatchEvent(new Event('storage'));
      await setDoc(doc(db, 'users', currentUser.uid), updatedProfile, { merge: true });
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem('cx_settings', JSON.stringify(newSettings));
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
    <div className="flex flex-col lg:flex-row w-full min-h-[80vh] max-w-[1100px] mx-auto bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/5 overflow-hidden mb-12">
      
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-[280px] shrink-0 bg-[var(--cx-bg-base)]/50 flex flex-col p-6 border-b lg:border-b-0 lg:border-r border-black/5 gap-2">
        <h1 className="text-[28px] font-bold text-[var(--cx-text-main)] mb-6 tracking-tight px-2">Settings</h1>
        
        <div className="flex lg:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-[14px] transition-all whitespace-nowrap lg:w-full text-left
                ${activeTab === tab.id 
                  ? 'bg-white text-[var(--cx-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/5/60' 
                  : 'text-[var(--cx-text-muted)] hover:bg-[var(--cx-bg-base)] hover:text-[var(--cx-text-main)] border border-transparent'}`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[var(--cx-primary)]' : 'text-[var(--cx-text-muted)]'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="hidden lg:block mt-auto pt-6">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-[14px] text-red-600 hover:bg-red-50 transition-colors w-full text-left"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 bg-white flex flex-col">
        
        {activeTab === 'account' && (
          <div className="animate-in fade-in duration-300 flex flex-col h-full">
            <div className="px-8 py-8 border-b border-zinc-100">
              <h2 className="text-2xl font-semibold text-[var(--cx-text-main)]">Account Settings</h2>
              <p className="text-[14px] font-medium text-[var(--cx-text-muted)] mt-1">Manage your public profile and personal details.</p>
            </div>
            
            <div className="p-8 space-y-10 overflow-y-auto">
              
              {/* Profile & Cover Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Avatar */}
                <div className="flex flex-col gap-4">
                  <h4 className="font-semibold text-[15px] text-[var(--cx-text-main)]">Profile Picture</h4>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full border-4 border-zinc-50 overflow-hidden bg-[var(--cx-bg-base)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] shrink-0">
                      {editAvatar ? (
                        <img src={editAvatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--cx-text-muted)]">
                          <User className="w-8 h-8 opacity-50" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <label className="cursor-pointer bg-[var(--cx-text-main)] hover:bg-[var(--cx-text-main)]/90 transition-colors text-white px-4 py-2 rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                          <Upload className="w-4 h-4" /> Upload
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setEditAvatar)} />
                        </label>
                        <button 
                          onClick={() => setEditAvatar(null)}
                          className="px-4 py-2 bg-white border border-black/5 rounded-lg font-bold text-[13px] text-[var(--cx-text-muted)] hover:bg-[var(--cx-bg-base)] hover:text-[var(--cx-text-main)] transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-[12px] font-medium text-[var(--cx-text-muted)]">JPG, GIF or PNG. Max 5MB.</p>
                    </div>
                  </div>
                </div>

                {/* Cover Photo */}
                <div className="flex flex-col gap-4">
                  <h4 className="font-semibold text-[15px] text-[var(--cx-text-main)]">Cover Photo</h4>
                  <div className="w-full h-32 rounded-xl border-2 border-zinc-100 overflow-hidden bg-[var(--cx-bg-base)] shrink-0 relative group">
                    {editCover ? (
                      <img src={editCover} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[var(--cx-text-muted)] gap-2">
                        <Palette className="w-6 h-6 opacity-30" />
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                      <span className="bg-white text-[var(--cx-text-main)] px-4 py-2 rounded-lg font-bold text-[13px] flex items-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <Upload className="w-4 h-4" /> Change Cover
                      </span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setEditCover)} />
                    </label>
                  </div>
                </div>
              </div>

              <hr className="border-zinc-100" />

              {/* Form Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[var(--cx-text-main)]/80">Full Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[var(--cx-bg-base)] border border-black/5 rounded-xl px-4 py-3 text-[14px] font-medium text-[var(--cx-text-main)] outline-none focus:bg-white focus:border-[var(--cx-primary)] focus:ring-4 focus:ring-[var(--cx-primary)]/10 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[var(--cx-text-main)]/80">Email Address</label>
                  <input 
                    type="email" 
                    disabled
                    value={currentUser?.email || ''}
                    className="w-full bg-[var(--cx-bg-base)] border border-black/5 rounded-xl px-4 py-3 text-[14px] font-medium text-[var(--cx-text-muted)] outline-none cursor-not-allowed opacity-70"
                  />
                  <p className="text-[12px] font-medium text-[var(--cx-text-muted)]">Your email cannot be changed here.</p>
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[13px] font-semibold text-[var(--cx-text-main)]/80">Bio</label>
                  <textarea 
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    placeholder="Write a short intro about yourself..."
                    className="w-full bg-[var(--cx-bg-base)] border border-black/5 rounded-xl px-4 py-3 text-[14px] font-medium text-[var(--cx-text-main)] outline-none focus:bg-white focus:border-[var(--cx-primary)] focus:ring-4 focus:ring-[var(--cx-primary)]/10 transition-all min-h-[100px] resize-y"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[var(--cx-text-main)]/80">College / University</label>
                  <input 
                    type="text" 
                    value={editCollege}
                    onChange={e => setEditCollege(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full bg-[var(--cx-bg-base)] border border-black/5 rounded-xl px-4 py-3 text-[14px] font-medium text-[var(--cx-text-main)] outline-none focus:bg-white focus:border-[var(--cx-primary)] focus:ring-4 focus:ring-[var(--cx-primary)]/10 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[var(--cx-text-main)]/80">Department / Major</label>
                  <input 
                    type="text" 
                    value={editDepartment}
                    onChange={e => setEditDepartment(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full bg-[var(--cx-bg-base)] border border-black/5 rounded-xl px-4 py-3 text-[14px] font-medium text-[var(--cx-text-main)] outline-none focus:bg-white focus:border-[var(--cx-primary)] focus:ring-4 focus:ring-[var(--cx-primary)]/10 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[var(--cx-text-main)]/80">Year / Batch</label>
                  <input 
                    type="text" 
                    value={editYear}
                    onChange={e => setEditYear(e.target.value)}
                    placeholder="e.g. Junior, Class of 2026"
                    className="w-full bg-[var(--cx-bg-base)] border border-black/5 rounded-xl px-4 py-3 text-[14px] font-medium text-[var(--cx-text-main)] outline-none focus:bg-white focus:border-[var(--cx-primary)] focus:ring-4 focus:ring-[var(--cx-primary)]/10 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[var(--cx-text-main)]/80">Location</label>
                  <input 
                    type="text" 
                    value={editLocation}
                    onChange={e => setEditLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full bg-[var(--cx-bg-base)] border border-black/5 rounded-xl px-4 py-3 text-[14px] font-medium text-[var(--cx-text-main)] outline-none focus:bg-white focus:border-[var(--cx-primary)] focus:ring-4 focus:ring-[var(--cx-primary)]/10 transition-all"
                  />
                </div>
              </div>

            </div>

            {/* Save Button Footer */}
            <div className="mt-auto p-6 bg-[var(--cx-bg-base)] border-t border-black/5 flex justify-end">
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className={`px-8 py-3 rounded-xl font-bold text-[14px] text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                  ${isSaving ? 'bg-[var(--cx-primary)]/60 cursor-not-allowed' : 'bg-[var(--cx-primary)] hover:bg-[var(--cx-accent)] hover:shadow-[var(--cx-primary)]/20'}`}
              >
                {isSaving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="animate-in fade-in duration-300">
            <div className="px-8 py-8 border-b border-zinc-100">
              <h2 className="text-2xl font-semibold text-[var(--cx-text-main)]">Privacy & Safety</h2>
              <p className="text-[14px] font-medium text-[var(--cx-text-muted)] mt-1">Control who can see your profile and contact you.</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between p-6 bg-[var(--cx-bg-base)] rounded-xl border border-black/5/60">
                <div>
                  <h4 className="font-semibold text-[15px] text-[var(--cx-text-main)]">Private Profile</h4>
                  <p className="text-[13px] font-medium text-[var(--cx-text-muted)] max-w-md mt-1 leading-relaxed">When your profile is private, only approved friends can see your posts and details. Your name and avatar remain visible.</p>
                </div>
                <button 
                  onClick={() => handleToggle('privateProfile')}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${settings.privateProfile ? 'bg-[var(--cx-primary)]' : 'bg-[var(--cx-text-muted)]'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${settings.privateProfile ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="p-6 bg-[var(--cx-bg-base)] rounded-xl border border-black/5/60">
                <h4 className="font-semibold text-[15px] text-[var(--cx-text-main)] mb-1">Direct Messages</h4>
                <p className="text-[13px] font-medium text-[var(--cx-text-muted)] mb-4">Who is allowed to send you direct messages?</p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => handleSelect('allowMessagesFrom', 'everyone')}
                    className={`flex-1 py-3 rounded-xl font-bold text-[13px] transition-all border ${settings.allowMessagesFrom === 'everyone' ? 'bg-white border-[var(--cx-primary)] text-[var(--cx-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]' : 'bg-white border-black/5 hover:border-black/[0.06] text-[var(--cx-text-muted)]'}`}
                  >
                    Everyone
                  </button>
                  <button 
                    onClick={() => handleSelect('allowMessagesFrom', 'friends')}
                    className={`flex-1 py-3 rounded-xl font-bold text-[13px] transition-all border ${settings.allowMessagesFrom === 'friends' ? 'bg-white border-[var(--cx-primary)] text-[var(--cx-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]' : 'bg-white border-black/5 hover:border-black/[0.06] text-[var(--cx-text-muted)]'}`}
                  >
                    Friends Only
                  </button>
                  <button 
                    onClick={() => handleSelect('allowMessagesFrom', 'nobody')}
                    className={`flex-1 py-3 rounded-xl font-bold text-[13px] transition-all border ${settings.allowMessagesFrom === 'nobody' ? 'bg-white border-[var(--cx-primary)] text-[var(--cx-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]' : 'bg-white border-black/5 hover:border-black/[0.06] text-[var(--cx-text-muted)]'}`}
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
            <div className="px-8 py-8 border-b border-zinc-100">
              <h2 className="text-2xl font-semibold text-[var(--cx-text-main)]">Notifications</h2>
              <p className="text-[14px] font-medium text-[var(--cx-text-muted)] mt-1">Manage how and when CampusX contacts you.</p>
            </div>
            
            <div className="p-8 space-y-4">
              <div className="flex items-center justify-between p-6 bg-[var(--cx-bg-base)] rounded-xl border border-black/5/60">
                <div>
                  <h4 className="font-semibold text-[15px] text-[var(--cx-text-main)]">Email Notifications</h4>
                  <p className="text-[13px] font-medium text-[var(--cx-text-muted)] mt-1">Receive daily digests and major announcements.</p>
                </div>
                <button 
                  onClick={() => handleToggle('emailNotifs')}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${settings.emailNotifs ? 'bg-[var(--cx-primary)]' : 'bg-[var(--cx-text-muted)]'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${settings.emailNotifs ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-6 bg-[var(--cx-bg-base)] rounded-xl border border-black/5/60">
                <div>
                  <h4 className="font-semibold text-[15px] text-[var(--cx-text-main)]">Push Notifications</h4>
                  <p className="text-[13px] font-medium text-[var(--cx-text-muted)] mt-1">Get instantly alerted for direct messages and event reminders.</p>
                </div>
                <button 
                  onClick={() => handleToggle('pushNotifs')}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${settings.pushNotifs ? 'bg-[var(--cx-primary)]' : 'bg-[var(--cx-text-muted)]'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${settings.pushNotifs ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-6 bg-[var(--cx-primary)]/[0.06]/50 rounded-xl border border-[var(--cx-primary)]/10">
                <div>
                  <h4 className="font-semibold text-[15px] text-[var(--cx-text-main)]">Ghost Mode Mentions</h4>
                  <p className="text-[13px] font-medium text-[var(--cx-text-muted)] mt-1 max-w-sm">Allow push notifications if someone replies to your anonymous Ghost post.</p>
                </div>
                <button 
                  onClick={() => handleToggle('ghostMentions')}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${settings.ghostMentions ? 'bg-[var(--cx-primary)]' : 'bg-[var(--cx-primary)]/40'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${settings.ghostMentions ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="animate-in fade-in duration-300">
            <div className="px-8 py-8 border-b border-zinc-100">
              <h2 className="text-2xl font-semibold text-[var(--cx-text-main)]">Appearance</h2>
              <p className="text-[14px] font-medium text-[var(--cx-text-muted)] mt-1">Customize how CampusX looks on this device.</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between p-6 bg-[var(--cx-bg-base)] rounded-xl border border-black/5/60">
                <div>
                  <h4 className="font-semibold text-[15px] text-[var(--cx-text-main)]">Dark Mode</h4>
                  <p className="text-[13px] font-medium text-[var(--cx-text-muted)] mt-1">Easier on the eyes in low light.</p>
                </div>
                <button 
                  onClick={() => handleToggle('darkMode')}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${settings.darkMode ? 'bg-[var(--cx-text-main)]/90' : 'bg-[var(--cx-text-muted)]'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
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




