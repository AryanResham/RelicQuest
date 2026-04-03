-- ============================================
-- Row Level Security policies for RelicQuest
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.item enable row level security;
alter table public.bids enable row level security;
alter table public.seller enable row level security;
alter table public.watchlist enable row level security;

-- ============================================
-- USERS
-- ============================================
create policy "Anyone can read user profiles"
  on public.users for select
  using (true);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- ============================================
-- ITEM
-- ============================================
create policy "Anyone can read items"
  on public.item for select
  using (true);

create policy "Sellers can create items"
  on public.item for insert
  with check (auth.uid() = seller_id);

create policy "Sellers can update own items"
  on public.item for update
  using (auth.uid() = seller_id);

-- ============================================
-- BIDS
-- ============================================
create policy "Anyone can read bids"
  on public.bids for select
  using (true);

create policy "Authenticated users can place bids"
  on public.bids for insert
  with check (auth.uid() = user_id);

-- No update or delete — bids are immutable

-- ============================================
-- SELLER
-- ============================================
create policy "Anyone can read seller profiles"
  on public.seller for select
  using (true);

create policy "Users can create own seller profile"
  on public.seller for insert
  with check (auth.uid() = id);

create policy "Sellers can update own profile"
  on public.seller for update
  using (auth.uid() = id);

-- ============================================
-- WATCHLIST
-- ============================================
create policy "Users can read own watchlist"
  on public.watchlist for select
  using (auth.uid() = user_id);

create policy "Users can add to own watchlist"
  on public.watchlist for insert
  with check (auth.uid() = user_id);

create policy "Users can remove from own watchlist"
  on public.watchlist for delete
  using (auth.uid() = user_id);

-- ============================================
-- STORAGE: item_images bucket
-- ============================================
create policy "Anyone can read item images"
  on storage.objects for select
  using (bucket_id = 'item_images');

create policy "Sellers can upload to own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'item_images'
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1 from public.users
      where id = auth.uid() and is_seller = true
    )
  );

create policy "Sellers can update own images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'item_images'
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1 from public.users
      where id = auth.uid() and is_seller = true
    )
  );

create policy "Sellers can delete own images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'item_images'
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1 from public.users
      where id = auth.uid() and is_seller = true
    )
  );
