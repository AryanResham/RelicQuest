import {uploadToCloudinary} from '../utils/cloudinary';

const testUpload = async () => {
  try {
    const imagePath = './public/temp/test.jpg'; // Replace with your image path
    const result = await uploadToCloudinary(imagePath);
    console.log('Upload Test Result:', result);
  } catch (error) {
    console.error('Upload Test Error:', error);
  }
};

testUpload();