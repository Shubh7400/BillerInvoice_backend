
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
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
    console.log('Uploading file to Cloudinary:', file.originalname);  // Log to see which file is being uploaded

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto' }, 
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error); // Log any upload error
            reject(error);
          } else {
            console.log('Cloudinary upload result:', result);  // Log the result from Cloudinary
            resolve(result);
          }
        }
      ).end(file.buffer);
    });
  }
}

