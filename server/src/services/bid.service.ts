import { supabase } from '../config/supabase.js';
import type { Bid, BidWithUser, Item, UserBidWithItem } from '../types/types.js';

/**
 * Place a bid on an item
 */
export const placeBid = async (
  userId: string,
  itemId: number,
  amount: number
): Promise<{ success: boolean; data?: Bid; error?: string }> => {
  try {
    // 1. Get the item to validate bid
    const { data: item, error: itemError } = await supabase
      .from('item')
      .select('*')
      .eq('id', itemId)
      .single();

    if (itemError || !item) {
      console.error('Error fetching item:', itemError);
      return { success: false, error: 'Item not found' };
    }

    const itemData = item as Item;

    // 2. Check if auction is still live
    const now = new Date();
    const endTime = new Date(itemData.end_time);
    if (now >= endTime) {
      return { success: false, error: 'Auction has ended' };
    }

    // 3. Check if bidder is the seller
    if (itemData.seller_id === userId) {
      return { success: false, error: 'You cannot bid on your own item' };
    }

    // 4. Validate bid amount
    const minimumBid = itemData.current_price + itemData.bid_increment;
    if (amount < minimumBid) {
      return { 
        success: false, 
        error: `Bid must be at least $${minimumBid.toLocaleString()}` 
      };
    }

    // 5. Insert the bid (table is named 'bids')
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .insert({
        item_id: itemId,
        user_id: userId,
        amount: amount
      })
      .select()
      .single();

    if (bidError) {
      console.error('Error inserting bid:', bidError);
      return { success: false, error: 'Failed to place bid' };
    }

    // 6. Update item's current_price
    const { error: updateError } = await supabase
      .from('item')
      .update({ current_price: amount })
      .eq('id', itemId);

    if (updateError) {
      console.error('Error updating item price:', updateError);
      // Bid was placed but price update failed - log for manual fix
    }

    return { success: true, data: bid as Bid };
  } catch (error) {
    console.error('placeBid error:', error);
    return { success: false, error: 'Failed to place bid' };
  }
};

/**
 * Get bids for an item (most recent first)
 * Note: Not joining with users table for now - using anonymous display
 */
export const getBidsByItem = async (
  itemId: number,
  limit: number = 10
): Promise<{ success: boolean; data?: BidWithUser[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('item_id', itemId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching bids:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: (data || []) as BidWithUser[] };
  } catch (error) {
    console.error('getBidsByItem error:', error);
    return { success: false, error: 'Failed to fetch bids' };
  }
};

/**
 * Get all bids placed by a user (latest bid per item, with item data)
 */
export const getBidsByUser = async (
  userId: string
): Promise<{ success: boolean; data?: UserBidWithItem[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('bids')
      .select(`
        id, item_id, user_id, amount, created_at,
        item (
          id, title, images, current_price, end_time,
          seller ( store_name )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user bids:', error);
      return { success: false, error: error.message };
    }

    // Keep only the latest bid per item
    const seen = new Set<number>();
    const unique = (data || []).filter(bid => {
      if (seen.has(bid.item_id)) return false;
      seen.add(bid.item_id);
      return true;
    });

    return { success: true, data: unique as unknown as UserBidWithItem[] };
  } catch (error) {
    console.error('getBidsByUser error:', error);
    return { success: false, error: 'Failed to fetch bids' };
  }
};

/**
 * Get total bid count for an item
 */
export const getBidCount = async (
  itemId: number
): Promise<{ success: boolean; count?: number; error?: string }> => {
  try {
    const { count, error } = await supabase
      .from('bids')
      .select('*', { count: 'exact', head: true })
      .eq('item_id', itemId);

    if (error) {
      console.error('Error counting bids:', error);
      return { success: false, error: error.message };
    }

    return { success: true, count: count || 0 };
  } catch (error) {
    console.error('getBidCount error:', error);
    return { success: false, error: 'Failed to count bids' };
  }
};
