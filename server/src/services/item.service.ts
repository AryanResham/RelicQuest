import { supabase } from '../config/supabase.js';

import type { Item, ItemWithSeller } from '../types/types.js';

interface ImageFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

interface CreateItemDTO {
  title: string;
  description: string;
  start_price: number;
  min_price: number;
  bid_increment: number;
  end_time: string;
  category_id: number | null;
}

export const createItem = async (
  sellerId: string,
  itemData: CreateItemDTO,
  imageFiles: ImageFile[]
): Promise<{ success: boolean; data?: Item; error?: string }> => {
  try {
    // Step 1: Insert item with empty images to get the ID
    const { data: item, error: insertError } = await supabase
      .from('item')
      .insert({
        title: itemData.title,
        description: itemData.description,
        images: [],
        start_price: itemData.start_price,
        min_price: itemData.min_price,
        bid_increment: itemData.bid_increment,
        current_price: itemData.start_price,
        start_time: new Date().toISOString(),
        end_time: itemData.end_time,
        seller_id: sellerId,
        category_id: itemData.category_id,
        is_verified: false,
      })
      .select('id')
      .single();

    if (insertError || !item) {
      console.error('Error creating item:', insertError);
      return { success: false, error: insertError?.message || 'Failed to create listing' };
    }

    // Step 2: Upload each image buffer to Supabase Storage
    const imageUrls: string[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      if (!file) continue;
      const ext = file.originalname.split('.').pop();
      const filePath = `${sellerId}/${item.id}/${Date.now()}-${i}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('item_images')
        .upload(filePath, file.buffer, { contentType: file.mimetype });

      if (uploadError) {
        console.error(`Error uploading image ${i + 1}:`, uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('item_images')
        .getPublicUrl(filePath);

      imageUrls.push(publicUrl);
    }

    // Step 3: Update item with collected image URLs
    const { data: updatedItem, error: updateError } = await supabase
      .from('item')
      .update({ images: imageUrls })
      .eq('id', item.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating item images:', updateError);
    }

    return { success: true, data: (updatedItem || item) as Item };
  } catch (error) {
    console.error('createItem error:', error);
    return { success: false, error: 'Failed to create item' };
  }
};

// Item interface matching Supabase schema


/**
 * Close an ended auction: find the highest bidder and set winner_id.
 * Safe to call multiple times — only updates if winner_id is still null.
 */
export const closeAuction = async (itemId: number): Promise<void> => {
  try {
    const { data: topBid } = await supabase
      .from('bids')
      .select('user_id, amount')
      .eq('item_id', itemId)
      .order('amount', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: updated } = await supabase
      .from('item')
      .update({ winner_id: topBid?.user_id ?? null, status: 'ended' })
      .eq('id', itemId)
      .is('winner_id', null) // no-op if already closed
      .select('title, current_price')
      .maybeSingle();

    // Send winner email if Resend is configured and there is a winner
    if (updated && topBid?.user_id && process.env.RESEND_API_KEY) {
      const { data: winner } = await supabase
        .from('users')
        .select('email, username')
        .eq('id', topBid.user_id)
        .single();

      if (winner?.email) {
        const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(topBid.amount);
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM ?? 'RelicQuest <noreply@relicquest.com>',
            to: winner.email,
            subject: `You won "${updated.title}"!`,
            html: `
              <h2>Congratulations${winner.username ? `, ${winner.username}` : ''}!</h2>
              <p>You won the auction for <strong>${updated.title}</strong> with a winning bid of <strong>${price}</strong>.</p>
              <p>The seller will be in touch shortly to arrange delivery.</p>
              <br/>
              <p>— The RelicQuest Team</p>
            `,
          }),
        }).catch(err => console.error('Failed to send winner email:', err));
      }
    }
  } catch (error) {
    console.error('closeAuction error:', error);
  }
};

export const getItemById = async (id: string): Promise<{ success: boolean; data?: ItemWithSeller; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('item')
      .select(`*, seller (*)`)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching item:', error);
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: 'Item not found' };
    }

    // Lazily close the auction if it ended but winner hasn't been set yet
    if (new Date(data.end_time) < new Date() && data.winner_id === null) {
      await closeAuction(data.id);
      const { data: updated } = await supabase
        .from('item')
        .select(`*, seller (*)`)
        .eq('id', id)
        .single();
      if (updated) return { success: true, data: updated as ItemWithSeller };
    }

    return { success: true, data: data as ItemWithSeller };
  } catch (error) {
    console.error('getItemById error:', error);
    return { success: false, error: 'Failed to fetch item' };
  }
};

export const getLiveItems = async (page:number = 1, limit:number = 12): Promise<{ success: boolean; data?: Item[]; total?: number; error?: string }> => {
  try {
    const now = new Date().toISOString();
    const from = (page-1) *limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await supabase
      .from('item')
      .select(`
        *,
        seller (*)
      `, { count: 'exact' })
      .gt('end_time', now)
      .order('end_time', { ascending: true })
      .range(from, to);

    if (error) {
      console.error('Error fetching live items:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: (data || []) as Item[], total: count || 0 };
  } catch (error) {
    console.error('getLiveItems error:', error);
    return { success: false, error: 'Failed to fetch items' };
  }
};

/**
 * Get all items listed by a seller
 */
export const getItemsBySeller = async (
  sellerId: string
): Promise<{ success: boolean; data?: Item[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('item')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching seller items:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: (data || []) as Item[] };
  } catch (error) {
    console.error('getItemsBySeller error:', error);
    return { success: false, error: 'Failed to fetch items' };
  }
};

/**
 * Get all items won by a user
 */
export const getWonItems = async (
  userId: string
): Promise<{ success: boolean; data?: ItemWithSeller[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('item')
      .select('*, seller(*)')
      .eq('winner_id', userId)
      .order('end_time', { ascending: false });

    if (error) {
      console.error('Error fetching won items:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: (data || []) as ItemWithSeller[] };
  } catch (error) {
    console.error('getWonItems error:', error);
    return { success: false, error: 'Failed to fetch won items' };
  }
};

/**
 * Get related items (same category, excluding current item)
 */
export const getRelatedItems = async (
  itemId: string,
  categoryId: number | null,
  limit: number = 5
): Promise<{ success: boolean; data?: Item[]; error?: string }> => {
  try {
    const now = new Date().toISOString();
    
    let query = supabase
      .from('item')
      .select('*')
      .neq('id', itemId)
      .gt('end_time', now)
      .limit(limit);
    
    // If item has a category, prioritize same category
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching related items:', error);
      return { success: false, error: error.message };
    }

    // If not enough items from same category, get more items
    if (data && data.length < limit) {
      const { data: moreData } = await supabase
        .from('item')
        .select('*')
        .neq('id', itemId)
        .gt('end_time', now)
        .not('id', 'in', `(${data.map(d => d.id).join(',')})`)
        .limit(limit - data.length);
      
      if (moreData) {
        return { success: true, data: [...data, ...moreData] as Item[] };
      }
    }

    return { success: true, data: (data || []) as ItemWithSeller[] };
  } catch (error) {
    console.error('getRelatedItems error:', error);
    return { success: false, error: 'Failed to fetch related items' };
  }
};
