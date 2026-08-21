import { Image as ImageIcon, Smile, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

const Dashboard = () => {
  return (
    <>
      {/* Post Composer - Warm Minimalist Style */}
      <div className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-light)] mb-8">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Me" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <textarea 
              placeholder="What's happening on campus?"
              className="w-full bg-transparent border-none text-[16px] outline-none resize-none min-h-[60px] font-medium text-[var(--text-main)] placeholder-[var(--text-muted)] pt-2"
            />
            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-light)]">
              <div className="flex gap-2">
                <button className="p-2 text-[var(--text-muted)] hover:bg-black/5 rounded-full transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-[var(--text-muted)] hover:bg-black/5 rounded-full transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button className="bg-[var(--accent-black)] text-white px-6 py-2 rounded-full font-bold text-[14px] hover:bg-black/80 transition-all">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Feed Post */}
      <div className="flex flex-col gap-6">
        <article className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-light)]">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="User" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-[15px] text-[var(--text-main)] leading-tight">Sarah Jenkins</h4>
                <p className="text-[13px] font-medium text-[var(--text-muted)]">Biology '25 &bull; 2h ago</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <p className="text-[15px] leading-relaxed text-[var(--text-main)] mb-4">
            Just finished my final presentation for Bio 401. So relieved! Anyone want to grab coffee at the union to celebrate? ☕️
          </p>

          {/* Action Bar */}
          <div className="flex items-center gap-6 pt-4 border-t border-[var(--border-light)]">
            <button className="flex items-center gap-2 text-[14px] font-semibold text-[var(--text-muted)] hover:text-black transition-colors">
              <Heart className="w-[18px] h-[18px]" /> 24
            </button>
            <button className="flex items-center gap-2 text-[14px] font-semibold text-[var(--text-muted)] hover:text-black transition-colors">
              <MessageCircle className="w-[18px] h-[18px]" /> 5
            </button>
            <button className="flex items-center gap-2 text-[14px] font-semibold text-[var(--text-muted)] hover:text-black transition-colors">
              <Share2 className="w-[18px] h-[18px]" />
            </button>
            <button className="ml-auto text-[var(--text-muted)] hover:text-black transition-colors">
              <Bookmark className="w-[18px] h-[18px]" />
            </button>
          </div>
        </article>
      </div>
    </>
  );
};

export default Dashboard;
