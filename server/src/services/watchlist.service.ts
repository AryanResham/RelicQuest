import { supabase } from '../config/supabase.js';
import type { Item } from '../types/types.js';

export interface WatchlistItem {
  id: number;
  user_id: string;
  item_id: number;
  created_at: string;
  item: Pick<Item, 'id' | 'title' | 'images' | 'current_price' | 'end_time'>;
}

export const getWatchlist = async (
  userId: string
): Promise<{ success: boolean; data?: WatchlistItem[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('watchlist')
      .select(`id, user_id, item_id, created_at, item ( id, title, images, current_price, end_time )`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return { success: false, error: error.message };
    return { success: true, data: (data || []) as unknown as WatchlistItem[] };
  } catch (error) {
    console.error('getWatchlist error:', error);
    return { success: false, error: 'Failed to fetch watchlist' };
  }
};

export const addToWatchlist = async (
  userId: string,
  itemId: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('watchlist')
      .insert({ user_id: userId, item_id: itemId });

    if (error) {
      // unique constraint violation — already watching
      if (error.code === '23505') return { success: true };
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error) {
    console.error('addToWatchlist error:', error);
    return { success: false, error: 'Failed to add to watchlist' };
  }
};

export const removeFromWatchlist = async (
  userId: string,
  itemId: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('item_id', itemId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    console.error('removeFromWatchlist error:', error);
    return { success: false, error: 'Failed to remove from watchlist' };
  }
};
