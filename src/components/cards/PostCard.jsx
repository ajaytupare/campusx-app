import { Heart, MessageCircle, Repeat2, MoreHorizontal, Flame } from 'lucide-react';


// Let's inline a simple relative time formatter for now to avoid extra dependencies.
const getRelativeTime = (timestamp) => {
  if (!timestamp) return 'Just now';
  const now = new Date();
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const PostCard = ({ post }) => {
  const { isGhost, authorName, createdAt, content, likes, commentsCount, tags } = post;
  
  const displayAuthor = isGhost ? `Ghost #${post.id.substring(0, 4).toUpperCase()}` : (authorName || 'Student');
  const timeAgo = getRelativeTime(createdAt);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300">
      
      {/* Post Header */}
      <div className="flex justify-between items-start mb-3.5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0
            ${isGhost ? 'bg-[#1D1D1F] text-lg' : 'bg-[#F5F5F7]'}`}>
            {isGhost ? '\uD83D\uDC7B' : (
              <span className="font-semibold text-[#0071E3] text-[14px]">
                {displayAuthor.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-[15px] text-[#1D1D1F] flex items-center gap-2 leading-tight">
              {displayAuthor}
              {isGhost && (
                <span className="bg-[#5E5CE6]/[0.08] text-[#5E5CE6] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold">
                  Incognito
                </span>
              )}
            </h4>
            <span className="text-[12px] font-medium text-[#86868B]">{timeAgo}</span>
          </div>
        </div>
        <button className="text-[#86868B] hover:bg-black/[0.04] hover:text-[#1D1D1F] p-2 rounded-full transition-all duration-200">
          <MoreHorizontal className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Post Content */}
      <p className="text-[15px] text-[#1D1D1F] leading-relaxed font-normal mb-4 whitespace-pre-wrap">
        {content}
      </p>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {tags.map(tag => (
            <span key={tag} className="text-[12px] font-medium px-3 py-1 rounded-full bg-[#0071E3]/[0.07] text-[#0071E3]">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3.5">
        <div className="h-px bg-black/[0.04] absolute left-5 right-5"></div>
        <div className="flex gap-1">
          <button className="flex items-center gap-1.5 text-[#86868B] hover:text-[#FF2D55] transition-all duration-200 group font-medium text-[13px] px-3 py-1.5 rounded-full hover:bg-[#FF2D55]/[0.06]">
            {isGhost ? <Flame className="w-[16px] h-[16px]" /> : <Heart className="w-[16px] h-[16px]" />}
            {likes || 0}
          </button>
          <button className="flex items-center gap-1.5 text-[#86868B] hover:text-[#0071E3] transition-all duration-200 group font-medium text-[13px] px-3 py-1.5 rounded-full hover:bg-[#0071E3]/[0.06]">
            <MessageCircle className="w-[16px] h-[16px]" />
            {commentsCount || 0}
          </button>
          <button className="flex items-center gap-1.5 text-[#86868B] hover:text-[#34C759] transition-all duration-200 group font-medium text-[13px] px-3 py-1.5 rounded-full hover:bg-[#34C759]/[0.06]">
            <Repeat2 className="w-[16px] h-[16px]" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default PostCard;
