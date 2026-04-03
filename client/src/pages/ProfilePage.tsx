import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/layout';
import { ProfileHero, ProfileTabs, BidCard, type ProfileTab } from '../components/profile';
import { useAuthContext } from '../context/useAuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { useUserBids } from '../hooks/useUserBids';
import { useSellerItems } from '../hooks/useSellerItems';
import { useWonItems } from '../hooks/useWonItems';
import { useWatchlist } from '../hooks/useWatchlist';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatTimeLeft(endTime: string): string {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return 'Ended';
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function ProfilePage() {
  const { user, logoutUser } = useAuthContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>('active-bids');

  const { data: profileData } = useUserProfile(user?.id);
  const { data: userBids = [], isLoading: loadingBids } = useUserBids();
  const { data: sellerItems = [], isLoading: loadingSellerItems } = useSellerItems();
  const { data: wonItems = [], isLoading: loadingWonItems } = useWonItems();
  const { data: watchlist = [], isLoading: loadingWatchlist } = useWatchlist();

  const userMetadata = user?.user_metadata || {};
  const firstName = userMetadata.given_name || userMetadata.name?.split(' ')[0] || '';
  const lastName = userMetadata.family_name || userMetadata.name?.split(' ').slice(1).join(' ') || '';
  const avatarUrl = profileData?.avatar || userMetadata.avatar_url || userMetadata.picture || '';

  const activeBids = userBids.filter(b => b.status === 'winning' || b.status === 'outbid');

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = '/';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'active-bids':
        if (loadingBids) return <LoadingSpinner />;
        if (activeBids.length === 0) return (
          <EmptyState
            message="You have no active bids."
            action={<Link to="/auctions"><button className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/80 transition-colors">Browse Auctions</button></Link>}
          />
        );
        return (
          <div className="grid grid-cols-1 gap-6">
            {activeBids.map(bid => (
              <BidCard
                key={bid.id}
                bid={{ ...bid, watchCount: 0, timeLeft: formatTimeLeft(bid.endTime) }}
                onIncreaseBid={() => navigate(`/auction/${bid.itemId}`)}
                onBidAgain={() => navigate(`/auction/${bid.itemId}`)}
              />
            ))}
          </div>
        );

      case 'won-items':
        if (loadingWonItems) return <LoadingSpinner />;
        if (wonItems.length === 0) return (
          <EmptyState message="You haven't won any auctions yet." />
        );
        return (
          <div className="grid grid-cols-1 gap-6">
            {wonItems.map(item => (
              <BidCard
                key={item.id}
                bid={{
                  id: String(item.id),
                  title: item.title,
                  imageUrl: item.images[0] ?? '',
                  sellerName: item.seller?.store_name ?? 'Unknown Seller',
                  status: 'ended',
                  watchCount: 0,
                  yourBid: item.current_price,
                  currentPrice: item.current_price,
                  timeLeft: 'Ended',
                }}
              />
            ))}
          </div>
        );

      case 'selling':
        if (loadingSellerItems) return <LoadingSpinner />;
        if (sellerItems.length === 0) return (
          <EmptyState
            message="You have no items listed for sale."
            action={<Link to="/list-item"><button className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/80 transition-colors">List Your First Item</button></Link>}
          />
        );
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellerItems.map(item => {
              const isLive = new Date(item.end_time) > new Date();
              return (
                <Link key={item.id} to={`/auction/${item.id}`} className="bg-[var(--card-dark)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-primary/50 transition-all group">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.images[0] ?? ''}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold truncate mb-2">{item.title}</h3>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[var(--text-muted)]">Current Bid</span>
                      <span className="text-primary font-bold">{formatCurrency(item.current_price)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-[var(--text-muted)]">Status</span>
                      <span className={`font-bold ${isLive ? 'text-green-400' : 'text-gray-400'}`}>
                        {isLive ? 'Live' : 'Ended'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-[var(--text-muted)]">{isLive ? 'Time Left' : 'Ended'}</span>
                      <span className="text-white font-medium">{formatTimeLeft(item.end_time)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        );

      case 'watchlist':
        if (loadingWatchlist) return <LoadingSpinner />;
        if (watchlist.length === 0) return (
          <EmptyState
            message="You're not watching any auctions."
            action={<Link to="/auctions"><button className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/80 transition-colors">Browse Auctions</button></Link>}
          />
        );
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map(w => {
              const isLive = new Date(w.item.end_time) > new Date();
              return (
                <Link key={w.id} to={`/auction/${w.item.id}`} className="bg-[var(--card-dark)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-primary/50 transition-all group">
                  <div className="aspect-video overflow-hidden">
                    <img src={w.item.images[0] ?? ''} alt={w.item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold truncate mb-2">{w.item.title}</h3>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[var(--text-muted)]">Current Bid</span>
                      <span className="text-primary font-bold">{formatCurrency(w.item.current_price)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-[var(--text-muted)]">{isLive ? 'Time Left' : 'Status'}</span>
                      <span className={`font-medium ${isLive ? 'text-white' : 'text-gray-400'}`}>
                        {isLive ? formatTimeLeft(w.item.end_time) : 'Ended'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        );

      case 'order-history':
        return (
          <EmptyState message="Your completed transactions will appear here." />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-dark)]">
      <Header />

      <main className="max-w-[1440px] mx-auto pb-20">
        <ProfileHero
          avatarUrl={avatarUrl}
          firstName={firstName}
          lastName={lastName}
          username={profileData?.username || user?.email?.split('@')[0]}
          memberSince={profileData?.username ? `@${profileData.username}` : ''}
          stats={{
            activeBids: activeBids.length,
            watchlist: watchlist.length,
            itemsWon: wonItems.length,
            selling: sellerItems.length,
          }}
          isSeller={profileData?.is_seller ?? false}
          onLogout={handleLogout}
        />

        <div className="px-4 md:px-10 lg:px-20 mt-8">
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} isSeller={profileData?.is_seller ?? false} />
          {renderTabContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center py-16">
      <span className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
    </div>
  );
}

function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-[var(--text-muted)] mb-4">{message}</p>
      {action}
    </div>
  );
}
