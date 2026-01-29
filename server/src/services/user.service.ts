import { supabase } from '../config/supabase.js';
import type { User, UpdateUserDTO, ApiResponse } from '../types/types.js';

// simple function to get user by id
export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('getUserById error:', error);
    return { success: false, error: 'Failed to fetch user' };
  }
};

// simple function to update only the username
export const updateUser = async (
  id: string,
  updates: UpdateUserDTO
): Promise<ApiResponse<User>> => {
  try {
    // Only allow username updates
    const allowedUpdates: UpdateUserDTO = {};
    if (updates.username !== undefined) {
      allowedUpdates.username = updates.username;
    }

    if (Object.keys(allowedUpdates).length === 0) {
      return { success: false, error: 'No valid fields to update' };
    }

    const { data, error } = await supabase
      .from('users')
      .update(allowedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data, message: 'User updated successfully' };
  } catch (error) {
    console.error('updateUser error:', error);
    return { success: false, error: 'Failed to update user' };
  }
};

/**
 * Update user avatar URL in the database
 */
export const updateUserAvatar = async (
  id: string,
  avatarUrl: string
): Promise<ApiResponse<User>> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ avatar: avatarUrl })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data, message: 'Avatar updated successfully' };
  } catch (error) {
    console.error('updateUserAvatar error:', error);
    return { success: false, error: 'Failed to update avatar' };
  }
};

/**
 * Delete user from the users table
 * Note: This only deletes from public.users, not auth.users
 * For full deletion, you'd need Supabase admin functions
 */
export const deleteUser = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    console.error('deleteUser error:', error);
    return { success: false, error: 'Failed to delete user' };
  }
};
