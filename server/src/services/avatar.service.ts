import { supabase } from "../config/supabase.js";
import type { AuthenticatedRequest } from "../types/types.js";
import type { Response } from "express";



const BUCKET_NAME = 'user_avatars';

export const uploadToSupabase = async(userId:string, file:Express.Multer.File) =>{
  try{
    const extension = file.mimetype.split('/')[1]; // 'jpeg', 'png', 'webp', 'gif'
    const fileName = `${userId}-avatar.${extension}`;

    const{data, error} = await supabase
      .storage
      .from(BUCKET_NAME)
      .upload(`${userId}/${fileName}`, file.buffer, {
        contentType: file.mimetype,
        upsert:true
      });

    if(error) throw error;

    const publicUrl = `https://vfnppezubhpdnfefwkjy.supabase.co/storage/v1/object/public/user_avatars/${userId}/${fileName}`;

    return {success:true, data:{avatarUrl:publicUrl}};

  }catch(error){
    console.error('uploadToSupabase error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload avatar';
    return {success:false, error: errorMessage};
  }

}