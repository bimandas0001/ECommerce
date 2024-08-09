import { bucket } from './firebaseConfig.js';

// Function to upload photo from memeory storage to Firebase
export const uploadPhoto = async function (buffer, destination, mimetype) {
  try {
    const blob = bucket.file(destination);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: mimetype,
        cacheControl: 'public, max-age=31536000',
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        console.error('Blob stream error:', err);
        reject('Upload error');
      });

      blobStream.on('finish', async () => {
        const [url] = await blob.getSignedUrl({
          action: 'read',
          expires: '12-12-2100', // Set an appropriate expiry date
        });
        resolve(url);
      });

      blobStream.end(buffer);
    });
  } 
  catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Function to delete a photo from Firebase
export async function deletePhoto(publicUrl) {
  try {
    const url = new URL(publicUrl);    
    const pathname = url.pathname; // Get the path from the URL
    const filePath = pathname.split('/').slice(2).join('/'); // Extract the file path

    const file = bucket.file(filePath);
    await file.delete();
  } 
  catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}