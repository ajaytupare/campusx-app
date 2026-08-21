import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGhost } from '../../context/GhostContext';
import { ArrowLeft, Calendar, MapPin, Clock, Users, UserCheck, AlertTriangle } from 'lucide-react';

const EventProfile = () => {
  const { eventId } = useParams();
  const { currentUser } = useAuth();
  const { isGhostMode } = useGhost();
  
  const [event, setEvent] = useState(null);
  const [isGoing, setIsGoing] = useState(false);
  const [rsvps, setRsvps] = useState([]);

  useEffect(() => {
    // Fetch event metadata
    const allEvents = JSON.parse(localStorage.getItem('cx_mock_events') || '[]');
    const foundEvent = allEvents.find(e => e.id === eventId);
    setEvent(foundEvent);

    // Simulated fetch of specific RSVPs (array of user objects)
    const allRsvps = JSON.parse(localStorage.getItem('cx_mock_event_rsvps') || '{}');
    const eventRsvps = allRsvps[eventId] || [];
    setRsvps(eventRsvps);

    // Check if current user is in the RSVP list
    if (currentUser) {
      const hasRsvpd = eventRsvps.some(u => u.id === currentUser.uid);
      setIsGoing(hasRsvpd);
    }
  }, [eventId, currentUser]);

  const handleRSVP = () => {
    if (isGhostMode) return; // Prevent action entirely if ghost

    const allRsvps = JSON.parse(localStorage.getItem('cx_mock_event_rsvps') || '{}');
    const eventRsvps = allRsvps[eventId] || [];
    
    if (!isGoing) {
      // Add RSVP
      eventRsvps.push({
        id: currentUser.uid,
        name: 'You (Alex Chen)' // Mock name
      });
      setIsGoing(true);
      
      // Update global count mock
      if (event) {
        const allEvents = JSON.parse(localStorage.getItem('cx_mock_events') || '[]');
        const idx = allEvents.findIndex(e => e.id === eventId);
        if (idx > -1) {
          allEvents[idx].rsvps += 1;
          localStorage.setItem('cx_mock_events', JSON.stringify(allEvents));
          setEvent(allEvents[idx]);
        }
      }
    } else {
      // Remove RSVP
      const filtered = eventRsvps.filter(u => u.id !== currentUser.uid);
      eventRsvps.length = 0;
      eventRsvps.push(...filtered);
      setIsGoing(false);
      
      // Update global count mock
      if (event) {
        const allEvents = JSON.parse(localStorage.getItem('cx_mock_events') || '[]');
        const idx = allEvents.findIndex(e => e.id === eventId);
        if (idx > -1) {
          allEvents[idx].rsvps -= 1;
          localStorage.setItem('cx_mock_events', JSON.stringify(allEvents));
          setEvent(allEvents[idx]);
        }
      }
    }
    
    allRsvps[eventId] = eventRsvps;
    localStorage.setItem('cx_mock_event_rsvps', JSON.stringify(allRsvps));
    setRsvps([...eventRsvps]);
  };

  if (!event) {
    return <div className="p-8 text-center text-[var(--cx-text-muted)]">Loading event...</div>;
  }

  const dateObj = new Date(event.date);
  const fullDateString = dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col w-full h-full max-w-4xl mx-auto gap-6 pb-12">
      
      <Link to="/events" className="inline-flex items-center gap-2 text-[var(--cx-text-muted)] hover:text-[var(--cx-text-main)] transition-colors font-bold text-[14px] w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Link>

      <div className="bg-[var(--cx-bg-surface)] rounded-[32px] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]">
        
        {/* Banner */}
        <div className="w-full h-48 bg-gradient-to-r from-[var(--cx-primary)] to-blue-500 rounded-2xl mb-8 relative overflow-hidden flex items-center justify-center">
          <Calendar className="w-24 h-24 text-white/20" />
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-[var(--cx-text-main)] tracking-tight mb-4 leading-tight">
              {event.title}
            </h1>
            
            <p className="text-[var(--cx-text-muted)] text-[16px] font-medium leading-relaxed mb-8">
              {event.description}
            </p>

            <h3 className="font-semibold text-[18px] text-[var(--cx-text-main)] mb-4">Attendees ({event.rsvps})</h3>
            <div className="flex flex-wrap gap-2">
              {rsvps.map((rsvp, idx) => (
                <div key={idx} className="bg-[var(--cx-bg-base)] px-4 py-2 rounded-xl text-[14px] font-bold text-[var(--cx-text-main)] border border-black/[0.04]">
                  {rsvp.name}
                </div>
              ))}
              {rsvps.length === 0 && (
                <p className="text-[var(--cx-text-muted)] text-[14px] font-medium">Be the first to RSVP!</p>
              )}
            </div>
          </div>

          <div className="lg:w-80 shrink-0">
            <div className="bg-[var(--cx-bg-base)] rounded-2xl p-6 border border-black/[0.04] sticky top-6">
              
              <div className="flex flex-col gap-5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--cx-bg-surface)] flex items-center justify-center text-[var(--cx-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[12px] font-bold text-[var(--cx-text-muted)] uppercase tracking-wider mb-0.5">Date</span>
                    <span className="font-bold text-[15px] text-[var(--cx-text-main)]">{fullDateString}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--cx-bg-surface)] flex items-center justify-center text-[var(--cx-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[12px] font-bold text-[var(--cx-text-muted)] uppercase tracking-wider mb-0.5">Time</span>
                    <span className="font-bold text-[15px] text-[var(--cx-text-main)]">{event.time || 'TBA'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--cx-bg-surface)] flex items-center justify-center text-[var(--cx-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[12px] font-bold text-[var(--cx-text-muted)] uppercase tracking-wider mb-0.5">Location</span>
                    <span className="font-bold text-[15px] text-[var(--cx-text-main)] leading-tight">{event.location}</span>
                  </div>
                </div>
              </div>

              {/* RSVP ACTION - WITH GHOST RESTRICTION */}
              {isGhostMode ? (
                <div className="bg-[var(--cx-ghost-start)]/5 border border-[var(--cx-ghost-start)]/20 rounded-xl p-4 text-center">
                  <AlertTriangle className="w-6 h-6 text-[var(--cx-ghost-start)] mx-auto mb-2" />
                  <p className="text-[13px] font-bold text-[var(--cx-ghost-start)] leading-tight mb-2">
                    RSVP Disabled
                  </p>
                  <p className="text-[12px] text-[var(--cx-text-muted)] font-medium">
                    You cannot RSVP to physical campus events while Ghost Mode is active. Turn off Ghost Mode to reserve your spot.
                  </p>
                </div>
              ) : (
                <button 
                  onClick={handleRSVP}
                  className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-[15px] transition-all
                    ${isGoing 
                      ? 'bg-[var(--cx-bg-surface)] text-[var(--cx-text-main)] border-2 border-[var(--cx-primary)]' 
                      : 'bg-[var(--cx-primary)] text-white hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 active:scale-95'}`}
                >
                  {isGoing ? <><UserCheck className="w-5 h-5" /> Attending</> : 'RSVP Now'}
                </button>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventProfile;



