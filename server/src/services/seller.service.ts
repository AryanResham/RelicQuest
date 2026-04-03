import { supabase } from '../config/supabase.js';
import type { Seller } from '../types/types.js';

export const becomeSeller = async (
  userId: string,
  storeName: string,
  phoneNo: string | null
): Promise<{ success: boolean; data?: Seller; error?: string }> => {
  try {
    const { data: seller, error: sellerError } = await supabase
      .from('seller')
      .upsert({ id: userId, store_name: storeName, phone_no: phoneNo })
      .select()
      .single();

    if (sellerError) {
      console.error('Error upserting seller:', sellerError);
      return { success: false, error: sellerError.message };
    }

    const { error: userError } = await supabase
      .from('users')
      .update({ is_seller: true })
      .eq('id', userId);

    if (userError) {
      console.error('Error updating user is_seller:', userError);
      return { success: false, error: userError.message };
    }

    return { success: true, data: seller as Seller };
  } catch (error) {
    console.error('becomeSeller error:', error);
    return { success: false, error: 'Failed to register as seller' };
  }
};
