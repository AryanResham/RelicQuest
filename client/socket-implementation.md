# Socket.IO Implementation Plan

## Current State

### What the server already does

The backend (`server/src/socket/socket.ts`) is fully set up:
- Creates a Socket.IO server attached to the HTTP server
- Manages two types of rooms:
  - `auction-{itemId}` — scoped to a single auction item (for the detail page)
  - `auctions-list` — receives updates for all auctions (for the browse page)
- Listens for room join/leave events from clients:
  - `join-auction` / `leave-auction`
  - `join-auctions-list` / `leave-auctions-list`

The bid controller (`server/src/controllers/bid.controller.ts`) already broadcasts after every successful bid:
```
getIO().to(`auction-${item_id}`).emit('bid-update', { itemId, newPrice, bidder, timestamp });
getIO().to('auctions-list').emit('bid-update', { itemId, newPrice, bidder, timestamp });
```

### What the frontend is missing

Nothing on the client is connected to the socket yet. Pages currently only get data through REST (React Query) — there is no live update mechanism. A user watching an auction has to manually refresh to see a new bid.

---

## Goal

Wire up the frontend so that when a bid is placed by **any** user:

1. The **product detail page** updates the current price instantly and refreshes the bid history
2. The **browse auctions page** updates that auction card's price live

All of this happens without a page refresh, without polling, and without extra API calls from the viewer.

---

## Architecture Decision: Singleton Socket File

We will **not** use a React context for the socket. Instead, a single shared `socket` instance is created once and exported from `src/lib/socket.ts`.

**Why not context?**
- Context makes sense when many deeply nested, disconnected components all need access to the same object.
- Here only 2 pages use the socket. A singleton import is simpler, has zero boilerplate, and `socket.io-client` is designed to be used as a singleton — calling `io()` with the same URL returns the same connection if one already exists.

**Why `autoConnect: false`?**
- Without this, the socket connects the moment `socket.ts` is imported — even on pages that don't need it (like the profile page).
- With `autoConnect: false`, the socket only opens a connection when `socket.connect()` is explicitly called inside the hook, and closes it on cleanup.

---

## Step 1 — Install `socket.io-client`

```bash
cd client
npm install socket.io-client
```

---

## Step 2 — Create `src/lib/socket.ts`

```ts
import { io } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
  withCredentials: true,
});
```

This file is imported wherever needed. The socket instance is created once for the lifetime of the app. `withCredentials: true` sends cookies with the handshake, consistent with how the REST API is configured.

---

## Step 3 — Create `src/hooks/useAuctionSocket.ts`

This is the only hook both pages will use. It handles:
- Connecting / disconnecting the socket
- Joining and leaving the right room
- Listening for `bid-update` events and applying them to the React Query cache

```ts
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '@/lib/socket';
import { queryKeys } from '@/lib/queryKeys';

interface BidUpdate {
  itemId: number;
  newPrice: number;
  bidder: string;
  timestamp: string;
}

interface UseAuctionSocketOptions {
  itemId?: string;   // pass this on the detail page
  joinList?: boolean; // pass this on the browse page
}

export function useAuctionSocket({ itemId, joinList = false }: UseAuctionSocketOptions) {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.connect();

    if (itemId) socket.emit('join-auction', itemId);
    if (joinList) socket.emit('join-auctions-list');

    socket.on('bid-update', (data: BidUpdate) => {

      // --- Detail Page Logic ---
      // Only runs when watching a specific auction
      if (itemId && String(data.itemId) === itemId) {

        // Directly write the new price into the item cache.
        // setQueryData = instant UI update, zero network calls.
        queryClient.setQueryData(queryKeys.items.detail(itemId), (old: any) => {
          if (!old) return old;
          return { ...old, current_price: data.newPrice };
        });

        // Invalidate bid history so Recent Activity refetches with the new bid.
        // We use invalidate (not setQueryData) because we need the full updated
        // bid list from the server, not just one number.
        queryClient.invalidateQueries({ queryKey: queryKeys.bids.byItem(data.itemId) });
      }

      // --- Browse Page Logic ---
      // Only runs when on the auctions list
      if (joinList) {

        // setQueriesData targets all cached pages at once (page 1, page 2, etc.)
        // It finds the auction card matching the bid's itemId and updates its price.
        queryClient.setQueriesData(
          { queryKey: queryKeys.items.all },
          (old: any) => {
            if (!old?.auctions) return old;
            return {
              ...old,
              auctions: old.auctions.map((a: any) =>
                a.id === data.itemId ? { ...a, current_price: data.newPrice } : a
              ),
            };
          }
        );
      }
    });

    return () => {
      if (itemId) socket.emit('leave-auction', itemId);
      if (joinList) socket.emit('leave-auctions-list');
      socket.off('bid-update');
      socket.disconnect();
    };
  }, [itemId, joinList, queryClient]);
}
```

### Why `setQueryData` instead of `invalidateQueries` for price updates?

`invalidateQueries` marks data as stale and triggers a refetch — a full round trip to the server.
`setQueryData` writes directly into the cache — the UI re-renders immediately with no network call.

For a price number that the socket just sent us, we already have the new value. There's no reason to go back to the server to ask for it. `setQueryData` is the right tool.

For bid history, we use `invalidateQueries` because the socket only sends `{ itemId, newPrice, bidder, timestamp }` — not the full bid object with all the fields `BiddingCard` needs. The server is the only place that has the complete data, so we refetch.

---

## Step 4 — Wire into `ProductDetailPage`

**Modify:** `src/pages/ProductDetailPage.tsx`

Add one import and one hook call alongside the existing React Query hooks:

```tsx
import { useAuctionSocket } from '@/hooks/useAuctionSocket';

// Inside the component, after useItem and useRelatedItems:
useAuctionSocket({ itemId: id });
```

**Full lifecycle on the detail page:**
1. User navigates to `/auction/123`
2. `useItem('123')` fetches item data via REST → React Query caches it
3. `useAuctionSocket({ itemId: '123' })` mounts → `socket.connect()` → `join-auction` emitted
4. User B on another tab places a bid → server validates → updates DB → emits `bid-update` to room `auction-123`
5. Socket receives event → `setQueryData` fires → `current_price` in cache updates
6. `BiddingCard` re-renders with new price — **no API call, no flicker**
7. `invalidateQueries` fires → `useItemBids` refetches → Recent Activity updates
8. User navigates away → cleanup runs → `leave-auction` emitted → `socket.disconnect()`

---

## Step 5 — Wire into `BrowseAuctionsPage`

**Modify:** `src/pages/BrowseAuctionsPage.tsx`

```tsx
import { useAuctionSocket } from '@/hooks/useAuctionSocket';

// Inside the component:
useAuctionSocket({ joinList: true });
```

**Full lifecycle on the browse page:**
1. User opens `/auctions`
2. `useLiveAuctions(1, 12)` fetches page 1 → React Query caches it under `['items', 'live', { page: 1, limit: 12 }]`
3. `useAuctionSocket({ joinList: true })` mounts → `socket.connect()` → `join-auctions-list` emitted
4. Any auction anywhere gets a new bid → server emits `bid-update` to `auctions-list` room
5. `setQueriesData` scans all cached pages and updates the matching auction card's price
6. Auction card re-renders with the new current bid — **live, across all cached pages**
7. User navigates away → `leave-auctions-list` → `socket.disconnect()`

---

## What each event does (full summary)

| Socket Event | Received by | React Query action | Why |
|---|---|---|---|
| `bid-update` | Detail page viewer | `setQueryData` on `['items', id]` | We have the new price, no need to refetch |
| `bid-update` | Detail page viewer | `invalidateQueries` on `['bids', 'item', id]` | Need full bid object from server |
| `bid-update` | Browse page viewer | `setQueriesData` on `['items', ...]` | Update card price across all cached pages |

---

## What we're NOT doing (and why)

| Skipped | Reason |
|---|---|
| Socket context/provider | Overkill for 2 pages. Singleton import is simpler |
| Reconnection logic | `socket.io-client` handles this automatically with exponential backoff |
| Optimistic updates for the bidder | The bidder already gets instant feedback from `useMutation`. Sockets serve the other viewers |
| Syncing auction end state via socket | End times are fixed values in the DB. The countdown timer on the detail page handles this client-side with `setInterval` |

---

## Files Summary

| Action | File | What it does |
|---|---|---|
| **INSTALL** | `socket.io-client` | Client library |
| **NEW** | `src/lib/socket.ts` | Singleton socket instance |
| **NEW** | `src/hooks/useAuctionSocket.ts` | All socket logic — connect, rooms, cache updates |
| **MODIFY** | `src/pages/ProductDetailPage.tsx` | Add `useAuctionSocket({ itemId: id })` |
| **MODIFY** | `src/pages/BrowseAuctionsPage.tsx` | Add `useAuctionSocket({ joinList: true })` |
