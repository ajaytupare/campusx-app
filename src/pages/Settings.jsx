import { useState } from 'react';
import { User, Shield, Bell, LogOut, ChevronRight } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Account');

  const tabs = [
    { name: 'Account', icon: User },
    { name: 'Privacy & Safety', icon: Shield },
    { name: 'Notifications', icon: Bell },
  ];

  return (
    <div className="w-full flex flex-col min-h-screen pb-12">
      
      {/* Header */}
      <div className="mb-8 pt-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Settings</h1>
        <p className="text-gray-500 font-medium">Manage your account, privacy, and preferences.</p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Sidebar Menu */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/30 shrink-0">
          <nav className="flex flex-row md:flex-col p-2 md:p-4 overflow-x-auto hide-scrollbar gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.name 
                    ? 'bg-black text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6 md:p-10">
          
          {/* ACCOUNT TAB */}
          {activeTab === 'Account' && (
            <div className="animate-in fade-in duration-200 flex flex-col h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Username</label>
                  <input 
                    type="text" 
                    defaultValue="alexchen"
                    className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue="alex.chen@university.edu"
                    disabled
                    className="w-full max-w-md bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-2">Email is linked to your university authentication.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Campus</label>
                  <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors">
                    University of Washington
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-10 border-t border-gray-100">
                <h3 className="text-sm font-bold text-red-600 mb-4 uppercase tracking-wider">Danger Zone</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl px-6 py-3 font-bold text-sm transition-all">
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-500 border border-gray-200 hover:border-red-200 rounded-xl px-6 py-3 font-bold text-sm transition-all">
                    Deactivate Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PRIVACY TAB */}
          {activeTab === 'Privacy & Safety' && (
            <div className="animate-in fade-in duration-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy & Safety</h2>
              
              <div className="space-y-6">
                
                {/* Toggle Item */}
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Private Account</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Only approved followers can see your posts and classes.</p>
                  </div>
                  <div className="w-11 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>

                {/* Toggle Item */}
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Show Location on Posts</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Tag your general campus location when posting to the feed.</p>
                  </div>
                  <div className="w-11 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'Notifications' && (
            <div className="animate-in fade-in duration-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                
                {/* Toggle Item */}
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Push Notifications</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Receive mobile push alerts for likes, replies, and mentions.</p>
                  </div>
                  <div className="w-11 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default Settings;
