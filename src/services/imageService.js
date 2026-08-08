/**
 * Image Service Helper for React Native
 * Safely resolves local asset images (img1 - img5) and remote HTTP URLs
 */

const LOCAL_IMAGES = {
  img1: require('../../assets/img1.jpg'),
  img2: require('../../assets/img2.jpg'),
  img3: require('../../assets/img3.jpg'),
  img4: require('../../assets/img4.jpg'),
  img5: require('../../assets/img5.jpg'),
  'img1.jpg': require('../../assets/img1.jpg'),
  'img2.jpg': require('../../assets/img2.jpg'),
  'img3.jpg': require('../../assets/img3.jpg'),
  'img4.jpg': require('../../assets/img4.jpg'),
  'img5.jpg': require('../../assets/img5.jpg'),
};

const DEFAULT_FALLBACK = require('../../assets/img1.jpg');

export const getImageSource = (imageUri, imageResName) => {
  // 1. Check if imageResName is provided and exists in local assets
  if (imageResName && LOCAL_IMAGES[imageResName]) {
    return LOCAL_IMAGES[imageResName];
  }

  // 2. Check if imageUri is a local asset identifier
  if (imageUri && LOCAL_IMAGES[imageUri]) {
    return LOCAL_IMAGES[imageUri];
  }

  // 3. Check if imageUri is a valid web URL
  if (typeof imageUri === 'string' && (imageUri.startsWith('http://') || imageUri.startsWith('https://') || imageUri.startsWith('data:'))) {
    return { uri: imageUri };
  }

  // 4. Fallback to default img1 asset
  return DEFAULT_FALLBACK;
};

export const getTrackingImagesList = (hikeData) => {
  if (hikeData?.images && Array.isArray(hikeData.images) && hikeData.images.length > 0) {
    return hikeData.images.map(img => getImageSource(img));
  }

  // Default array of 5 local assets img1 -> img5
  return [
    LOCAL_IMAGES.img1,
    LOCAL_IMAGES.img2,
    LOCAL_IMAGES.img3,
    LOCAL_IMAGES.img4,
    LOCAL_IMAGES.img5
  ];
};
