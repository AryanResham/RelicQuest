import dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables FIRST, before any other imports
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { uploadToCloudinary } from '../utils/cloudinary.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testCloudinaryUpload() {
  try {
    // Debug: Check if environment variables are loaded
    console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set');
    console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
    console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set');
    
    // Path to the test.jpg file in public/temp folder
    const filePath = path.join(__dirname, '../../../public/temp/test.jpg');
    
    console.log('Starting upload to Cloudinary...');
    console.log('File path:', filePath);
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(filePath, 'test');
    
    console.log('Upload successful!');
    console.log('Result:', result);
    
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

// Run the test
testCloudinaryUpload();