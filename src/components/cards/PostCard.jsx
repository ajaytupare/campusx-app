import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Flame } from 'lucide-react';

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
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-black/[0.04]">
      
      {/* Post Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0
            ${isGhost ? 'bg-[#1A1A1A] text-lg' : 'bg-[#E8E0CC]'}`}>
            {isGhost ? '\uD83D\uDC7B' : (
              <span className="font-bold text-[var(--cx-text-main)] text-[14px]">
                {displayAuthor.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-bold text-[14px] text-[var(--cx-text-main)] flex items-center gap-2 leading-tight">
              {displayAuthor}
              {isGhost && (
                <span className="bg-[var(--cx-text-muted)]/10 text-[var(--cx-text-muted)] text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-semibold">
                  Verified Student
                </span>
              )}
            </h4>
            <span className="text-[12px] font-medium text-[var(--cx-text-muted)]">
              {isGhost ? 'Verified Student' : 'Computer Science'} &bull; {timeAgo}
            </span>
          </div>
        </div>
        <button className="text-[var(--cx-text-muted)] hover:bg-black/[0.04] p-2 rounded-full transition-all">
          <MoreHorizontal className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Post Content */}
      <p className="text-[14px] text-[var(--cx-text-main)] leading-relaxed font-normal mb-4 whitespace-pre-wrap">
        {content}
      </p>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {tags.map(tag => (
            <span key={tag} className="text-[12px] font-semibold px-3 py-1 rounded-full bg-[var(--cx-bg-base)] text-[var(--cx-text-main)]">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons - matches mockup exactly */}
      <div className="flex items-center gap-6 pt-3 border-t border-black/[0.04]">
        <button className="flex items-center gap-1.5 text-[var(--cx-text-muted)] hover:text-red-500 transition-all font-medium text-[13px]">
          {isGhost ? <Flame className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
          {likes || 0}
        </button>
        <button className="flex items-center gap-1.5 text-[var(--cx-text-muted)] hover:text-[var(--cx-text-main)] transition-all font-medium text-[13px]">
          <MessageCircle className="w-4 h-4" />
          {commentsCount || 0}
        </button>
        <button className="flex items-center gap-1.5 text-[var(--cx-text-muted)] hover:text-[var(--cx-text-main)] transition-all font-medium text-[13px]">
          <Share2 className="w-4 h-4" />
        </button>
        <button className="ml-auto text-[var(--cx-text-muted)] hover:text-[var(--cx-text-main)] transition-all">
          <Bookmark className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
