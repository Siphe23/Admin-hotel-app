
import { storage } from '../Firebase/firebase';
import { ref, getDownloadURL } from 'firebase/storage';

export const getBackgroundImages = async () => {
    const imageNames = ['admin1.jpg', 'admin2.jpg', 'admin3.jpg']; 

    const imageUrls = await Promise.all(
        imageNames.map(async (imageName) => {
            const imageRef = ref(storage, `Admin-images/${imageName}`); 
            try {
                const url = await getDownloadURL(imageRef);
                console.log(`Fetched URL for ${imageName}: ${url}`); 
                return url;
            } catch (error) {
                console.error(`Error fetching image ${imageName}:`, error);
                return null; 
            }
        })
    );

    return imageUrls.filter(url => url !== null); 
};

export default getBackgroundImages;
