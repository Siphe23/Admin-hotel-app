// src/utils/getBackgroundImages.js
import { storage } from '../Firebase/firebase';
import { ref, getDownloadURL } from 'firebase/storage';

export const getBackgroundImages = async () => {
    const imageNames = ['admin1.jpg', 'admin2.jpg', 'admin3.jpg']; // Updated image names

    const imageUrls = await Promise.all(
        imageNames.map(async (imageName) => {
            const imageRef = ref(storage, `Admin-images/${imageName}`); // Updated folder name
            try {
                const url = await getDownloadURL(imageRef);
                console.log(`Fetched URL for ${imageName}: ${url}`); // Logging for debugging
                return url;
            } catch (error) {
                console.error(`Error fetching image ${imageName}:`, error);
                return null; // Return null if there's an error
            }
        })
    );

    return imageUrls.filter(url => url !== null); // Filter out any null values
};

export default getBackgroundImages;
