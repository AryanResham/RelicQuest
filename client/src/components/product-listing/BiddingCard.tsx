import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui";
import type { Item, TimeRemaining } from "./types";
import { useAuthContext } from "@/context/useAuthContext";
import { useItemBids } from "@/hooks/useItemBids";
import { usePlaceBid } from "@/hooks/usePlaceBid";
import { useToggleWatchlist } from "@/hooks/useWatchlist";

interface BiddingCardProps {
  item: Item;
  isLive: boolean;
  timeRemaining: TimeRemaining;
  onBidPlaced?: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatBidTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

function anonymizeBidder(userId: string): string {
  // Create anonymous bidder name from last 4 chars of user ID
  return `Bidder ${userId.slice(-4).toUpperCase()}`;
}

export function BiddingCard({ item, isLive, timeRemaining, onBidPlaced }: BiddingCardProps) {
  const [bidAmount, setBidAmount] = useState("");
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: bids = [], isLoading: loadingBids } = useItemBids(item.id);
  const bidMutation = usePlaceBid(item.id, id);
  const { isWatching, toggle: toggleWatch, isPending: watchPending } = useToggleWatchlist(item.id);

  const nextBidAmount = item.current_price + item.bid_increment;
  const reserveMet = item.current_price >= item.min_price;

  const handlePlaceBid = () => {
    if (!user) {
      navigate('/login', { state: { from: `/auction/${item.id}` } });
      return;
    }

    const amount = parseFloat(bidAmount) || nextBidAmount;
    if (amount < nextBidAmount) return;

    bidMutation.mutate(amount, {
      onSuccess: (result) => {
        if (result.success) {
          setBidAmount('');
          onBidPlaced?.();
        }
      },
    });
  };

  return (
    <div className="rounded-xl bg-card-dark border border-[#292e38] shadow-lg overflow-hidden h-full">
       
       {/* Card Header: Live Status & Timer */}
       <div className="flex justify-between items-center p-6 border-b border-[#292e38] bg-card-dark">
          <div className="flex items-center gap-2">
            <span className={`size-2.5 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
            <span className={`text-xs font-bold tracking-wider uppercase ${isLive ? 'text-green-500' : 'text-gray-500'}`}>
              {isLive ? 'Live Auction' : 'Ended'}
            </span>
          </div>
          {isLive && (
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-0.5">Time Remaining</span>
              <div className="font-mono text-white text-lg font-medium leading-none">
                {String(timeRemaining.days) !== "0" && `${timeRemaining.days}d `}
                {String(timeRemaining.hours).padStart(2, '0')}:{String(timeRemaining.minutes).padStart(2, '0')}:{String(timeRemaining.seconds).padStart(2, '0')}
              </div>
            </div>
          )}
       </div>

       <div className="p-6">
         {/* Current Price Section */}
         <div className="mb-8">
            <p className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-2">Current Bid</p>
            <div className="flex items-baseline gap-2">
               <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                 {formatCurrency(item.current_price)}
               </span>
               <span className="text-text-secondary font-medium">USD</span>
            </div>
            {reserveMet && (
              <div className="flex items-center gap-1 mt-2 text-green-500 text-sm font-medium">
                <span className="material-symbols-outlined text-[18px]">trending_up</span>
                <span>Reserve met</span>
              </div>
            )}
         </div>

         {/* Bidding Controls */}
         {isLive ? (
           <div className="flex flex-col gap-4">
              <div className="flex justify-between text-sm">
                 <span className="text-text-secondary font-medium">Minimum Bid</span>
                 <span className="text-white font-bold">{formatCurrency(nextBidAmount)}</span>
              </div>
              
              <div className="relative">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
                 <input 
                   type="number"
                   value={bidAmount}
                   onChange={(e) => setBidAmount(e.target.value)}
                   placeholder={String(nextBidAmount)}
                   disabled={bidMutation.isPending}
                   className="w-full h-12 bg-[#111621] border border-[#292e38] rounded-lg pl-8 pr-4 text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg font-medium disabled:opacity-50"
                 />
              </div>

              {/* Error Message */}
              {bidMutation.data && !bidMutation.data.success && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{bidMutation.data.error || 'Failed to place bid'}</span>
                </div>
              )}

              {/* Success Message */}
              {bidMutation.isSuccess && bidMutation.data?.success && (
                <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 px-3 py-2 rounded-lg">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Bid placed successfully!</span>
                </div>
              )}

              <Button 
                variant="primary" 
                fullWidth 
                className="h-12 text-lg font-bold shadow-lg shadow-blue-500/20"
                onClick={handlePlaceBid}
                disabled={bidMutation.isPending}
              >
                {bidMutation.isPending ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>
                    Placing Bid...
                  </>
                ) : (
                  <>
                    Place Bid
                    {/* <span className="material-symbols-outlined ml-2">arrow_forward</span> */}
                  </>
                )}
              </Button>

              {user && (
                <button
                  onClick={() => toggleWatch()}
                  disabled={watchPending}
                  className={`w-full h-10 rounded-lg border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    isWatching
                      ? 'border-primary/50 text-primary bg-primary/10 hover:bg-primary/20'
                      : 'border-[#292e38] text-text-secondary hover:text-white hover:border-white/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isWatching ? 'visibility' : 'visibility_off'}
                  </span>
                  {isWatching ? 'Watching' : 'Watch Auction'}
                </button>
              )}

              <div className="text-center">
                 <p className="text-[11px] text-text-secondary leading-relaxed">
                   By placing a bid, you agree to the <a href="#" className="underline hover:text-white">Conditions of Sale</a>.
                 </p>
              </div>
           </div>
         ) : (
           <div className="flex flex-col gap-3">
             {item.winner_id ? (
               item.winner_id === user?.id ? (
                 <div className="flex flex-col items-center gap-2 py-5 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
                   <span className="material-symbols-outlined text-4xl text-green-400">emoji_events</span>
                   <p className="text-green-400 font-bold text-lg">You won this auction!</p>
                   <p className="text-text-secondary text-sm">Winning bid: {formatCurrency(item.current_price)}</p>
                 </div>
               ) : (
                 <div className="flex flex-col items-center gap-2 py-5 bg-[#111621] border border-[#292e38] rounded-xl text-center">
                   <span className="material-symbols-outlined text-4xl text-text-secondary">gavel</span>
                   <p className="text-white font-bold">Auction Ended</p>
                   <p className="text-text-secondary text-sm">Sold for {formatCurrency(item.current_price)}</p>
                 </div>
               )
             ) : (
               <div className="flex flex-col items-center gap-2 py-5 bg-[#111621] border border-[#292e38] rounded-xl text-center">
                 <span className="material-symbols-outlined text-4xl text-text-secondary">gavel</span>
                 <p className="text-white font-bold">Auction Ended</p>
                 <p className="text-text-secondary text-sm">No bids were placed</p>
               </div>
             )}
             <Link to="/auctions"><Button variant="outline" fullWidth>Browse More Auctions</Button></Link>
           </div>
         )}
       </div>

       {/* Recent Activity */}
       <div className="border-t border-[#292e38] p-6">
          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">Recent Activity</h4>
          
          {loadingBids ? (
            <div className="flex items-center justify-center py-4">
              <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></span>
            </div>
          ) : bids.length === 0 ? (
            <p className="text-text-secondary text-sm text-center py-4">No bids yet. Be the first!</p>
          ) : (
            <div className="space-y-3">
              {bids.map((bid, index) => (
                <div 
                  key={bid.id} 
                  className={`flex justify-between items-center text-sm ${index === 0 ? '' : 'opacity-60'}`}
                >
                  <span className={`font-medium ${index === 0 ? 'text-white' : 'text-gray-400'}`}>
                    {bid.user?.username || anonymizeBidder(bid.user_id)}
                  </span>
                  <div className={`flex gap-3 ${index === 0 ? 'text-text-secondary' : 'text-gray-500'}`}>
                    <span>{formatBidTime(bid.created_at)}</span>
                    <span className={`font-bold ${index === 0 ? 'text-white' : 'text-gray-400'}`}>
                      {formatCurrency(bid.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
{/*           
          {bids.length > 0 && (
            <button className="w-full mt-4 text-primary text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:text-primary-hover transition-colors">
              View Full History <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
          )} */}
       </div>
    </div>
  );
}
