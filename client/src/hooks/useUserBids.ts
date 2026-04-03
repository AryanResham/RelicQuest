import { useQuery } from '@tanstack/react-query';
import { getUserBids, type UserBidWithItem } from '@/lib/bid';
import { queryKeys } from '@/lib/queryKeys';
import type { BidStatus } from '@/components/profile/BidCard';

export interface UserBidCardData {
  id: string;
  itemId: number;
  title: string;
  imageUrl: string;
  sellerName: string;
  status: BidStatus;
  yourBid: number;
  currentPrice: number;
  endTime: string;
}

function getBidStatus(bid: UserBidWithItem): BidStatus {
  if (new Date(bid.item.end_time) <= new Date()) return 'ended';
  if (bid.amount >= bid.item.current_price) return 'winning';
  return 'outbid';
}

function toBidCardData(bid: UserBidWithItem): UserBidCardData {
  return {
    id: String(bid.item.id),
    itemId: bid.item.id,
    title: bid.item.title,
    imageUrl: bid.item.images[0] ?? '',
    sellerName: bid.item.seller?.store_name ?? 'Unknown Seller',
    status: getBidStatus(bid),
    yourBid: bid.amount,
    currentPrice: bid.item.current_price,
    endTime: bid.item.end_time,
  };
}

export function useUserBids() {
  return useQuery({
    queryKey: queryKeys.bids.byUser,
    queryFn: async () => {
      const result = await getUserBids();
      if (result.success && result.data) return result.data.map(toBidCardData);
      return [];
    },
    staleTime: 30_000,
  });
}
