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
    <div className="bg-[var(--cx-bg-surface)] rounded-[24px] p-5 shadow-sm border border-black/5 hover:shadow-md transition-shadow">
      
      {/* Post Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-black/5
            ${isGhost ? 'bg-zinc-900 text-xl' : 'bg-[var(--cx-bg-base)]'}`}>
            {isGhost ? '👻' : (
              <span className="font-bold text-[var(--cx-primary)] text-sm">
                {displayAuthor.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-bold text-[14px] text-[var(--cx-text-main)] flex items-center gap-2 leading-tight">
              {displayAuthor}
              {isGhost && (
                <span className="bg-[var(--cx-ghost-start)]/10 text-[var(--cx-ghost-start)] text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold">
                  Incognito
                </span>
              )}
            </h4>
            <span className="text-[11px] font-semibold text-[var(--cx-text-muted)]">{timeAgo}</span>
          </div>
        </div>
        <button className="text-[var(--cx-text-muted)] hover:bg-[var(--cx-bg-base)] hover:text-[var(--cx-text-main)] p-2 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <p className="text-[14px] text-[var(--cx-text-main)] leading-relaxed font-medium mb-4 whitespace-pre-wrap">
        {content}
      </p>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {tags.map(tag => (
            <span key={tag} className="font-mono text-[11px] font-bold px-2 py-1 rounded-lg bg-[var(--cx-primary)]/10 text-[var(--cx-primary)]">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-black/5">
        <div className="flex gap-4">
          <button className="flex items-center gap-1.5 text-[var(--cx-text-muted)] hover:text-pink-500 transition-colors group font-bold text-[12px]">
            <div className="p-1.5 rounded-full group-hover:bg-pink-50 transition-colors">
              {isGhost ? <Flame className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
            </div>
            {likes || 0}
          </button>
          <button className="flex items-center gap-1.5 text-[var(--cx-text-muted)] hover:text-[var(--cx-accent)] transition-colors group font-bold text-[12px]">
            <div className="p-1.5 rounded-full group-hover:bg-sky-50 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </div>
            {commentsCount || 0}
          </button>
          <button className="flex items-center gap-1.5 text-[var(--cx-text-muted)] hover:text-green-500 transition-colors group font-bold text-[12px]">
            <div className="p-1.5 rounded-full group-hover:bg-green-50 transition-colors">
              <Repeat2 className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

    </div>
  );
};

export default PostCard;
