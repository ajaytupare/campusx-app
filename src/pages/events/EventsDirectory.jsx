import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Clock, Plus, Users } from 'lucide-react';

const MOCK_EVENTS = [
  { id: 'evt_1', title: 'Fall Tech Career Fair', description: 'Meet recruiters from top tech companies. Bring your resume!', date: '2026-09-15', time: '10:00 AM', location: 'Student Union Pavilion', rsvps: 450 },
  { id: 'evt_2', title: 'Midnight Breakfast', description: 'Free pancakes and bacon to survive finals week.', date: '2026-12-10', time: '11:59 PM', location: 'Main Dining Hall', rsvps: 820 },
  { id: 'evt_3', title: 'Intro to Machine Learning Workshop', description: 'A beginner friendly workshop hosted by the AI Club.', date: '2026-09-20', time: '5:00 PM', location: 'Computer Science Building Rm 204', rsvps: 45 },
];

const EventsDirectory = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');

  useEffect(() => {
    let stored = JSON.parse(localStorage.getItem('cx_mock_events') || '[]');
    if (stored.length === 0) {
      stored = MOCK_EVENTS;
      localStorage.setItem('cx_mock_events', JSON.stringify(stored));
    }
    // Sort by date approaching
    stored.sort((a, b) => new Date(a.date) - new Date(b.date));
    setEvents(stored);
  }, []);

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate) return;

    const newEvent = {
      id: 'evt_' + Date.now(),
      title: newEventTitle.trim(),
      description: newEventDesc.trim(),
      date: newEventDate,
      time: newEventTime,
      location: newEventLocation,
      rsvps: 1, // Just the creator
    };

    const updated = [newEvent, ...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    setEvents(updated);
    localStorage.setItem('cx_mock_events', JSON.stringify(updated));

    setIsModalOpen(false);
    setNewEventTitle('');
    setNewEventDesc('');
    setNewEventDate('');
    setNewEventTime('');
    setNewEventLocation('');
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full max-w-5xl mx-auto gap-6 pb-12">
      
      {/* Header & Search */}
      <div className="bg-[var(--cx-bg-surface)] rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] text-center">
        <div className="w-16 h-16 bg-[var(--cx-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[var(--cx-primary)]">
          <Calendar className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-semibold text-[var(--cx-text-main)] tracking-tight mb-2">Campus Events</h1>
        <p className="text-[var(--cx-text-muted)] font-medium mb-8 max-w-xl mx-auto">
          Discover what's happening around campus, RSVP to activities, and never miss out.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cx-text-muted)] w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, locations..." 
              className="w-full bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/20 rounded-xl py-3.5 pl-12 pr-4 text-[15px] outline-none text-[var(--cx-text-main)] font-bold placeholder:text-[var(--cx-text-muted)]/60"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-[15px] bg-[var(--cx-primary)] text-white hover:bg-indigo-700 transition-all shrink-0"
            style={{ backgroundColor: 'var(--cx-primary)', color: 'white' }}
          >
            <Plus className="w-5 h-5" /> Host Event
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEvents.map(evt => {
          const dateObj = new Date(evt.date);
          const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
          const day = dateObj.getDate();

          return (
            <Link 
              key={evt.id} 
              to={`/events/${evt.id}`}
              className="bg-[var(--cx-bg-surface)] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] hover:shadow-md hover:border-[var(--cx-primary)]/30 transition-all group flex h-full"
            >
              {/* Date Block */}
              <div className="w-16 h-16 bg-[var(--cx-bg-base)] rounded-xl flex flex-col items-center justify-center shrink-0 border border-black/[0.04] mr-5 group-hover:bg-[var(--cx-primary)] transition-colors">
                <span className="text-[11px] font-bold text-[var(--cx-primary)] group-hover:text-white/80 transition-colors">{month}</span>
                <span className="text-[20px] font-semibold text-[var(--cx-text-main)] leading-none group-hover:text-white transition-colors">{day}</span>
              </div>
              
              <div className="flex flex-col justify-center flex-1">
                <h3 className="text-[18px] font-semibold text-[var(--cx-text-main)] leading-tight mb-2 group-hover:text-[var(--cx-primary)] transition-colors">
                  {evt.title}
                </h3>
                
                <div className="flex flex-col gap-1.5 text-[13px] font-semibold text-[var(--cx-text-muted)]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span className="truncate">{evt.time || 'TBA'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 font-bold text-[var(--cx-text-main)]">
                    <Users className="w-4 h-4 shrink-0 text-[var(--cx-primary)]" />
                    {evt.rsvps.toLocaleString()} going
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        {filteredEvents.length === 0 && (
          <div className="col-span-full text-center py-12 text-[var(--cx-text-muted)] font-medium bg-[var(--cx-bg-surface)] rounded-2xl border border-black/[0.04]">
            No events found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[var(--cx-bg-surface)] w-full max-w-lg rounded-[32px] p-8 shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-semibold text-[var(--cx-text-main)] tracking-tight mb-2">Host an Event</h2>
            <p className="text-[14px] text-[var(--cx-text-muted)] font-medium mb-6">Plan an activity and invite the campus.</p>
            
            <form onSubmit={handleCreateEvent} className="flex flex-col gap-4">
              <div>
                <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Event Title</label>
                <input 
                  type="text" 
                  required
                  value={newEventTitle}
                  onChange={e => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Hackathon Kickoff"
                  className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-xl px-4 py-3 text-[15px] outline-none transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Date</label>
                  <input 
                    type="date" 
                    required
                    value={newEventDate}
                    onChange={e => setNewEventDate(e.target.value)}
                    className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-xl px-4 py-3 text-[15px] outline-none transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Time</label>
                  <input 
                    type="text" 
                    value={newEventTime}
                    onChange={e => setNewEventTime(e.target.value)}
                    placeholder="e.g. 6:00 PM"
                    className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-xl px-4 py-3 text-[15px] outline-none transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Location</label>
                <input 
                  type="text" 
                  required
                  value={newEventLocation}
                  onChange={e => setNewEventLocation(e.target.value)}
                  placeholder="e.g. Main Library Room 2A"
                  className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-xl px-4 py-3 text-[15px] outline-none transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
                />
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Description</label>
                <textarea 
                  required
                  value={newEventDesc}
                  onChange={e => setNewEventDesc(e.target.value)}
                  placeholder="What is this event about?"
                  className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-xl px-4 py-3 text-[15px] outline-none resize-none min-h-[80px] transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
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
                  disabled={!newEventTitle.trim() || !newEventDate}
                  className="flex-1 py-3.5 rounded-xl font-bold text-[14px] bg-[var(--cx-primary)] text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default EventsDirectory;


