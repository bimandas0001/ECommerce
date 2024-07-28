import { bucket } from './firebaseConfig.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

// Function to upload photo from local storage to Firebase
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// async function uploadPhoto(localFilePath, destination) {
//   await bucket.upload(localFilePath, {
//     destination: destination,
//     metadata: {
//       cacheControl: 'public, max-age=31536000',
//     },
//   });

//   console.log(`${localFilePath} uploaded to ${destination}`);
  
//   // Get public URL
//   const file = bucket.file(destination);
//   const [url] = await file.getSignedUrl({
//     action: 'read',
//     expires: '12-12-2100', // Set an appropriate expiry date
//   });

//   console.log(`Public URL: ${url}`);
//   return url;
// }

// const localFilePath = path.join(__dirname, '../upload/images/cat1.jpg');
// const destination = 'uploads/photo.jpg';

// export const f = function() {
//     uploadPhoto(localFilePath, destination).catch(console.error);
// }


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
