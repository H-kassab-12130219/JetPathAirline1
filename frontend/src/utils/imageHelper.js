// Helper function to get the correct image URL
// If the image path starts with /uploads/, prepend the API base URL
// Otherwise, use it as-is (external URL)
import API_BASE_URL from '../config/api';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL (starts with http:// or https://), use it as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it starts with /uploads/, prepend the API base URL
  if (imagePath.startsWith('/uploads/')) {
    return API_BASE_URL + imagePath;
  }
  
  // Otherwise, use it as-is (might be a relative path or already full URL)
  return imagePath;
};

