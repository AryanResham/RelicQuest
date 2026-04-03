import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/supabase';
import { queryKeys } from '@/lib/queryKeys';
import type { Bid } from '@/lib/bid';

/**
 * Global Supabase Realtime subscription for bids.
 *
 * Call once at the app root (App.tsx). It listens for any new bid
 * and updates ALL relevant React Query caches instantly:
 *   - Item detail page  → current_price
 *   - Bid history list  → prepend the new bid
 *   - Browse/storefront → matching auction card price
 *   - User bids         → invalidated so it refetches
 */
export function useBidRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('bids-global')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bids' },
        (payload) => {
          const newBid = payload.new as Bid;
          const itemId = newBid.item_id;

          // 1. Update item detail cache (current_price)
          queryClient.setQueryData(
            queryKeys.items.detail(String(itemId)),
            (old: Record<string, unknown> | undefined) =>
              old ? { ...old, current_price: newBid.amount } : old
          );

          // 2. Prepend bid into the bid-history cache for that item
          queryClient.setQueriesData<Bid[]>(
            { queryKey: queryKeys.bids.byItem(itemId) },
            (old) => old ? [newBid, ...old] : [newBid]
          );

          // 3. Update auction card prices on browse/storefront pages
          queryClient.setQueriesData<{ auctions: { id: number; current_price: number }[]; total: number }>(
            { queryKey: queryKeys.items.all },
            (old) => {
              if (!old?.auctions) return old;
              return {
                ...old,
                auctions: old.auctions.map((a) =>
                  a.id === itemId ? { ...a, current_price: newBid.amount } : a
                ),
              };
            }
          );

          // 4. Invalidate user bids so profile page stays fresh
          queryClient.invalidateQueries({ queryKey: queryKeys.bids.byUser });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);
}
