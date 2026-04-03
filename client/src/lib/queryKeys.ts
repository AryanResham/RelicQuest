export const queryKeys = {
  items: {
    all: ['items'] as const,
    detail: (id: string) => ['items', id] as const,
    related: (id: string) => ['items', id, 'related'] as const,
    live: (page: number, limit: number) => ['items', 'live', { page, limit }] as const,
  },
  bids: {
    byItem: (itemId: number) => ['bids', 'item', itemId] as const,
  },
  users: {
    profile: (userId: string) => ['users', userId] as const,
  },
} as const;
