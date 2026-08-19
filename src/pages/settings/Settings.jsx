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
      <div className="flex-1 min-w-0 bg-[var(--cx-bg-surface)] rounded-[24px] shadow-sm border border-[var(--cx-text-muted)]/10 overflow-hidden">
        
        {activeTab === 'account' && (
          <div className="animate-in fade-in duration-300">
            <div className="p-8 border-b border-[var(--cx-text-muted)]/10">
              <h2 className="text-2xl font-extrabold text-[var(--cx-text-main)]">Account</h2>
            </div>
            
            <div className="p-8 space-y-8">
              
              {/* Profile Picture Section */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-24 h-24 rounded-full border-2 border-[var(--cx-text-muted)]/10 overflow-hidden bg-[var(--cx-bg-base)] shrink-0">
                  {editAvatar ? (
                    <img src={editAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--cx-text-muted)]">No Img</div>
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-[16px] text-[var(--cx-text-main)] mb-3">Profile Picture</h4>
                  <div className="flex gap-3 mb-2">
                    <label className="cursor-pointer bg-[var(--cx-primary)] hover:bg-indigo-700 transition-colors text-white px-4 py-2 rounded-[12px] font-bold text-[14px] flex items-center gap-2 shadow-sm shadow-indigo-500/20">
                      <Upload className="w-4 h-4" /> Upload Image
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setEditAvatar)} />
                    </label>
                    <button 
                      onClick={() => setEditAvatar(null)}
                      className="px-4 py-2 bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/20 rounded-[12px] font-bold text-[14px] text-[var(--cx-text-main)] hover:bg-zinc-200 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-[12px] font-medium text-[var(--cx-text-muted)]">We support PNGs, JPEGs and GIFs under 10MB</p>
                </div>
              </div>

              {/* Cover Picture Section */}
              <div className="flex flex-col sm:flex-row gap-6 items-start pt-6 border-t border-[var(--cx-text-muted)]/5">
                <div className="w-48 h-24 rounded-[12px] border-2 border-[var(--cx-text-muted)]/10 overflow-hidden bg-[var(--cx-bg-base)] shrink-0">
                  {editCover ? (
                    <img src={editCover} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--cx-text-muted)]">No Cover</div>
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-[16px] text-[var(--cx-text-main)] mb-3">Cover Photo</h4>
                  <div className="flex gap-3 mb-2">
                    <label className="cursor-pointer bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/20 hover:bg-zinc-200 transition-colors text-[var(--cx-text-main)] px-4 py-2 rounded-[12px] font-bold text-[14px] flex items-center gap-2">
                      <Upload className="w-4 h-4" /> Change Cover
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setEditCover)} />
                    </label>
                  </div>
                  <p className="text-[12px] font-medium text-[var(--cx-text-muted)]">Recommended resolution is 1200x480</p>
                </div>
              </div>

              {/* Inputs Grid */}
              <div className="pt-6 border-t border-[var(--cx-text-muted)]/5 space-y-6">
                
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <label className="block text-[13px] font-extrabold text-[var(--cx-text-main)] mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/10 rounded-[12px] px-4 py-2.5 text-[14px] font-medium text-[var(--cx-text-main)] outline-none focus:border-[var(--cx-primary)]/50 transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[13px] font-extrabold text-[var(--cx-text-main)] mb-2">Email</label>
                    <div className="flex gap-2">
                      <input 
                        type="email" 
                        disabled
                        value={currentUser?.email || ''}
                        className="w-full bg-[var(--cx-bg-base)]/50 border border-[var(--cx-text-muted)]/10 rounded-[12px] px-4 py-2.5 text-[14px] font-medium text-[var(--cx-text-muted)] outline-none cursor-not-allowed"
                      />
                      <button className="shrink-0 px-4 py-2 bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/20 rounded-[12px] font-bold text-[13px] text-[var(--cx-text-main)] hover:bg-zinc-200 transition-colors">
                        Edit Email
                      </button>
                    </div>
                    <p className="text-[11px] text-[var(--cx-text-muted)] mt-1.5 font-medium">Used to log in to your account</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-extrabold text-[var(--cx-text-main)] mb-2">Bio</label>
                  <textarea 
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    className="w-full bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/10 rounded-[12px] px-4 py-3 text-[14px] font-medium text-[var(--cx-text-main)] outline-none focus:border-[var(--cx-primary)]/50 transition-colors min-h-[100px] resize-y"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <label className="block text-[13px] font-extrabold text-[var(--cx-text-main)] mb-2">College</label>
                    <input 
                      type="text" 
                      value={editCollege}
                      onChange={e => setEditCollege(e.target.value)}
                      className="w-full bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/10 rounded-[12px] px-4 py-2.5 text-[14px] font-medium text-[var(--cx-text-main)] outline-none focus:border-[var(--cx-primary)]/50 transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[13px] font-extrabold text-[var(--cx-text-main)] mb-2">Department / Major</label>
                    <input 
                      type="text" 
                      value={editDepartment}
                      onChange={e => setEditDepartment(e.target.value)}
                      className="w-full bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/10 rounded-[12px] px-4 py-2.5 text-[14px] font-medium text-[var(--cx-text-main)] outline-none focus:border-[var(--cx-primary)]/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <label className="block text-[13px] font-extrabold text-[var(--cx-text-main)] mb-2">Year</label>
                    <input 
                      type="text" 
                      value={editYear}
                      onChange={e => setEditYear(e.target.value)}
                      className="w-full bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/10 rounded-[12px] px-4 py-2.5 text-[14px] font-medium text-[var(--cx-text-main)] outline-none focus:border-[var(--cx-primary)]/50 transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[13px] font-extrabold text-[var(--cx-text-main)] mb-2">Semester</label>
                    <input 
                      type="text" 
                      value={editSemester}
                      onChange={e => setEditSemester(e.target.value)}
                      className="w-full bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/10 rounded-[12px] px-4 py-2.5 text-[14px] font-medium text-[var(--cx-text-main)] outline-none focus:border-[var(--cx-primary)]/50 transition-colors"
                    />
                  </div>
                </div>

              </div>

              {/* Password Section from reference image */}
              <div className="pt-8 mt-8 border-t border-[var(--cx-text-muted)]/10 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-[16px] text-[var(--cx-text-main)]">Password</h4>
                  <p className="text-[12px] font-medium text-[var(--cx-text-muted)] mt-1">Log in with your password instead of using temporary login codes</p>
                </div>
                <button className="px-4 py-2 bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/20 rounded-[12px] font-bold text-[14px] text-[var(--cx-text-main)] hover:bg-zinc-200 transition-colors">
                  Change Password
                </button>
              </div>

            </div>

            {/* Bottom Save Bar */}
            <div className="p-6 border-t border-[var(--cx-text-muted)]/10 bg-[var(--cx-bg-surface)] flex justify-end gap-3">
              <button 
                onClick={() => window.history.back()}
                className="px-6 py-2.5 bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/20 rounded-[12px] font-bold text-[14px] text-[var(--cx-text-main)] hover:bg-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className={`px-8 py-2.5 rounded-[12px] font-bold text-[14px] text-white transition-colors shadow-sm
                  ${isSaving ? 'bg-[var(--cx-primary)]/50 cursor-not-allowed' : 'bg-[var(--cx-primary)] hover:bg-indigo-700 shadow-indigo-500/20'}`}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
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
