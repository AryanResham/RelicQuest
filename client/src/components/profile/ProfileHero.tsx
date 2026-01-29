import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import StatCard from '../ui/StatCard';

interface ProfileHeroProps {
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  memberSince?: string;
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  location?: string;
  stats?: {
    activeBids: number;
    watchlist: number;
    itemsWon: number;
    selling: number;
  };
  isSeller?: boolean;
  onLogout?: () => void;
}

export default function ProfileHero({
  avatarUrl,
  firstName = '',
  lastName = '',
  username = '',
  memberSince = '',
  rating = 0,
  reviewCount = 0,
  isVerified = false,
  location = '',
  stats = { activeBids: 0, watchlist: 0, itemsWon: 0, selling: 0 },
  isSeller = false,
  onLogout,
}: ProfileHeroProps) {
  const displayName = firstName && lastName 
    ? `${firstName} ${lastName}` 
    : username || 'User';

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=195de6&color=fff&size=160`;

  return (
    <div className="px-4 md:px-10 lg:px-20 py-8 md:py-12 bg-[var(--card-dark)] border-b border-[var(--border)]">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Avatar */}
        <div className="relative">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 md:size-40 border-4 border-[var(--card-dark)] shadow-xl"
            style={{ backgroundImage: `url("${avatarUrl || defaultAvatar}")` }}
          />
          <Link to="/profile/edit" className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </Link>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">{displayName}</h1>
            {isSeller && <Badge variant="primary">Pro Collector</Badge>}
          </div>
          
          {memberSince && (
            <p className="text-[var(--text-muted)] text-base mb-4">{memberSince}</p>
          )}

          {/* Badges row */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
            {rating > 0 && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="font-bold text-white">{rating} Rating</span>
                <span className="text-[var(--text-muted)]">({reviewCount} reviews)</span>
              </div>
            )}
            
            {isVerified && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
                <span className="font-bold text-blue-400">Verified Identity</span>
              </div>
            )}

            {location && (
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>{location}</span>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className={`grid grid-cols-2 ${isSeller ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 mt-8`}>
            <StatCard label="Active Bids" value={stats.activeBids} />
            <StatCard label="Watchlist" value={stats.watchlist} />
            <StatCard label="Items Won" value={stats.itemsWon} />
            {isSeller && <StatCard label="Selling" value={stats.selling} />}
          </div>
        </div>

        {/* Action buttons */}
        <div className="hidden xl:flex flex-col gap-3">
          {isSeller ? (
            <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-white font-bold py-2.5 px-6 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              List an Item
            </button>
          ) : (
            <Link 
              to="/become-seller" 
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Become a Seller
            </Link>
          )}
          <button className="flex items-center justify-center gap-2 bg-[var(--card-dark)] border border-[var(--border)] hover:bg-[var(--border)] font-bold py-2.5 px-6 rounded-lg transition-colors text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Account Settings
          </button>
          {onLogout && (
            <button 
              onClick={onLogout}
              className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 font-bold py-2.5 px-6 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
