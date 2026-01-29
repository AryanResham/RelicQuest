import { useState, useEffect } from 'react';
import { Header, Footer } from '../components/layout';
import { ProfileHero, ProfileTabs, BidCard, type ProfileTab, type BidCardData } from '../components/profile';
import { useAuthContext } from '../context/useAuthContext';
import api from '../lib/axios';

// Mock data for demonstration
const mockBids: BidCardData[] = [
  {
    id: '1',
    title: '1952 Topps Mickey Mantle #311 PSA 8 NM-MT',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsjlhCTqxfIy6i9AYUtegEayXuaTfDgeDZ_B4_5DsvlifCOHEltl2o7FEc_QJS7jh7L6R8exuxC2vbzHw-ZA-4UJ8YPfV7zaEzidLBqpIohR3zTNtp4blilhug_WiJkHc04XXLFHveCqKqZVGOPB-5mJyY-fAN-IXWg6F_qte6UmumXHzSY8lIk9sYdAYhNNrb5ppWCLlI5d9iGPEX4w48RlQ8K0nZE9gEwmTjgYQMsq7eVFKN2Ik7m7qdBNKBoP8pWENPt_HuBMU',
    sellerName: 'VintageVault',
    status: 'winning',
    watchCount: 145,
    yourBid: 150000,
    currentPrice: 145000,
    timeLeft: '04d 12h 33m',
  },
  {
    id: '2',
    title: '1933 Goudey Babe Ruth #144 SGC 7',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBNd6J-Gkhws-vsn5jqi2nJzS4AZmizhHlpU5GCSc4DO9sW744eerTfF2br_4jp13w-hfL-oWL1VnODx0fUWYst8-J1C9AZVhGrYW5dcdY9RRDasPSWLLZr3L11n3HMPWK-Xky5TcB5EW01v-LDkowJCHkzg6RmlF2izpxYMw79w4RKgulDymzlOlUPSVUIcZRotzlbGHrDCFVulhoKNj__QaGJTKbt1NZVQ5-K5egtQMyC7VfwW3nqUww6EH4Florsnl6TuQMVUM',
    sellerName: 'DiamondGems',
    status: 'outbid',
    watchCount: 89,
    yourBid: 41000,
    currentPrice: 42500,
    timeLeft: '02d 04h 15m',
  },
  {
    id: '3',
    title: '1951 Bowman Willie Mays #305 PSA 6',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBs2uZDR9KDUNAVXayORHJ7VqIPQydEd7fedYZSc1eU2FFNSZ25i2B9DUDqpJDxCtvpmP1pgi4nQpKsCv6iZRDlYu19YVhxK1WxeNABPlUMBRzaTCZVEdycf0Fpmb0iB_sDLJZDZuhbzloSO-F77u_BQqENfsc13vsfXdE9xm1dx-qoAz2-eZgjr3mt3mYbnnk-3k8Ddc7LYz2oUlnHeKNcaZxVSnIKo-F08Xdl7lOWIsjgrIb4Q-1mEUllTeE6KugbyvOxx7ipX8',
    sellerName: 'CooperstownCollect',
    status: 'winning',
    watchCount: 212,
    yourBid: 70000,
    currentPrice: 68900,
    timeLeft: '01d 08h 12m',
  },
];

const mockWatchlist: BidCardData[] = [
  {
    id: '4',
    title: '1986 Fleer Michael Jordan #57 PSA 10',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
    sellerName: 'HoopsHeritage',
    status: 'watching',
    watchCount: 324,
    yourBid: 0,
    currentPrice: 95000,
    timeLeft: '06d 02h 45m',
  },
];

export default function ProfilePage() {
  const { user, logoutUser } = useAuthContext();
  const [activeTab, setActiveTab] = useState<ProfileTab>('active-bids');
  const [profileData, setProfileData] = useState<{ avatar?: string; username?: string; is_seller?: boolean } | null>(null);

  // Fetch user profile from database on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const response = await api.get(`/api/users/${user.id}`);
        if (response.data.success) {
          setProfileData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, [user?.id]);

  // Get user metadata (fallback to auth data)
  const userMetadata = user?.user_metadata || {};
  const firstName = userMetadata.given_name || userMetadata.name?.split(' ')[0] || '';
  const lastName = userMetadata.family_name || userMetadata.name?.split(' ').slice(1).join(' ') || '';
  // Use database avatar first, then fall back to auth metadata
  const avatarUrl = profileData?.avatar || userMetadata.avatar_url || userMetadata.picture || '';

  const handleIncreaseBid = (id: string) => {
    console.log('Increase bid for:', id);
    // TODO: Open bid modal
  };

  const handleBidAgain = (id: string) => {
    console.log('Bid again for:', id);
    // TODO: Open bid modal
  };

  const handleLogout = async () => {
    await logoutUser();           // Logout first and wait for it
    window.location.href = '/';   // Then redirect
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'active-bids':
        return (
          <div className="grid grid-cols-1 gap-6">
            {mockBids.map((bid) => (
              <BidCard
                key={bid.id}
                bid={bid}
                onIncreaseBid={handleIncreaseBid}
                onBidAgain={handleBidAgain}
              />
            ))}
          </div>
        );
      case 'watchlist':
        return (
          <div className="grid grid-cols-1 gap-6">
            {mockWatchlist.map((item) => (
              <BidCard
                key={item.id}
                bid={item}
                onIncreaseBid={handleIncreaseBid}
                onBidAgain={handleBidAgain}
              />
            ))}
          </div>
        );
      case 'won-items':
        return (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="w-16 h-16 text-[var(--text-muted)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">No won items yet</h3>
            <p className="text-[var(--text-muted)] max-w-md">
              Items you've successfully won at auction will appear here.
            </p>
          </div>
        );
      case 'selling':
        return (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="w-16 h-16 text-[var(--text-muted)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">No items for sale</h3>
            <p className="text-[var(--text-muted)] max-w-md mb-6">
              Start selling your collectibles and reach thousands of buyers.
            </p>
            <button className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/80 transition-colors">
              List Your First Item
            </button>
          </div>
        );
      case 'order-history':
        return (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="w-16 h-16 text-[var(--text-muted)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">No order history</h3>
            <p className="text-[var(--text-muted)] max-w-md">
              Your completed transactions will appear here.
            </p>
          </div>
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
          rating={4.9}
          reviewCount={420}
          isVerified={true}
          location="San Francisco, CA"
          stats={{
            activeBids: mockBids.length,
            watchlist: mockWatchlist.length,
            itemsWon: 156,
            selling: 5,
          }}
          isSeller={profileData?.is_seller ?? false}
          onLogout={handleLogout}
        />

        <div className="px-4 md:px-10 lg:px-20 mt-8">
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} isSeller={profileData?.is_seller ?? false} />
          
          {renderTabContent()}

          {/* Show more button for tabs with content */}
          {(activeTab === 'active-bids' || activeTab === 'watchlist') && (
            <div className="mt-12 flex justify-center">
              <button className="flex items-center gap-2 px-8 py-3 border border-[var(--border)] rounded-xl text-sm font-bold text-white hover:bg-[var(--card-dark)] transition-all">
                Show More Activity
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
