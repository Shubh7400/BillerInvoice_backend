import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<any> {
    console.log('Uploading file to Cloudinary:', file.originalname);

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto', // Automatically detect file type
          use_filename: true,    // Retain original filename
        },
        async (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload result:', result);
            const fileUrl = result.secure_url; // Direct URL
            const publicId = result.public_id; // Public ID for generating derived URLs
            const fileExtension = file.originalname.toLowerCase();

            // Generate viewUrl for documents
            let viewUrl = fileUrl;
            if (fileExtension.endsWith('.doc') || fileExtension.endsWith('.docx')) {
              viewUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}`;
            }

            // Generate image URL for preview
            let imageUrl = null;
            try {
              if (
                fileExtension.endsWith('.doc') ||
                fileExtension.endsWith('.docx') ||
                fileExtension.endsWith('.pdf')
              ) {
                imageUrl = cloudinary.url(publicId, {
                  format: 'jpg',
                  page: 1,  // Preview the first page
                  resource_type: 'image',
                });
              } else if (result.resource_type === 'image') {
                imageUrl = fileUrl; // Use original file URL for images
              }
            } catch (err) {
              console.error('Error generating image URL:', err);
            }

            resolve({
              url: fileUrl,
              viewUrl,  // URL for document preview
              imageUrl, // Image preview URL
            });
          }
        }
      ).end(file.buffer);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log(`File ${publicId} deleted from Cloudinary.`);
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error);
      throw new Error('Cloudinary deletion failed');
    }
  }
}


  

